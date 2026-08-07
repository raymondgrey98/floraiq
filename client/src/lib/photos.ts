/**
 * Photo saving — every scan is kept as a real file on the phone.
 *
 * Photos go to Documents/FloraIQ/ on the device, named with the date and the
 * species so they're easy to browse, copy off, or share back for review.
 * A JSON sidecar (scan-log.json) records what the AI said about each one.
 *
 * Web is a no-op: the browser already keeps scans in the journal.
 */
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

const FOLDER = "FloraIQ";
const LOG = `${FOLDER}/scan-log.json`;

export interface SavedPhoto { path: string; uri?: string; }

/** Filesystem-safe file name: 2026-07-22_1432_Monstera-deliciosa.jpg */
function makeName(species: string): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  const safe = (species || "unknown").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
  return `${stamp}_${safe}.jpg`;
}

async function ensureFolder(): Promise<void> {
  try {
    await Filesystem.mkdir({ path: FOLDER, directory: Directory.Documents, recursive: true });
  } catch {
    // already exists — fine
  }
}

/**
 * Save a scan photo to Documents/FloraIQ/ and append it to the scan log.
 * Returns null on web or if saving fails (never throws — saving is a bonus,
 * it must not break the scan flow).
 */
export async function savePhoto(
  dataUrl: string,
  meta: { species: string; common?: string; confidence?: number; lat?: number; lng?: number },
): Promise<SavedPhoto | null> {
  if (!Capacitor.isNativePlatform() || !dataUrl) return null;

  try {
    await ensureFolder();
    const name = makeName(meta.common || meta.species);
    const path = `${FOLDER}/${name}`;
    const base64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;

    const res = await Filesystem.writeFile({
      path,
      data: base64,
      directory: Directory.Documents,
    });

    // Append to the scan log so each photo has its identification attached
    try {
      let log: unknown[] = [];
      try {
        const existing = await Filesystem.readFile({
          path: LOG, directory: Directory.Documents, encoding: Encoding.UTF8,
        });
        log = JSON.parse(String(existing.data)) as unknown[];
      } catch { /* first entry */ }

      log.unshift({
        file: name,
        scientificName: meta.species,
        commonName: meta.common,
        confidence: meta.confidence,
        lat: meta.lat,
        lng: meta.lng,
        date: new Date().toISOString(),
      });

      await Filesystem.writeFile({
        path: LOG,
        data: JSON.stringify(log.slice(0, 1000), null, 2),
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
    } catch { /* log is a nicety — ignore failures */ }

    return { path, uri: res.uri };
  } catch (e: any) {
    console.warn("[photos] save failed:", e?.message ?? e);
    return null;
  }
}

/** List saved scan photos (newest first). */
export async function listPhotos(): Promise<string[]> {
  if (!Capacitor.isNativePlatform()) return [];
  try {
    const res = await Filesystem.readdir({ path: FOLDER, directory: Directory.Documents });
    return res.files
      .map(f => (typeof f === "string" ? f : f.name))
      .filter(n => n.endsWith(".jpg"))
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

/** Where the photos live, for showing the user. */
export const PHOTO_FOLDER_LABEL = "Documents/FloraIQ";
