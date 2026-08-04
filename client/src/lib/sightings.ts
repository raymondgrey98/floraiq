/**
 * Sightings — every scan you take, GPS-pinned and stored on the device.
 *
 * Works with no backend (the installed app is standalone). If a backend is
 * configured later, these can be synced up to become community observations.
 */

export interface Sighting {
  id: number;
  name: string;
  scientific: string;
  photoUrl?: string;      // small thumbnail
  lat: number;
  lng: number;
  date: string;           // ISO
  scanMode?: string;
  confidence?: number;
  synced?: boolean;       // reserved for future cloud sync
}

const KEY = "floraiq_sightings";
const MAX = 500;

export function getSightings(): Sighting[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as Sighting[]) : [];
    return list.filter(s => typeof s.lat === "number" && typeof s.lng === "number");
  } catch {
    return [];
  }
}

/** Save a sighting. Silently skips when there's no location fix. */
export function addSighting(s: Omit<Sighting, "id" | "date"> & { date?: string }): Sighting | null {
  if (typeof s.lat !== "number" || typeof s.lng !== "number") return null;
  try {
    const entry: Sighting = {
      ...s,
      id: Date.now(),
      date: s.date ?? new Date().toISOString(),
      synced: false,
    };
    const list = getSightings();
    list.unshift(entry);
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
    return entry;
  } catch {
    return null; // storage full — non-fatal
  }
}

export function removeSighting(id: number): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(getSightings().filter(s => s.id !== id)));
  } catch { /* non-fatal */ }
}

/** Simple stats for the profile / map header. */
export function sightingStats() {
  const list = getSightings();
  const species = new Set(list.map(s => s.scientific).filter(Boolean));
  return { total: list.length, uniqueSpecies: species.size };
}

/** Export as GeoJSON — useful for GIS tools or contributing to science. */
export function toGeoJSON() {
  return {
    type: "FeatureCollection",
    features: getSightings().map(s => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [s.lng, s.lat] },
      properties: {
        name: s.name,
        scientificName: s.scientific,
        date: s.date,
        confidence: s.confidence,
        scanMode: s.scanMode,
      },
    })),
  };
}
