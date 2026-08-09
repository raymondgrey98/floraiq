/**
 * Licence & entitlement service — server-side enforcement of the freemium plan.
 *
 * This is the piece that makes FloraIQ safe to charge money for: the daily scan
 * limit is counted here, on the server, where a user can't edit it.
 *
 * Storage is a JSON file, so there's no database to run or pay for. It handles
 * thousands of users comfortably; swap in Postgres only when you outgrow it.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const DATA_DIR = process.env.FLORAIQ_DATA_DIR || path.resolve(process.cwd(), ".data");
const STORE_FILE = path.join(DATA_DIR, "licences.json");

/** Daily allowance for free users. Override with FREE_SCANS_PER_DAY. */
export const FREE_SCANS_PER_DAY = Number(process.env.FREE_SCANS_PER_DAY ?? 10);

/** Set ENFORCE_LIMITS=true in production to actually block over-limit scans. */
export const ENFORCE_LIMITS = process.env.ENFORCE_LIMITS === "true";

export type Plan = "free" | "pro";

interface Licence {
  key: string;
  plan: Plan;
  owner?: string;          // customer name / email, for your records
  createdAt: string;
  expiresAt?: string;      // ISO date; omit for perpetual
  deviceIds: string[];     // devices that activated this key
  maxDevices: number;
}

interface DeviceUsage { day: string; scans: number; }

interface Store {
  licences: Record<string, Licence>;   // key -> licence
  usage: Record<string, DeviceUsage>;  // deviceId -> usage
  devicePlan: Record<string, string>;  // deviceId -> licence key
}

// ── Persistence ──────────────────────────────────────────────────────────────

let store: Store = { licences: {}, usage: {}, devicePlan: {} };
let loaded = false;

function load(): void {
  if (loaded) return;
  loaded = true;
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    if (fs.existsSync(STORE_FILE)) {
      store = { licences: {}, usage: {}, devicePlan: {}, ...JSON.parse(fs.readFileSync(STORE_FILE, "utf8")) };
    }
  } catch (e: any) {
    console.warn("[licence] could not load store:", e?.message);
  }
}

let saveTimer: NodeJS.Timeout | null = null;
function save(): void {
  // Debounced so a burst of scans doesn't hammer the disk
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), "utf8");
    } catch (e: any) {
      console.warn("[licence] could not save store:", e?.message);
    }
  }, 1000);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

// ── Licence keys ─────────────────────────────────────────────────────────────

/** Generate a licence key to sell, e.g. FLORAIQ-PRO-A1B2-C3D4-E5F6. */
export function createLicence(opts: {
  plan?: Plan; owner?: string; expiresAt?: string; maxDevices?: number;
} = {}): Licence {
  load();
  const rand = crypto.randomBytes(9).toString("hex").toUpperCase();
  const key = `FLORAIQ-${(opts.plan ?? "pro").toUpperCase()}-${rand.slice(0, 4)}-${rand.slice(4, 8)}-${rand.slice(8, 12)}`;
  const licence: Licence = {
    key,
    plan: opts.plan ?? "pro",
    owner: opts.owner,
    createdAt: new Date().toISOString(),
    expiresAt: opts.expiresAt,
    deviceIds: [],
    maxDevices: opts.maxDevices ?? 3,
  };
  store.licences[key] = licence;
  save();
  return licence;
}

function licenceValid(l: Licence | undefined): l is Licence {
  if (!l) return false;
  if (l.expiresAt && new Date(l.expiresAt).getTime() < Date.now()) return false;
  return true;
}

/** Activate a key on a device. Returns the plan, or an error reason. */
export function activateLicence(key: string, deviceId: string):
  { ok: true; plan: Plan; expiresAt?: string } | { ok: false; error: string } {
  load();
  const licence = store.licences[key?.trim().toUpperCase()];
  if (!licence) return { ok: false, error: "Unknown licence key" };
  if (!licenceValid(licence)) return { ok: false, error: "Licence has expired" };

  if (!licence.deviceIds.includes(deviceId)) {
    if (licence.deviceIds.length >= licence.maxDevices) {
      return { ok: false, error: `Licence already used on ${licence.maxDevices} devices` };
    }
    licence.deviceIds.push(deviceId);
  }
  store.devicePlan[deviceId] = licence.key;
  save();
  return { ok: true, plan: licence.plan, expiresAt: licence.expiresAt };
}

/** What plan is this device on? */
export function planFor(deviceId: string): Plan {
  load();
  const key = store.devicePlan[deviceId];
  const licence = key ? store.licences[key] : undefined;
  return licenceValid(licence) ? licence.plan : "free";
}

// ── Usage + enforcement ──────────────────────────────────────────────────────

export interface Entitlement {
  plan: Plan;
  scansToday: number;
  remaining: number;      // Infinity-safe: -1 means unlimited
  limit: number;          // -1 means unlimited
  enforced: boolean;
}

export function entitlementFor(deviceId: string): Entitlement {
  load();
  const plan = planFor(deviceId);
  const u = store.usage[deviceId];
  const scansToday = u && u.day === today() ? u.scans : 0;
  const unlimited = plan === "pro" || !ENFORCE_LIMITS;
  return {
    plan,
    scansToday,
    remaining: unlimited ? -1 : Math.max(0, FREE_SCANS_PER_DAY - scansToday),
    limit: unlimited ? -1 : FREE_SCANS_PER_DAY,
    enforced: ENFORCE_LIMITS,
  };
}

/** True when the device may run another scan. */
export function canScan(deviceId: string): boolean {
  const e = entitlementFor(deviceId);
  return e.remaining === -1 || e.remaining > 0;
}

/** Count a scan against the device's daily allowance. */
export function recordScan(deviceId: string): void {
  load();
  const u = store.usage[deviceId];
  store.usage[deviceId] = (u && u.day === today())
    ? { day: u.day, scans: u.scans + 1 }
    : { day: today(), scans: 1 };
  save();
}

/** Simple totals for your own dashboard. */
export function stats() {
  load();
  const licences = Object.values(store.licences);
  return {
    totalLicences: licences.length,
    activeProDevices: Object.keys(store.devicePlan).length,
    devicesSeen: Object.keys(store.usage).length,
    scansToday: Object.values(store.usage)
      .filter(u => u.day === today())
      .reduce((sum, u) => sum + u.scans, 0),
  };
}
