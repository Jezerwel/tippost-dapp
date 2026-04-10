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
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const totalEarned = await contract.getTotalEarned(walletState.address);
      setEarnings(totalEarned);
    } catch (err) {
      console.error("Error fetching earnings:", err);
      setLoadError("Failed to load");
      setEarnings(null);
    } finally {
      setIsLoading(false);
    }
  }, [walletState.address]);

  useEffect(() => { fetchEarnings(); }, [fetchEarnings]);

  useEffect(() => {
    if (!walletState.address || !window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const filter = contract.filters.PostLiked(null, null, walletState.address);
    contract.on(filter, fetchEarnings);
    return () => { contract.off(filter, fetchEarnings); };
  }, [walletState.address, fetchEarnings]);

  const formatEarnings = (): string => {
    if (earnings === null) return "—";
    if (earnings === BigInt(0)) return "0.0000";
    const formatted = ethers.formatEther(earnings);
    const num = parseFloat(formatted);
    if (num < 0.000001) return "< 0.000001";
    return num.toFixed(4).replace(/0+$/, "").replace(/\.$/, ".0000");
  };

  if (!walletState.isConnected || !walletState.address) return null;

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 ${className}`}
      style={{
        border: "2px solid var(--accent)",
        backgroundColor: "var(--elevated)",
      }}
    >
      {/* Label */}
      <span
        className="hidden font-mono text-xs uppercase tracking-widest sm:block"
        style={{ color: "var(--ink-muted)" }}
      >
        EARNED
      </span>

      {/* Amount */}
      {isLoading ? (
        <span
          className="h-4 w-4 shrink-0 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
        />
      ) : loadError ? (
        <button
          type="button"
          onClick={fetchEarnings}
          className="font-mono text-xs"
          style={{ color: "var(--clr-error, #EF4444)", cursor: "pointer", background: "none", border: "none" }}
        >
          RETRY
        </button>
      ) : (
        <div className="flex items-baseline gap-1">
          <span
            className="font-mono text-base font-bold tabular-nums leading-none animate-count-up"
            style={{ color: "var(--accent)" }}
          >
            {formatEarnings()}
          </span>
          <span
            className="font-mono text-xs uppercase"
            style={{ color: "var(--ink-muted)" }}
          >
            Ξ
          </span>
        </div>
      )}
    </div>
  );
}
