/**
 * Entitlements — the freemium engine.
 *
 * Free users get a daily scan allowance; Pro is unlimited. This is the switch
 * that turns FloraIQ from a free app into a business.
 *
 * NOTE: this is client-side enforcement, which is fine for honest users and for
 * measuring demand. Before charging real money, move the check server-side
 * (the same functions can call your API) so it can't be bypassed.
 */

export type Plan = "free" | "pro";

export const FREE_SCANS_PER_DAY = 10;

/**
 * Limits are OFF by default so your own build stays unlimited.
 * Turn them on for the commercial build with VITE_ENFORCE_LIMITS=true.
 */
export const ENFORCE_LIMITS = import.meta.env.VITE_ENFORCE_LIMITS === "true";

const PLAN_KEY = "floraiq_plan";
const USAGE_KEY = "floraiq_usage";
const LICENSE_KEY = "floraiq_license";

interface Usage { day: string; scans: number; }

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function readUsage(): Usage {
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    const u = raw ? (JSON.parse(raw) as Usage) : null;
    if (u && u.day === today()) return u;
  } catch { /* fall through */ }
  return { day: today(), scans: 0 };
}

function writeUsage(u: Usage): void {
  try { localStorage.setItem(USAGE_KEY, JSON.stringify(u)); } catch { /* ignore */ }
}

export function getPlan(): Plan {
  try {
    return localStorage.getItem(PLAN_KEY) === "pro" ? "pro" : "free";
  } catch {
    return "free";
  }
}

export function isPro(): boolean {
  return getPlan() === "pro";
}

/** Activate Pro (call after a successful purchase or with a licence key). */
export function activatePro(licenseKey?: string): void {
  try {
    localStorage.setItem(PLAN_KEY, "pro");
    if (licenseKey) localStorage.setItem(LICENSE_KEY, licenseKey);
  } catch { /* ignore */ }
}

export function deactivatePro(): void {
  try {
    localStorage.removeItem(PLAN_KEY);
    localStorage.removeItem(LICENSE_KEY);
  } catch { /* ignore */ }
}

/** Scans left today. Infinity for Pro or when limits are off. */
export function scansRemaining(): number {
  if (isPro() || !ENFORCE_LIMITS) return Infinity;
  return Math.max(0, FREE_SCANS_PER_DAY - readUsage().scans);
}

/** Can the user scan right now? */
export function canScan(): boolean {
  return scansRemaining() > 0;
}

/** Scans made today (tracked even when limits are off, so you can see demand). */
export function scansToday(): number {
  return readUsage().scans;
}

/** Record a scan. Call once per successful identification. */
export function recordScan(): void {
  const u = readUsage();
  writeUsage({ day: u.day, scans: u.scans + 1 });
}

/** Human-readable status for the UI. */
export function usageLabel(): string {
  if (isPro()) return "Pro · unlimited scans";
  if (!ENFORCE_LIMITS) return `${scansToday()} scans today`;
  const left = scansRemaining();
  return left === 0
    ? "Daily free scans used up"
    : `${left} of ${FREE_SCANS_PER_DAY} free scans left today`;
}
