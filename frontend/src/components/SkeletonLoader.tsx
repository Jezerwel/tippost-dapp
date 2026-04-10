function SkeletonBlock({ width = "100%", height = "16px", className = "" }: { width?: string; height?: string; className?: string }) {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonPostCard({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            border: "2px solid var(--border)",
            backgroundColor: "var(--elevated)",
            animationDelay: `${i * 80}ms`,
          }}
          className="animate-fade-up"
        >
          {/* Image */}
          <div className="aspect-square w-full skeleton-shimmer" />

          {/* Content */}
          <div className="p-4">
            <div className="mb-3 space-y-2">
              <SkeletonBlock height="14px" />
              <SkeletonBlock height="14px" width="85%" />
              <SkeletonBlock height="14px" width="70%" />
            </div>
            <div style={{ borderTop: "2px solid var(--border)", paddingTop: "12px", marginBottom: "12px" }}>
              <div className="flex justify-between">
                <SkeletonBlock height="24px" width="110px" />
                <SkeletonBlock height="16px" width="70px" />
              </div>
            </div>
            <div className="flex justify-between">
              <SkeletonBlock height="36px" width="80px" />
              <SkeletonBlock height="38px" width="90px" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export function SkeletonFeed({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <SkeletonPostCard count={count} />
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div
      style={{ border: "2px solid var(--border)", backgroundColor: "var(--elevated)" }}
    >
      {/* Terminal bar */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: "2px solid var(--border)", backgroundColor: "var(--hover)" }}
      >
        <SkeletonBlock height="12px" width="12px" />
        <SkeletonBlock height="12px" width="12px" />
        <SkeletonBlock height="12px" width="12px" />
        <SkeletonBlock height="10px" width="80px" className="ml-2" />
      </div>
      <div className="p-5 space-y-4">
        <SkeletonBlock height="10px" width="120px" />
        <SkeletonBlock height="44px" />
        <SkeletonBlock height="44px" />
        <SkeletonBlock height="100px" />
        <SkeletonBlock height="52px" />
      </div>
    </div>
  );
}

export function SkeletonEarnings() {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2"
      style={{ border: "2px solid var(--border)", backgroundColor: "var(--elevated)" }}
    >
      <SkeletonBlock height="10px" width="50px" />
      <SkeletonBlock height="20px" width="70px" />
    </div>
  );
}

export function SkeletonCardEnhanced() {
  return (
    <div style={{ border: "2px solid var(--border)", backgroundColor: "var(--elevated)" }}>
      <div className="aspect-square w-full skeleton-shimmer" />
      <div className="p-4 space-y-3">
        <SkeletonBlock height="14px" />
        <SkeletonBlock height="14px" width="80%" />
        <div style={{ borderTop: "2px solid var(--border)", paddingTop: "12px" }}>
          <div className="flex justify-between">
            <SkeletonBlock height="24px" width="100px" />
            <SkeletonBlock height="16px" width="60px" />
          </div>
        </div>
        <div className="flex justify-between">
          <SkeletonBlock height="36px" width="80px" />
          <SkeletonBlock height="38px" width="90px" />
        </div>
      </div>
    </div>
  );
}
