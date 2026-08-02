/**
 * IdCandidates — "Is it one of these?" strip, PictureThis/iNaturalist-style.
 * Sends the scanned photo to the free iNaturalist Computer Vision endpoint
 * (/api/identify/inat) and shows the top alternative matches with photos +
 * confidence. Purely additive + graceful: renders nothing on error/no photo.
 */
import { useEffect, useState } from "react";
import { Layers, ExternalLink } from "lucide-react";
import { identifyCandidates } from "@/lib/api";

interface Candidate { id: number; name: string; common?: string; photo?: string; score: number; wiki?: string; }

export default function IdCandidates({ photoUrl }: { photoUrl?: string }) {
  const [items, setItems] = useState<Candidate[] | null>(null);

  useEffect(() => {
    if (!photoUrl) { setItems([]); return; }
    let cancelled = false;
    setItems(null);

    (async () => {
      try {
        const blob = await (await fetch(photoUrl)).blob();
        // Backend on web; direct iNaturalist CV on the installed app.
        const data = await identifyCandidates(blob);
        const list: Candidate[] = (data.results ?? [])
          .map((r: any) => ({
            id: r.taxon?.id,
            name: r.taxon?.name,
            common: r.taxon?.commonName,
            photo: r.taxon?.photoUrl,
            score: r.score ?? 0,
            wiki: r.taxon?.wikipediaUrl,
          }))
          .filter((c: Candidate) => c.name && c.photo)
          .slice(0, 5);
        if (!cancelled) setItems(list);
      } catch {
        if (!cancelled) setItems([]);
      }
    })();

    return () => { cancelled = true; };
  }, [photoUrl]);

  if (items && items.length === 0) return null;

  const pct = (s: number) => (s > 1 ? Math.round(s) : Math.round(s * 100));

  return (
    <div>
      <p className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ color: "rgba(52,211,153,0.6)" }}>
        <Layers size={12} /> Is it one of these?
      </p>

      <div
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(16,185,129,0.25) transparent", margin: "0 -4px", padding: "0 4px 8px" }}>
        {items === null
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex-shrink-0" style={{ width: 116 }}>
                <div className="rounded-xl animate-pulse" style={{ width: 116, height: 116, background: "rgba(255,255,255,0.06)" }} />
                <div className="animate-pulse mt-2 rounded" style={{ height: 9, width: "80%", background: "rgba(255,255,255,0.06)" }} />
                <div className="animate-pulse mt-1.5 rounded" style={{ height: 8, width: "55%", background: "rgba(255,255,255,0.04)" }} />
              </div>
            ))
          : items.map(c => (
              <a
                key={c.id}
                href={`https://www.inaturalist.org/taxa/${c.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 group"
                style={{ width: 116 }}>
                <div className="rounded-xl overflow-hidden relative" style={{ width: 116, height: 116, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}>
                  {c.photo && (
                    <img src={c.photo} alt={c.common || c.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  )}
                  <span
                    className="absolute bottom-1.5 left-1.5 text-[10px] font-black px-1.5 py-0.5 rounded-full"
                    style={{ background: "rgba(7,16,12,0.85)", color: "#34d399" }}>
                    {pct(c.score)}%
                  </span>
                  <div className="absolute top-1.5 right-1.5 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(7,16,12,0.8)" }}>
                    <ExternalLink size={10} color="#34d399" />
                  </div>
                </div>
                <p className="text-xs font-semibold mt-2 leading-tight truncate" style={{ color: "rgba(255,255,255,0.85)" }}>{c.common || c.name}</p>
                <p className="text-[10px] italic truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{c.name}</p>
              </a>
            ))}
      </div>
    </div>
  );
}
