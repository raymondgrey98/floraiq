/**
 * ReferenceGallery — verified reference photos beside the user's own shot.
 *
 * Lets the user visually confirm an identification: their photo first,
 * then CC-licensed reference images from iNaturalist (or Wikipedia as
 * fallback), each with photographer attribution and a tap-through to the
 * source. Skeleton shimmer while loading; renders nothing if the species
 * has no verified photos so the screen never shows a broken section.
 */
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { getReferencePhotos, type ReferencePhoto } from "@/lib/speciesImages";

interface Props {
  scientificName: string;
  userPhotoUrl?: string;
}

export default function ReferenceGallery({ scientificName, userPhotoUrl }: Props) {
  const [photos, setPhotos] = useState<ReferencePhoto[] | null>(null);

  useEffect(() => {
    let mounted = true;
    setPhotos(null);
    getReferencePhotos(scientificName).then(p => { if (mounted) setPhotos(p); });
    return () => { mounted = false; };
  }, [scientificName]);

  if (photos !== null && photos.length === 0) return null;

  return (
    <div className="glass rounded-2xl border border-border/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold">Compare with verified photos</h3>
        <span className="text-[10px] text-muted-foreground">iNaturalist · Wikipedia</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {userPhotoUrl && (
          <figure className="w-32 flex-shrink-0">
            <div className="h-32 w-32 overflow-hidden rounded-xl ring-2 ring-leaf/60">
              <img src={userPhotoUrl} alt="Your photo" className="h-full w-full object-cover" />
            </div>
            <figcaption className="mt-1 text-center text-[10px] font-semibold text-leaf">
              Your photo
            </figcaption>
          </figure>
        )}

        {photos === null
          ? [1, 2, 3].map(i => (
              <div key={i} className="w-32 flex-shrink-0">
                <div className="skeleton-shimmer h-32 w-32 rounded-xl" />
                <div className="skeleton-shimmer mx-auto mt-1 h-2.5 w-24 rounded" />
              </div>
            ))
          : photos.map((p, i) => (
              <figure key={i} className="w-32 flex-shrink-0">
                <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer"
                  className="group relative block h-32 w-32 overflow-hidden rounded-xl border border-border/50">
                  <img src={p.url} alt={`${scientificName} reference ${i + 1}`}
                    loading="lazy" className="h-full w-full object-cover" />
                  <span className="absolute right-1 top-1 rounded-md bg-background/70 p-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <ExternalLink size={10} className="text-foreground" />
                  </span>
                  <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 to-transparent px-1.5 pb-1 pt-3 text-[8px] leading-tight text-white/85 truncate">
                    {p.attribution}
                  </span>
                </a>
                <figcaption className="mt-1 text-center text-[9px] uppercase tracking-wide text-muted-foreground">
                  {p.license === "wikipedia" ? "Wikipedia" : p.license.replace(/-/g, " ").toUpperCase()}
                </figcaption>
              </figure>
            ))}
      </div>

      <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
        Reference images are community-verified and openly licensed; tap one to view the
        original and its photographer. If your photo doesn't match, retake the scan.
      </p>
    </div>
  );
}
