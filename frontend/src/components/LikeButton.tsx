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

export function LikeButton({
  postId,
  creator,
  onLikeSuccess,
}: LikeButtonProps) {
  const { state: walletState } = useWallet();
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingLiked, setIsCheckingLiked] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwnPost =
    walletState.address?.toLowerCase() === creator.toLowerCase();
  const isConnected = walletState.isConnected && walletState.isCorrectNetwork;

  useEffect(() => {
    const checkLikedStatus = async () => {
      if (!walletState.address || !window.ethereum) {
        setIsCheckingLiked(false);
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          provider,
        );
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
    if (
      !walletState.address ||
      !window.ethereum ||
      isOwnPost ||
      hasLiked ||
      isLoading
    ) {
      return;
    }

    if (!walletState.isCorrectNetwork) {
      toast.error("Please switch to Sepolia network");
      return;
    }

    setIsLoading(true);
    setError(null);

    const pendingToastId = toast.info(
      "Sending tip... Please confirm in MetaMask.",
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      },
    );

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer,
      );

      const tx = await contract.likePost(postId, {
        value: ethers.parseEther(MINIMUM_TIP_ETH),
      });

      toast.update(pendingToastId, {
        render: "Transaction submitted! Waiting for confirmation...",
      });

      await tx.wait(1);

      toast.dismiss(pendingToastId);
      toast.success(`Successfully tipped ${MINIMUM_TIP_ETH} ETH!`, {
        onClick: () => {
          window.open(`https://sepolia.etherscan.io/tx/${tx.hash}`, "_blank");
        },
      });

      setHasLiked(true);
      onLikeSuccess?.();
    } catch (err: unknown) {
      console.error("Like failed:", err);
      toast.dismiss(pendingToastId);

      const e = err as { code?: number; reason?: string; message?: string };
      const errorMessage = e.reason || e.message || "";
      const errorCode = e.code;

      if (errorCode === 4001) {
        setError("Transaction rejected");
        toast.error("Transaction rejected");
      } else if (
        errorCode === -32603 ||
        errorMessage.includes("insufficient funds")
      ) {
        setError("Insufficient ETH for gas");
        toast.error("Insufficient ETH in wallet for gas");
      } else if (errorMessage.includes("AlreadyLiked")) {
        setError("Already liked this post");
        setHasLiked(true);
        toast.error("Already liked");
      } else if (errorMessage.includes("CannotLikeOwnPost")) {
        setError("Cannot like your own post");
        toast.error("Cannot like your own post");
      } else if (errorMessage.includes("ZeroAmount")) {
        setError("Minimum tip is 0.001 ETH");
        toast.error("Minimum tip is 0.001 ETH");
      } else {
        setError("Transaction failed");
        toast.error("Transaction failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    postId,
    walletState.address,
    walletState.isCorrectNetwork,
    isOwnPost,
    hasLiked,
    isLoading,
    onLikeSuccess,
  ]);

  const isDisabled =
    !isConnected || isOwnPost || hasLiked || isLoading || isCheckingLiked;

  const getTooltip = () => {
    if (!isConnected) return "Connect wallet to tip";
    if (isOwnPost) return "You cannot like your own post";
    if (hasLiked) return "You already liked this post";
    return `Tip ${MINIMUM_TIP_ETH} ETH to like this post`;
  };

  const spinner = (
    <span
      className="inline-block h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white/30 border-t-white motion-safe:animate-spin"
      aria-hidden
    />
  );

  const base =
    "group relative inline-flex min-h-11 min-w-11 items-center justify-center gap-2 overflow-hidden rounded-lg px-5 py-2.5 text-sm font-medium tracking-wide text-text-primary transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 max-sm:w-full max-sm:py-3 max-sm:text-base";

  let stateClass =
    "bg-primary hover:bg-primary-hover shadow-card hover:-translate-y-px active:translate-y-0";
  if (hasLiked) {
    stateClass =
      "bg-error/90 hover:bg-error text-text-primary shadow-card hover:-translate-y-px active:translate-y-0";
  }
  if (isOwnPost) {
    stateClass =
      "border border-border bg-surface-hover text-text-secondary shadow-none hover:translate-y-0 hover:bg-surface-active hover:shadow-none";
  }

  const getButtonContent = () => {
    if (isCheckingLiked) {
      return (
        <>
          {spinner}
          <span>Checking...</span>
        </>
      );
    }
    if (hasLiked) {
      return (
        <>
          <span className="animate-heart-beat text-error text-base leading-none">
            💙
          </span>
          <span>Liked</span>
        </>
      );
    }
    if (isOwnPost) {
      return (
        <>
          <span className="text-base leading-none">💎</span>
          <span>Your post</span>
        </>
      );
    }
    if (isLoading) {
      return (
        <>
          {spinner}
          <span>Tipping...</span>
        </>
      );
    }
    if (!isConnected) {
      return (
        <>
          <span className="text-base leading-none">💎</span>
          <span>Connect to tip</span>
        </>
      );
    }
    return (
      <>
        <span className="text-base leading-none">💎</span>
        <span>Tip {MINIMUM_TIP_ETH} ETH</span>
      </>
    );
  };

  return (
    <div className="mt-3 flex w-full flex-col gap-2 sm:mt-0 sm:w-auto sm:items-end">
      <button
        type="button"
        className={`${base} ${stateClass}`}
        onClick={handleLike}
        disabled={isDisabled}
        title={getTooltip()}
        aria-label={hasLiked ? "Already liked" : `Tip ${MINIMUM_TIP_ETH} ETH`}
      >
        {/* Shine Effect on Hover */}
        {!isDisabled && !isOwnPost && (
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
        )}
        {getButtonContent()}
      </button>
      {error && (
        <p className="animate-error-shake rounded-lg border border-error/30 bg-error/15 px-3 py-2 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
