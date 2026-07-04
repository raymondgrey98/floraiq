/**
 * Verified reference photos for an identified species.
 *
 * Sources, in order:
 *   1. iNaturalist taxa API (api.inaturalist.org — public, no key). Only
 *      photos carrying a Creative Commons license_code are used, and the
 *      photographer attribution string is preserved for display.
 *   2. Wikipedia page image (REST summary endpoint) as a fallback.
 *
 * Results are cached in localStorage so a species costs the network once.
 */

export interface ReferencePhoto {
  url: string;           // medium-size image URL
  attribution: string;   // e.g. "(c) Jane Doe, some rights reserved (CC BY-NC)"
  license: string;       // e.g. "cc-by-nc" or "wikipedia"
  sourceUrl: string;     // page to open on tap (iNat taxon / Wikipedia article)
}

const CACHE_KEY = "floraiq_ref_photos";
const CACHE_MAX = 60; // species entries kept

function readCache(): Record<string, ReferencePhoto[]> {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch { return {}; }
}

function writeCache(cache: Record<string, ReferencePhoto[]>) {
  try {
    const keys = Object.keys(cache);
    if (keys.length > CACHE_MAX) delete cache[keys[0]];
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch { /* storage full/private — cache is best-effort */ }
}

async function fromINaturalist(name: string): Promise<ReferencePhoto[]> {
  const search = await fetch(
    `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(name)}&per_page=1`,
  ).then(r => (r.ok ? r.json() : null));
  const taxon = search?.results?.[0];
  if (!taxon?.id) return [];

  // Detail call carries the full taxon_photos list (search does not)
  const detail = await fetch(`https://api.inaturalist.org/v1/taxa/${taxon.id}`)
    .then(r => (r.ok ? r.json() : null));
  const photos: any[] = detail?.results?.[0]?.taxon_photos ?? [];

  return photos
    .map(tp => tp.photo)
    .filter(p => p?.medium_url && p?.license_code) // CC-licensed only
    .slice(0, 4)
    .map(p => ({
      url: p.medium_url as string,
      attribution: (p.attribution as string) || "iNaturalist contributor",
      license: p.license_code as string,
      sourceUrl: `https://www.inaturalist.org/taxa/${taxon.id}`,
    }));
}

async function fromWikipedia(name: string): Promise<ReferencePhoto[]> {
  const summary = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`,
  ).then(r => (r.ok ? r.json() : null));
  const img = summary?.thumbnail?.source || summary?.originalimage?.source;
  if (!img) return [];
  return [{
    url: img,
    attribution: "Wikipedia / Wikimedia Commons",
    license: "wikipedia",
    sourceUrl: summary?.content_urls?.desktop?.page
      || `https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`,
  }];
}

export async function getReferencePhotos(scientificName: string): Promise<ReferencePhoto[]> {
  const key = scientificName.trim().toLowerCase();
  if (!key) return [];

  const cache = readCache();
  if (cache[key]) return cache[key];

  let photos: ReferencePhoto[] = [];
  try { photos = await fromINaturalist(scientificName); } catch { /* offline */ }
  if (photos.length === 0) {
    try { photos = await fromWikipedia(scientificName); } catch { /* offline */ }
  }

  if (photos.length > 0) {
    cache[key] = photos;
    writeCache(cache);
  }
  return photos;
}
