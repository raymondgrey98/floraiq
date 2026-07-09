/**
 * SimilarSpecies — "commonly confused with / related species" strip, PictureThis-style.
 * Pulls real photos of species in the same genus from the free iNaturalist API
 * (no key), ranked by how often they're observed. Purely additive + graceful:
 * renders nothing if the name isn't a real binomial or nothing is found.
 */
import { useEffect, useState } from "react";
import { Sparkles, ExternalLink } from "lucide-react";

interface SimTaxon { id: number; name: string; common?: string; photo?: string; }

function looksLikeBinomial(name: string): boolean {
  const n = (name || "").trim();
  const words = n.split(/\s+/);
  return words.length >= 2 && words.length <= 4 && n.length <= 40 && /^[A-Za-z×]/.test(n);
}

export default function SimilarSpecies({ scientificName }: { scientificName: string }) {
  const [items, setItems] = useState<SimTaxon[] | null>(null);

  useEffect(() => {
    if (!looksLikeBinomial(scientificName)) { setItems([]); return; }
    const genus = scientificName.trim().split(/\s+/)[0];
    const ctrl = new AbortController();
    setItems(null);

    fetch(
      `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(genus)}&rank=species&per_page=24&order=desc&order_by=observations_count`,
      { signal: ctrl.signal },
    )
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        const list: SimTaxon[] = (data?.results ?? [])
          .filter((t: any) => t?.default_photo && t?.name?.toLowerCase() !== scientificName.toLowerCase())
          .slice(0, 10)
          .map((t: any) => ({
            id: t.id,
            name: t.name,
            common: t.preferred_common_name,
            photo: t.default_photo?.medium_url || t.default_photo?.square_url,
          }));
        setItems(list);
      })
      .catch(() => setItems([]));

    return () => ctrl.abort();
  }, [scientificName]);

  // Nothing relevant — stay out of the way entirely.
  if (items && items.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ color: "rgba(52,211,153,0.6)" }}>
        <Sparkles size={12} /> Similar &amp; related species
      </p>

      <div
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(16,185,129,0.25) transparent", margin: "0 -4px", padding: "0 4px 8px" }}>
        {items === null
          ? // loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex-shrink-0" style={{ width: 116 }}>
                <div className="rounded-xl animate-pulse" style={{ width: 116, height: 116, background: "rgba(255,255,255,0.06)" }} />
                <div className="animate-pulse mt-2 rounded" style={{ height: 9, width: "80%", background: "rgba(255,255,255,0.06)" }} />
                <div className="animate-pulse mt-1.5 rounded" style={{ height: 8, width: "55%", background: "rgba(255,255,255,0.04)" }} />
              </div>
            ))
          : items.map(t => (
              <a
                key={t.id}
                href={`https://www.inaturalist.org/taxa/${t.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 group"
                style={{ width: 116 }}>
                <div
                  className="rounded-xl overflow-hidden relative"
                  style={{ width: 116, height: 116, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}>
                  {t.photo && (
                    <img
                      src={t.photo}
                      alt={t.common || t.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                  <div
                    className="absolute top-1.5 right-1.5 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "rgba(7,16,12,0.8)" }}>
                    <ExternalLink size={10} color="#34d399" />
                  </div>
                </div>
                <p className="text-xs font-semibold mt-2 leading-tight truncate" style={{ color: "rgba(255,255,255,0.85)" }}>
                  {t.common || t.name}
                </p>
                <p className="text-[10px] italic truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {t.name}
                </p>
              </a>
            ))}
      </div>
    </div>
  );
}
