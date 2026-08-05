/**
 * NearbySpecies — "what's around me right now", inspired by iNaturalist/Seek.
 *
 * Uses your GPS fix to ask GBIF which species have actually been recorded
 * near you, ranks them by how often they're seen, then pulls a photo for each
 * from iNaturalist. Works with no backend (direct API calls), so it runs in
 * the installed app.
 */
import { useEffect, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";

interface NearbyTaxon { name: string; common?: string; photo?: string; count: number; }

/** Rough degree offset for a radius in km (good enough for a local query). */
function boxAround(lat: number, lng: number, km: number) {
  const dLat = km / 111;
  const dLng = km / (111 * Math.max(Math.cos((lat * Math.PI) / 180), 0.01));
  return {
    latMin: (lat - dLat).toFixed(4), latMax: (lat + dLat).toFixed(4),
    lngMin: (lng - dLng).toFixed(4), lngMax: (lng + dLng).toFixed(4),
  };
}

export default function NearbySpecies({ radiusKm = 25, limit = 10 }: { radiusKm?: number; limit?: number }) {
  const [items, setItems] = useState<NearbyTaxon[] | null>(null);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // 1. Where are we?
      let pos: GeolocationPosition;
      try {
        pos = await new Promise<GeolocationPosition>((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8000, maximumAge: 300_000 }),
        );
      } catch {
        if (!cancelled) { setDenied(true); setItems([]); }
        return;
      }

      const { latitude: lat, longitude: lng } = pos.coords;
      const box = boxAround(lat, lng, radiusKm);

      try {
        // 2. What has been recorded around here? (GBIF, free, no key)
        const params = new URLSearchParams({
          limit: "300",
          hasCoordinate: "true",
          hasGeospatialIssue: "false",
          occurrenceStatus: "PRESENT",
          decimalLatitude: `${box.latMin},${box.latMax}`,
          decimalLongitude: `${box.lngMin},${box.lngMax}`,
        });
        const res = await fetch(`https://api.gbif.org/v1/occurrence/search?${params}`, {
          signal: AbortSignal.timeout(12_000),
        });
        if (!res.ok) throw new Error("GBIF unavailable");
        const data = await res.json();

        // 3. Rank species by how often they show up nearby
        const tally = new Map<string, number>();
        for (const o of data.results ?? []) {
          const name = o.species;
          if (name) tally.set(name, (tally.get(name) ?? 0) + 1);
        }
        const top = [...tally.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, limit)
          .map(([name, count]) => ({ name, count }));

        if (top.length === 0) { if (!cancelled) setItems([]); return; }
        if (!cancelled) setItems(top); // show names immediately

        // 4. Add photos + common names from iNaturalist, best-effort
        const withPhotos = await Promise.all(
          top.map(async t => {
            try {
              const r = await fetch(
                `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(t.name)}&rank=species&per_page=1`,
                { signal: AbortSignal.timeout(8000) },
              );
              const d = await r.json();
              const hit = d?.results?.[0];
              return {
                ...t,
                common: hit?.preferred_common_name,
                photo: hit?.default_photo?.square_url || hit?.default_photo?.medium_url,
              };
            } catch {
              return t;
            }
          }),
        );
        if (!cancelled) setItems(withPhotos);
      } catch {
        if (!cancelled) setItems([]);
      }
    })();

    return () => { cancelled = true; };
  }, [radiusKm, limit]);

  // Nothing useful to show — stay out of the way.
  if (items && items.length === 0 && !denied) return null;

  return (
    <section style={{ marginBottom: 36 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h2 style={{ fontWeight: 900, fontSize: 15, margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
          <MapPin size={15} color="#34d399" /> Found near you
        </h2>
        {items && items.length > 0 && (
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>within {radiusKm} km</span>
        )}
      </div>

      {denied ? (
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
          Turn on location to see what wildlife has been recorded around you.
        </p>
      ) : items === null ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
          <Loader2 size={14} className="animate-spin" /> Checking what lives around you…
        </div>
      ) : (
        <div
          className="no-scroll"
          style={{ display: "flex", gap: 12, overflowX: "auto", margin: "0 -16px", padding: "0 16px 6px" }}>
          {items.map(t => (
            <a
              key={t.name}
              href={`https://www.inaturalist.org/search?q=${encodeURIComponent(t.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ flexShrink: 0, width: 104, textDecoration: "none" }}>
              <div
                style={{
                  width: 104, height: 104, borderRadius: 16, overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.08)", background: "rgba(16,185,129,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                {t.photo
                  ? <img src={t.photo} alt={t.common || t.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <MapPin size={22} color="rgba(52,211,153,0.5)" />}
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, marginTop: 6, color: "rgba(255,255,255,0.85)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {t.common || t.name}
              </p>
              <p style={{ fontSize: 9.5, color: "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {t.count} sighting{t.count === 1 ? "" : "s"} nearby
              </p>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
