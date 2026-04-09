interface SkeletonPostCardProps {
  count?: number;
}

export function SkeletonPostCard({ count = 1 }: SkeletonPostCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-md"
        >
          {/* Image Skeleton */}
          <div className="aspect-square w-full animate-pulse rounded bg-surface-elevated" />

          {/* Content Skeleton */}
          <div className="p-5 sm:p-6">
            {/* Caption Lines */}
            <div className="mb-4 space-y-2">
              <div className="animate-pulse h-4 w-full rounded-md bg-surface-elevated" />
              <div className="animate-pulse h-4 w-[90%] rounded-md bg-surface-elevated" />
              <div className="animate-pulse h-4 w-3/4 rounded-md bg-surface-elevated" />
            </div>

            {/* Author & Date */}
            <div className="mb-4 flex justify-between gap-4 border-b border-border pb-4">
              <div className="animate-pulse h-6 w-[120px] rounded-md bg-surface-elevated" />
              <div className="animate-pulse h-4 w-20 rounded bg-surface-elevated" />
            </div>

            {/* Earnings & Button */}
            <div className="flex justify-between gap-4">
              <div className="animate-pulse h-10 w-[100px] rounded-md bg-surface-elevated" />
              <div className="animate-pulse h-11 w-[100px] rounded-lg bg-surface-elevated" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export function SkeletonForm() {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-surface-elevated p-8 shadow-md">
      {/* Title */}
      <div className="animate-pulse h-8 w-[150px] rounded-md bg-surface-elevated" />

      {/* Image URL Input */}
      <div>
        <div className="animate-pulse mb-2 h-12 w-full rounded-xl bg-surface-elevated" />
        <div className="animate-pulse h-3 w-[30%] rounded bg-surface-elevated" />
      </div>

      {/* Caption Input */}
      <div>
        <div className="animate-pulse mb-2 h-[120px] w-full rounded-xl bg-surface-elevated" />
        <div className="animate-pulse h-3 w-[30%] rounded bg-surface-elevated" />
      </div>

      {/* Submit Button */}
      <div className="animate-pulse h-12 w-full rounded-xl bg-surface-elevated" />
    </div>
  );
}

export function SkeletonEarnings() {
  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-5 shadow-md">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
        <div className="animate-pulse h-5 w-5 rounded-full bg-surface-elevated" />
        <div className="animate-pulse h-3.5 w-20 rounded bg-surface-elevated" />
      </div>

      {/* Amount */}
      <div className="animate-pulse h-9 w-[120px] rounded-md bg-surface-elevated" />
    </div>
  );
}

export function SkeletonFeed({ count = 6 }: { count?: number }) {
  return (
    <div className="grid w-full max-w-5xl grid-cols-1 gap-6 p-2 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] sm:p-4">
      <SkeletonPostCard count={count} />
    </div>
  );
}

/* Skeleton Card with Pulse Effect */
export function SkeletonCardEnhanced() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-md">
      {/* Image Placeholder */}
      <div className="aspect-square w-full animate-pulse rounded bg-surface-elevated" />

      {/* Content */}
      <div className="p-5 sm:p-6">
        <div className="mb-4 space-y-2">
          <div className="animate-pulse h-4 w-full rounded-md bg-surface-elevated" />
          <div className="animate-pulse h-4 w-[85%] rounded-md bg-surface-elevated" />
          <div className="animate-pulse h-4 w-[70%] rounded-md bg-surface-elevated" />
        </div>

        <div className="mb-4 flex justify-between gap-4 border-b border-border pb-4">
          <div className="animate-pulse h-6 w-[100px] rounded-md bg-surface-elevated" />
          <div className="animate-pulse h-4 w-16 rounded bg-surface-elevated" />
        </div>

        <div className="flex justify-between gap-4">
          <div className="animate-pulse h-10 w-[90px] rounded-md bg-surface-elevated" />
          <div className="animate-pulse h-11 w-[90px] rounded-lg bg-surface-elevated" />
        </div>
      </div>
    </div>
  );
}
