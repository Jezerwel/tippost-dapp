import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useWallet } from "@/hooks/useWallet";
import { CONTRACT_ABI, CONTRACT_ADDRESS, MINIMUM_TIP_ETH } from "@/config";

interface LikeButtonProps {
  postId: bigint;
  creator: string;
  onLikeSuccess?: () => void;
}

export function LikeButton({ postId, creator, onLikeSuccess }: LikeButtonProps) {
  const { state: walletState } = useWallet();
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingLiked, setIsCheckingLiked] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwnPost = walletState.address?.toLowerCase() === creator.toLowerCase();
  const isConnected = walletState.isConnected && walletState.isCorrectNetwork;

  useEffect(() => {
    const checkLikedStatus = async () => {
      if (!walletState.address || !window.ethereum) {
        setIsCheckingLiked(false);
        return;
      }
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const liked = await contract.checkLiked(postId, walletState.address);
        setHasLiked(liked);
      } catch (err) {
        console.error("Error checking liked status:", err);
      } finally {
        setIsCheckingLiked(false);
      }
    };
    checkLikedStatus();
  }, [postId, walletState.address]);

  const handleLike = useCallback(async () => {
    if (!walletState.address || !window.ethereum || isOwnPost || hasLiked || isLoading) return;
    if (!walletState.isCorrectNetwork) { toast.error("Switch to Sepolia"); return; }

    setIsLoading(true);
    setError(null);

    const pendingToastId = toast.info("Sending tip… confirm in MetaMask.", {
      autoClose: false, closeOnClick: false, draggable: false,
    });

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.likePost(postId, { value: ethers.parseEther(MINIMUM_TIP_ETH) });
      toast.update(pendingToastId, { render: "Submitted! Waiting…" });
      await tx.wait(1);
      toast.dismiss(pendingToastId);
      toast.success(`Tipped ${MINIMUM_TIP_ETH} ETH!`, {
        onClick: () => window.open(`https://sepolia.etherscan.io/tx/${tx.hash}`, "_blank"),
      });
      setHasLiked(true);
      onLikeSuccess?.();
    } catch (err: unknown) {
      toast.dismiss(pendingToastId);
      const e = err as { code?: number; reason?: string; message?: string };
      const msg = e.reason || e.message || "";

      if (e.code === 4001) { setError("Rejected"); toast.error("Rejected"); }
      else if (e.code === -32603 || msg.includes("insufficient funds")) {
        setError("Insufficient ETH"); toast.error("Insufficient ETH for gas");
      } else if (msg.includes("AlreadyLiked")) {
        setError("Already liked"); setHasLiked(true); toast.error("Already liked");
      } else if (msg.includes("CannotLikeOwnPost")) {
        setError("Your post"); toast.error("Cannot like your own post");
      } else {
        setError("Failed"); toast.error("Transaction failed.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [postId, walletState.address, walletState.isCorrectNetwork, isOwnPost, hasLiked, isLoading, onLikeSuccess]);

  const isDisabled = !isConnected || isOwnPost || hasLiked || isLoading || isCheckingLiked;

  const getStyle = (): React.CSSProperties => {
    if (hasLiked) {
      return {
        border: "2px solid var(--clr-success, #22C55E)",
        backgroundColor: "var(--clr-success, #22C55E)",
        color: "#000",
        cursor: "default",
      };
    }
    if (isOwnPost) {
      return {
        border: "2px solid var(--border-strong)",
        backgroundColor: "transparent",
        color: "var(--ink-muted)",
        cursor: "default",
      };
    }
    if (isDisabled) {
      return {
        border: "2px solid var(--border)",
        backgroundColor: "var(--hover)",
        color: "var(--ink-muted)",
        cursor: "not-allowed",
        opacity: 0.5,
      };
    }
    return {
      border: "2px solid var(--accent)",
      backgroundColor: "var(--accent)",
      color: "#fff",
      boxShadow: "var(--shadow-brutal-sm)",
      cursor: "pointer",
    };
  };

  const getLabel = () => {
    if (isCheckingLiked) return <><Spinner /> <span>…</span></>;
    if (isLoading) return <><Spinner /> <span>TIPPING</span></>;
    if (hasLiked) return <><CheckIcon /> <span>LIKED</span></>;
    if (isOwnPost) return <span>YOUR POST</span>;
    if (!isConnected) return <span>CONNECT</span>;
    return <><DiamondIcon /> <span>{MINIMUM_TIP_ETH} Ξ</span></>;
  };

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        type="button"
        className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 font-mono text-xs uppercase tracking-widest ${isDisabled || hasLiked || isOwnPost ? "" : "brutal-hover"}`}
        onClick={handleLike}
        disabled={isDisabled}
        title={
          !isConnected ? "Connect wallet to tip"
            : isOwnPost ? "Cannot like your own post"
            : hasLiked ? "Already liked"
            : `Tip ${MINIMUM_TIP_ETH} ETH`
        }
        style={{
          minHeight: "38px",
          transition: "transform 0.1s ease, box-shadow 0.1s ease",
          ...getStyle(),
        }}
      >
        {getLabel()}
      </button>

      {error && (
        <p
          className="px-2 py-1 font-mono text-xs animate-error-shake"
          style={{
            border: "2px solid var(--clr-error, #EF4444)",
            color: "var(--clr-error, #EF4444)",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <span
      className="h-3 w-3 shrink-0 rounded-full border-2 border-white/30 border-t-white animate-spin"
      aria-hidden
    />
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function DiamondIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 9.5l10 12.5 10-12.5L12 2z"/>
    </svg>
  );
}
