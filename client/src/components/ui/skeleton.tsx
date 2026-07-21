import { cn } from "@/lib/utils";

/**
 * Skeleton — premium shimmering placeholder.
 * Uses the `.fiq-shimmer` sweep from index.css (auto-disabled for users who
 * prefer reduced motion). Same API as before, so existing usages keep working.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("fiq-shimmer rounded-md", className)}
      style={{ background: "rgba(255,255,255,0.05)", ...props.style }}
      {...props}
    />
  );
}

/** Text lines — pass `lines` for a paragraph block. */
function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-3 rounded"
          style={{ width: i === lines - 1 ? "62%" : "100%" }}
        />
      ))}
    </div>
  );
}

/** A glass card placeholder: image block + title + subtitle. */
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl p-4 border border-white/8", className)} style={{ background: "rgba(255,255,255,0.03)" }}>
      <Skeleton className="w-full rounded-xl mb-3" style={{ height: 120 }} />
      <Skeleton className="h-3.5 w-3/5 rounded mb-2" />
      <Skeleton className="h-2.5 w-2/5 rounded" />
    </div>
  );
}

/** Grid of cards — use while a list of species/tools loads. */
function SkeletonGrid({ count = 6, cols = 2 }: { count?: number; cols?: number }) {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

/** Horizontal row placeholders (avatar + two lines). */
function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl p-3 border border-white/8" style={{ background: "rgba(255,255,255,0.03)" }}>
          <Skeleton className="rounded-xl flex-shrink-0" style={{ width: 44, height: 44 }} />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-1/2 rounded" />
            <Skeleton className="h-2.5 w-3/4 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export { Skeleton, SkeletonText, SkeletonCard, SkeletonGrid, SkeletonList };
