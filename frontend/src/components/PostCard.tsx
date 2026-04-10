import { useState, useMemo } from "react";
import { ethers } from "ethers";
import type { Post } from "@/types";
import { LikeButton } from "./LikeButton";

const LIKE_COST_WEI = ethers.parseEther("0.0001");

interface PostCardProps {
  post: Post;
  onLikeSuccess?: () => void;
}

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMxYTFhMWEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzQ0NDQ0NCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxNCIgbGV0dGVyLXNwYWNpbmc9IjIiPklNQUdFIE5PVCBGT1VORDwvdGV4dD48L3N2Zz4=";

export function PostCard({ post, onLikeSuccess }: PostCardProps) {
  const [imageError, setImageError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [optimisticLiked, setOptimisticLiked] = useState(false);

  const truncatedAddress = useMemo(
    () => `${post.creator.slice(0, 6)}…${post.creator.slice(-4)}`,
    [post.creator],
  );

  const formattedEth = useMemo(
    () => ethers.formatEther(post.tipAmount),
    [post.tipAmount],
  );

  const displayEth = useMemo(() => {
    const num = parseFloat(formattedEth);
    if (num === 0) return "0.0000";
    if (num < 0.00001) return "< 0.0001";
    return num.toFixed(4);
  }, [formattedEth]);

  const likeCount = useMemo(() => {
    const count = post.tipAmount / LIKE_COST_WEI;
    return Number(count) + (optimisticLiked ? 1 : 0);
  }, [post.tipAmount, optimisticLiked]);

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
    <article
      className="group flex flex-col animate-fade-up"
      style={{
        border: `2px solid ${hovered ? "var(--accent)" : "var(--border)"}`,
        backgroundColor: "var(--elevated)",
        boxShadow: hovered ? "var(--shadow-brutal)" : "none",
        transform: hovered ? "translate(-2px, -2px)" : "none",
        transition: "transform 0.1s ease, box-shadow 0.1s ease, border-color 0.15s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── IMAGE ── */}
      <div
        className="relative aspect-square w-full overflow-hidden"
        style={{ backgroundColor: "var(--hover)" }}
      >
        <img
          src={imageError ? PLACEHOLDER_IMAGE : post.imageUrl}
          alt={post.caption || "Post image"}
          className="h-full w-full object-cover"
          style={{
            transition: "transform 0.4s ease",
            transform: hovered ? "scale(1.03)" : "scale(1)",
          }}
          onError={() => setImageError(true)}
          loading="lazy"
          decoding="async"
        />

        {imageError && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            style={{ backgroundColor: "var(--hover)" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--border-strong)" }}>
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
              Image not found
            </span>
          </div>
        )}

        {/* Post ID badge */}
        <div
          className="absolute left-0 top-0 px-2 py-1 font-mono text-xs"
          style={{
            backgroundColor: "var(--bg)",
            color: "var(--ink-muted)",
            borderRight: "2px solid var(--border)",
            borderBottom: "2px solid var(--border)",
          }}
        >
          #{post.id.toString().padStart(4, "0")}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="flex flex-1 flex-col p-4">

        {/* Caption */}
        <p
          className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed"
          style={{ color: "var(--ink)" }}
        >
          {post.caption}
        </p>

        {/* Divider */}
        <div style={{ borderTop: "2px solid var(--border)", marginBottom: "12px" }} />

        {/* Author + date row */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div
            className="px-2 py-1 font-mono text-xs"
            style={{
              border: "2px solid var(--accent-border, rgba(255,79,48,0.35))",
              backgroundColor: "var(--accent-muted, rgba(255,79,48,0.08))",
              color: "var(--accent)",
            }}
          >
            {truncatedAddress}
          </div>
          <time
            className="font-mono text-xs"
            style={{ color: "var(--ink-muted)" }}
            dateTime={new Date(Number(post.timestamp) * 1000).toISOString()}
          >
            {formattedDate}
          </time>
        </div>

        {/* Earnings + Like */}
        <div className="flex items-end justify-between gap-3">
          {/* ETH earned stat */}
          <div className="flex flex-col">
            <span
              className="font-mono text-2xl font-bold leading-none tabular-nums"
              style={{ color: "var(--ink)" }}
            >
              {displayEth}
            </span>
            <span
              className="mt-0.5 font-mono text-xs uppercase tracking-widest"
              style={{ color: "var(--ink-muted)" }}
            >
              ETH EARNED
            </span>
          </div>

          {/* Like count + button stacked */}
          <div className="flex flex-col items-end gap-1.5">
            <span
              className="font-mono text-xs tabular-nums"
              style={{
                color: optimisticLiked ? "var(--clr-success, #22C55E)" : "var(--ink-muted)",
              }}
            >
              {likeCount} {likeCount === 1 ? "like" : "likes"}
            </span>
            <LikeButton
              postId={post.id}
              creator={post.creator}
              onLikeSuccess={() => {
                setOptimisticLiked(true);
                onLikeSuccess?.();
              }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
