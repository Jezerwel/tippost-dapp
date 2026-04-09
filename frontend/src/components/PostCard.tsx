import { useState, useMemo } from "react";
import { ethers } from "ethers";
import type { Post } from "@/types";
import { LikeButton } from "./LikeButton";

interface PostCardProps {
  post: Post;
  onLikeSuccess?: () => void;
}

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMxYTEsMjUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzYwNjA3MCIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNiI+SW1hZ2Ugbm90IGF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=";

export function PostCard({ post, onLikeSuccess }: PostCardProps) {
  const [imageError, setImageError] = useState(false);

  // Memoize formatted values to prevent unnecessary re-renders
  const truncatedAddress = useMemo(
    () => `${post.creator.slice(0, 6)}...${post.creator.slice(-4)}`,
    [post.creator],
  );

  const formattedEth = useMemo(
    () => ethers.formatEther(post.tipAmount),
    [post.tipAmount],
  );

  const formattedDate = useMemo(
    () =>
      new Date(Number(post.timestamp) * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    [post.timestamp],
  );

  return (
    <article className="group relative overflow-hidden rounded-xl border border-border bg-surface-elevated transition-all duration-200 hover:border-border-light">
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-surface-hover">
        {/* Gradient Overlay on Hover */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-surface-elevated via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-40" />

        <img
          src={imageError ? PLACEHOLDER_IMAGE : post.imageUrl}
          alt={post.caption || "Post image"}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          onError={() => setImageError(true)}
          loading="lazy"
          decoding="async"
        />

        {/* Image Error Fallback */}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-hover">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-2 text-sm text-text-muted">Image unavailable</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative p-5 sm:p-6">
        {/* Caption */}
        <p className="mb-4 line-clamp-3 text-[0.95rem] leading-relaxed text-text-primary">
          {post.caption}
        </p>

        {/* Author & Date */}
        <div className="mb-4 flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-text-secondary">by</span>
            <code className="rounded-md border border-primary/40 bg-primary/15 px-2 py-0.5 font-mono text-[0.85rem] text-text-accent">
              {truncatedAddress}
            </code>
          </div>
          <time
            className="text-xs text-text-muted sm:text-sm"
            dateTime={new Date(Number(post.timestamp) * 1000).toISOString()}
          >
            {formattedDate}
          </time>
        </div>

        {/* Earnings & Like Button */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-lg font-semibold tabular-nums text-text-primary sm:text-xl">
                {formattedEth}
              </span>
              <span className="text-sm font-medium uppercase tracking-wider text-text-secondary">
                ETH
              </span>
            </div>
            <span className="text-[0.7rem] font-medium uppercase tracking-wider text-text-muted">
              earned
            </span>
          </div>
          <LikeButton
            postId={post.id}
            creator={post.creator}
            onLikeSuccess={onLikeSuccess}
          />
        </div>
      </div>
    </article>
  );
}
