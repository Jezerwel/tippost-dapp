import { useEffect, useState, useMemo, useCallback } from "react";
import { ethers } from "ethers";
import type { Post } from "@/types";
import { LikeButton } from "./LikeButton";

const LIKE_COST_WEI = ethers.parseEther("0.0001");

interface PostModalProps {
  post: Post;
  onClose: () => void;
  onLikeSuccess?: () => void;
}

export function PostModal({ post, onClose, onLikeSuccess }: PostModalProps) {
  const [imageError, setImageError] = useState(false);
  const [optimisticLiked, setOptimisticLiked] = useState(false);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ESC to close
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose],
  );
  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const truncatedAddress = useMemo(
    () => `${post.creator.slice(0, 6)}…${post.creator.slice(-4)}`,
    [post.creator],
  );

  const fullAddress = post.creator;

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
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    [post.timestamp],
  );

  return (
    <div
      className="animate-backdrop-in fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: "rgba(0,0,0,0.88)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="animate-modal-in relative flex w-full max-w-5xl flex-col overflow-hidden md:flex-row"
        style={{
          backgroundColor: "var(--elevated)",
          border: "2px solid var(--border)",
          boxShadow: "var(--shadow-brutal-lg)",
          maxHeight: "90vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Close button ─────────────────────────────────── */}
        <button
          type="button"
          onClick={onClose}
          className="brutal-hover absolute right-0 top-0 z-20 flex h-9 w-9 items-center justify-center font-mono text-sm"
          style={{
            backgroundColor: "var(--bg)",
            borderLeft: "2px solid var(--border)",
            borderBottom: "2px solid var(--border)",
            color: "var(--ink-muted)",
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* ── Image panel ──────────────────────────────────── */}
        <div
          className="relative shrink-0 overflow-hidden md:flex-1"
          style={{
            backgroundColor: "#000",
            minHeight: "260px",
            maxHeight: "60vh",
          }}
        >
          {imageError ? (
            <div
              className="flex h-full w-full flex-col items-center justify-center gap-3"
              style={{ backgroundColor: "var(--hover)", minHeight: "260px" }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--border-strong)" }}>
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
                Image not found
              </span>
            </div>
          ) : (
            <img
              src={post.imageUrl}
              alt={post.caption || "Post image"}
              onError={() => setImageError(true)}
              className="h-full w-full"
              style={{
                objectFit: "contain",
                maxHeight: "60vh",
              }}
            />
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

        {/* ── Details panel ────────────────────────────────── */}
        <div
          className="flex flex-col overflow-y-auto p-6 md:w-80 md:shrink-0"
          style={{ borderTop: "2px solid var(--border)" }}
        >
          {/* Caption — full, not clipped */}
          <p
            className="mb-5 flex-1 text-sm leading-relaxed"
            style={{ color: "var(--ink)" }}
          >
            {post.caption || <span style={{ color: "var(--ink-muted)" }}>No caption</span>}
          </p>

          <div style={{ borderTop: "2px solid var(--border)", marginBottom: "20px" }} />

          {/* Creator */}
          <div className="mb-4">
            <div
              className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.2em]"
              style={{ color: "var(--ink-muted)" }}
            >
              CREATOR
            </div>
            <a
              href={`https://sepolia.etherscan.io/address/${fullAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2 py-1 font-mono text-xs"
              style={{
                border: "2px solid var(--accent-border, rgba(255,79,48,0.35))",
                backgroundColor: "var(--accent-muted, rgba(255,79,48,0.08))",
                color: "var(--accent)",
                textDecoration: "none",
              }}
              title={fullAddress}
            >
              {truncatedAddress}
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </div>

          {/* Date */}
          <div className="mb-6">
            <div
              className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.2em]"
              style={{ color: "var(--ink-muted)" }}
            >
              POSTED
            </div>
            <time
              className="font-mono text-xs"
              style={{ color: "var(--ink-dim)" }}
              dateTime={new Date(Number(post.timestamp) * 1000).toISOString()}
            >
              {formattedDate}
            </time>
          </div>

          {/* Stats grid */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <div
                className="font-mono text-2xl font-bold leading-none tabular-nums"
                style={{ color: "var(--ink)" }}
              >
                {displayEth}
              </div>
              <div
                className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em]"
                style={{ color: "var(--ink-muted)" }}
              >
                ETH EARNED
              </div>
            </div>
            <div>
              <div
                className="font-mono text-2xl font-bold leading-none tabular-nums"
                style={{ color: optimisticLiked ? "var(--clr-success, #22C55E)" : "var(--ink)" }}
              >
                {likeCount}
              </div>
              <div
                className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em]"
                style={{ color: "var(--ink-muted)" }}
              >
                {likeCount === 1 ? "LIKE" : "LIKES"}
              </div>
            </div>
          </div>

          {/* Like button */}
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
  );
}
