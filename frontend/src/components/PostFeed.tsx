import { useEffect, useState, useCallback, useRef } from "react";
import { ethers } from "ethers";
import { useApp } from "@/context/AppContext";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/config";
import { PostCard } from "./PostCard";
import { PostModal } from "./PostModal";
import { SkeletonFeed } from "./SkeletonLoader";
import type { Post } from "@/types";

export function PostFeed() {
  const { state, dispatch } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const postsRef = useRef(state.posts);
  postsRef.current = state.posts;

  const formatPost = (postData: unknown): Post => {
    const post = postData as {
      id: bigint;
      creator: string;
      imageUrl: string;
      caption: string;
      tipAmount: bigint;
      timestamp: bigint;
    };
    return {
      id: post.id,
      creator: post.creator,
      imageUrl: post.imageUrl,
      caption: post.caption,
      tipAmount: post.tipAmount,
      timestamp: post.timestamp,
    };
  };

  const fetchPosts = useCallback(
    async (isPolling = false) => {
      if (!CONTRACT_ADDRESS) {
        setIsLoading(false);
        setError("Contract not deployed. Please deploy the contract first.");
        return;
      }

      if (!window.ethereum) {
        setIsLoading(false);
        setError("Please install MetaMask to use this dApp.");
        return;
      }

      try {
        if (!isPolling) setIsLoading(true);
        setError(null);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        const posts = await contract.getAllPosts();
        const formattedPosts = posts.map(formatPost);

        const current = postsRef.current;
        const currentIds = current.map((p) => p.id.toString()).join(",");
        const newIds = formattedPosts.map((p: Post) => p.id.toString()).join(",");

        if (currentIds !== newIds || current.length !== formattedPosts.length) {
          dispatch({ type: "SET_POSTS", payload: formattedPosts });
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        if (!isPolling) setError("Failed to load posts. Please try again.");
      } finally {
        if (!isPolling) setIsLoading(false);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (!CONTRACT_ADDRESS || error) return;
    const interval = setInterval(() => fetchPosts(true), 10000);
    return () => clearInterval(interval);
  }, [fetchPosts, error]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  if (isLoading) return <SkeletonFeed count={6} />;

  if (error) {
    return (
      <div
        className="flex min-h-[300px] flex-col items-center justify-center gap-6 p-8 text-center animate-fade-up"
        style={{
          border: "2px solid var(--clr-error, #EF4444)",
          backgroundColor: "var(--elevated)",
        }}
      >
        <div
          className="flex h-14 w-14 items-center justify-center"
          style={{
            border: "2px solid var(--clr-error, #EF4444)",
            color: "var(--clr-error, #EF4444)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>

        <div>
          <div
            className="mb-1 font-mono text-xs uppercase tracking-widest"
            style={{ color: "var(--clr-error, #EF4444)" }}
          >
            // fetch error
          </div>
          <p className="font-sans text-sm" style={{ color: "var(--ink-dim)" }}>{error}</p>
        </div>

        <button
          type="button"
          className="brutal-hover px-6 py-2.5 font-display text-lg tracking-wide"
          onClick={() => fetchPosts()}
          style={{
            border: "2px solid var(--accent)",
            backgroundColor: "var(--accent)",
            color: "#fff",
            boxShadow: "var(--shadow-brutal-sm)",
          }}
        >
          RETRY
        </button>
      </div>
    );
  }

  if (state.posts.length === 0) {
    return (
      <div
        className="flex min-h-[400px] flex-col items-center justify-center gap-6 p-8 text-center animate-fade-up"
        style={{
          border: "2px solid var(--border)",
          backgroundColor: "var(--elevated)",
        }}
      >
        <div
          className="flex h-20 w-20 items-center justify-center"
          style={{
            border: "2px solid var(--border-strong)",
            color: "var(--ink-muted)",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>

        <div>
          <div
            className="mb-2 font-mono text-xs uppercase tracking-widest"
            style={{ color: "var(--accent)" }}
          >
            // no posts yet
          </div>
          <h3
            className="mb-1 font-display text-2xl tracking-wide"
            style={{ color: "var(--ink)" }}
          >
            BE FIRST
          </h3>
          <p className="font-sans text-sm" style={{ color: "var(--ink-dim)" }}>
            Create the first post on the right →
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {state.posts.map((post) => (
          <PostCard
            key={post.id.toString()}
            post={post}
            onClick={() => setSelectedPost(post)}
            onLikeSuccess={() => fetchPosts(true)}
          />
        ))}
      </div>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onLikeSuccess={() => {
            fetchPosts(true);
            // Keep modal open but reflect updated data when it arrives
          }}
        />
      )}
    </>
  );
}
