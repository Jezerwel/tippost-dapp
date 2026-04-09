import { useEffect, useState, useCallback, useRef } from "react";
import { ethers } from "ethers";
import { useApp } from "@/context/AppContext";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/config";
import { PostCard } from "./PostCard";
import { SkeletonFeed } from "./SkeletonLoader";
import type { Post } from "@/types";

export function PostFeed() {
  const { state, dispatch } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        if (!isPolling) {
          setIsLoading(true);
        }
        setError(null);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer,
        );

        const posts = await contract.getAllPosts();
        const formattedPosts = posts.map(formatPost);

        const current = postsRef.current;
        const currentIds = current.map((p) => p.id.toString()).join(",");
        const newIds = formattedPosts
          .map((p: Post) => p.id.toString())
          .join(",");

        if (currentIds !== newIds || current.length !== formattedPosts.length) {
          dispatch({ type: "SET_POSTS", payload: formattedPosts });
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        if (!isPolling) {
          setError("Failed to load posts. Please try again later.");
        }
      } finally {
        if (!isPolling) {
          setIsLoading(false);
        }
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (!CONTRACT_ADDRESS || error) {
      return;
    }

    const pollInterval = setInterval(() => {
      fetchPosts(true);
    }, 10000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [fetchPosts, error]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (isLoading) {
    return (
      <div className="grid w-full max-w-5xl grid-cols-1 gap-6 p-2 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] sm:p-4">
        <SkeletonFeed count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 p-8 text-center sm:min-h-[320px]">
        <div className="relative">
          <div className="absolute inset-0 animate-glow-pulse rounded-full opacity-30" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-error/30 bg-error/15 text-error">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </div>
        <p className="max-w-md text-text-secondary">{error}</p>
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-accent-ocean px-6 py-3 font-medium text-text-primary shadow-glow-primary transition-all hover:-translate-y-px hover:shadow-glow-primary-lg"
          onClick={() => fetchPosts()}
        >
          <svg
            className="mr-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Try Again
        </button>
      </div>
    );
  }

  if (state.posts.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 p-8 text-center">
        {/* Animated Illustration */}
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 animate-glow-pulse rounded-full opacity-40" />

          {/* Main Icon Container */}
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-border bg-surface-elevated shadow-lg sm:h-36 sm:w-36">
            {/* Floating Elements - Deep Blue Theme */}
            <div
              className="absolute -left-4 -top-4 h-8 w-8 animate-float rounded-lg border border-primary/30 bg-primary/10"
              style={{ animationDelay: "0s" }}
            />
            <div
              className="absolute -right-3 -top-5 h-6 w-6 animate-float rounded-full border border-accent-ocean/30 bg-accent-ocean/10"
              style={{ animationDelay: "0.5s" }}
            />
            <div
              className="absolute -bottom-3 -right-4 h-7 w-7 animate-float rounded-md border border-primary-light/30 bg-primary-light/10"
              style={{ animationDelay: "1s" }}
            />

            {/* Main Icon */}
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
              aria-hidden
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                ry="2"
                className="text-border"
              />
              <circle cx="8.5" cy="8.5" r="1.5" className="text-accent-ocean" />
              <polyline points="21 15 16 10 5 21" className="text-primary" />
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <div className="max-w-sm">
          <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
            No posts yet
          </h2>
          <p className="text-text-secondary">
            Be the first to share something on-chain. Create a post on the right
            to get started!
          </p>
        </div>

        {/* Decorative Arrow */}
        <div className="hidden items-center gap-2 text-text-muted lg:flex">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
          <span className="text-sm">Create your first post</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid w-full max-w-5xl grid-cols-1 gap-6 p-2 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] sm:p-4">
      {state.posts.map((post) => (
        <PostCard key={post.id.toString()} post={post} />
      ))}
    </div>
  );
}
