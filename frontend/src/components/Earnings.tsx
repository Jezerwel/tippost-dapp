import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useWallet } from "@/hooks/useWallet";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/config";

interface EarningsProps {
  className?: string;
}

export function Earnings({ className = "" }: EarningsProps) {
  const { state: walletState } = useWallet();
  const [earnings, setEarnings] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchEarnings = useCallback(async () => {
    if (!walletState.address || !window.ethereum) {
      setEarnings(null);
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider,
      );
      const totalEarned = await contract.getTotalEarned(walletState.address);
      setEarnings(totalEarned);
    } catch (err) {
      console.error("Error fetching earnings:", err);
      setLoadError("Failed to load earnings");
      setEarnings(null);
    } finally {
      setIsLoading(false);
    }
  }, [walletState.address]);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  useEffect(() => {
    if (!walletState.address || !window.ethereum) {
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      provider,
    );
    const filter = contract.filters.PostLiked(null, null, walletState.address);

    const handlePostLiked = () => {
      fetchEarnings();
    };

    contract.on(filter, handlePostLiked);

    return () => {
      contract.off(filter, handlePostLiked);
    };
  }, [walletState.address, fetchEarnings]);

  const formatEarnings = () => {
    if (earnings === null) return "—";
    if (earnings === BigInt(0)) return "0";

    const formatted = ethers.formatEther(earnings);
    const num = parseFloat(formatted);

    if (num < 0.000001) {
      return "< 0.000001";
    }

    return num.toFixed(Math.min(4, formatted.split(".")[1]?.length || 0));
  };

  if (!walletState.isConnected || !walletState.address) {
    return null;
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border-border bg-surface-elevated p-4 shadow-lg transition-all duration-300 hover:border-primary/30 sm:p-5 ${className}`}
    >
      {/* Gradient Accent on Hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(14, 165, 233, 0.05))",
        }}
      />

      <div className="relative">
        {/* Header */}
        <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
          <span className="text-xl leading-none text-success" aria-hidden>
            💰
          </span>
          <span className="text-xs uppercase text-text-muted">
            Your Earnings
          </span>
        </div>

        {/* Content */}
        <div className="flex min-h-10 items-center">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <span
                className="h-4 w-4 shrink-0 rounded-full border-2 border-border border-t-primary motion-safe:animate-spin"
                aria-hidden
              />
              <span>Loading...</span>
            </div>
          ) : loadError ? (
            <div className="flex flex-wrap items-center gap-3 text-sm text-error">
              <span>{loadError}</span>
              <button
                type="button"
                onClick={fetchEarnings}
                className="rounded-md border border-primary/40 bg-primary/15 px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-semibold leading-none text-text-primary sm:text-3xl">
                {formatEarnings()}
              </span>
              <span className="text-sm font-medium uppercase tracking-wider text-text-muted">
                ETH
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: "linear-gradient(90deg, #3B82F6, #06B6D4)",
        }}
      />
    </div>
  );
}
