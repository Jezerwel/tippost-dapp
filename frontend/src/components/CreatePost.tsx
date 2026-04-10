import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useWallet } from "../hooks/useWallet";
import { useApp } from "../context/AppContext";
import { createContract } from "../config";

interface FormErrors {
  imageUrl?: string;
  caption?: string;
}

const MAX_CAPTION_LENGTH = 280;

function isProbablyImageUrl(url: string): boolean {
  try {
    const u = new URL(url.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function CreatePost() {
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);

  const { state: walletState } = useWallet();
  const { state: appState, dispatch } = useApp();

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    if (!imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required";
    } else {
      try { new URL(imageUrl.trim()); }
      catch { newErrors.imageUrl = "Please enter a valid URL"; }
    }
    if (!caption.trim()) {
      newErrors.caption = "Caption is required";
    } else if (caption.length > MAX_CAPTION_LENGTH) {
      newErrors.caption = `Caption too long (${caption.length}/${MAX_CAPTION_LENGTH})`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [imageUrl, caption]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!walletState.isConnected || !walletState.address) {
      toast.error("Please connect your wallet first");
      return;
    }
    if (!walletState.isCorrectNetwork) {
      toast.error("Please switch to Sepolia network");
      return;
    }

    setIsSubmitting(true);
    dispatch({ type: "SET_TRANSACTION_STATUS", payload: "pending" });
    dispatch({ type: "CLEAR_ERROR" });
    setTxHash(null);

    const pendingToastId = toast.info(
      "Transaction pending… confirm in MetaMask.",
      { autoClose: false, closeOnClick: false, draggable: false },
    );

    try {
      if (!window.ethereum) throw new Error("MetaMask is not installed");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = createContract(signer);
      const tx = await contract.createPost(imageUrl.trim(), caption.trim());
      setTxHash(tx.hash);

      toast.update(pendingToastId, { render: "Submitted! Waiting for confirmation…" });
      const receipt = await tx.wait(1);

      if (receipt?.status === 1) {
        toast.dismiss(pendingToastId);
        toast.success("Post created on-chain!", {
          onClick: () => tx.hash && window.open(`https://sepolia.etherscan.io/tx/${tx.hash}`, "_blank"),
        });
        dispatch({ type: "SET_TRANSACTION_STATUS", payload: "success" });
        setImageUrl("");
        setCaption("");
        setErrors({});
        setPreviewError(false);
      } else {
        toast.dismiss(pendingToastId);
        toast.error("Transaction failed.");
        dispatch({ type: "SET_TRANSACTION_STATUS", payload: "error" });
        dispatch({ type: "SET_ERROR", payload: "Transaction failed." });
      }
    } catch (error: unknown) {
      const err = error as { code?: number; message?: string; reason?: string };
      toast.dismiss(pendingToastId);

      if (err.code === 4001) {
        toast.error("Rejected by user");
        dispatch({ type: "SET_TRANSACTION_STATUS", payload: "idle" });
      } else {
        dispatch({ type: "SET_TRANSACTION_STATUS", payload: "error" });
        const msg = err.reason || err.message || "Something went wrong";
        if (msg.includes("EmptyImageUrl")) toast.error("Image URL cannot be empty");
        else if (msg.includes("EmptyCaption")) toast.error("Caption cannot be empty");
        else if (msg.includes("CaptionTooLong")) toast.error("Caption is too long");
        else toast.error(msg);
        dispatch({ type: "SET_ERROR", payload: msg });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetStatus = () => {
    dispatch({ type: "SET_TRANSACTION_STATUS", payload: "idle" });
    dispatch({ type: "CLEAR_ERROR" });
    setTxHash(null);
  };

  const captionRemaining = MAX_CAPTION_LENGTH - caption.length;
  const captionNearLimit = caption.length > MAX_CAPTION_LENGTH * 0.85;
  const showPreview = imageUrl.trim().length > 0 && isProbablyImageUrl(imageUrl) && !errors.imageUrl;

  /* ── SUCCESS STATE ── */
  if (appState.transactionStatus === "success") {
    return (
      <div
        className="animate-fade-up p-8 text-center"
        style={{
          border: "2px solid var(--clr-success, #22C55E)",
          backgroundColor: "var(--elevated)",
          boxShadow: "4px 4px 0px var(--clr-success, #22C55E)",
        }}
      >
        <div
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center"
          style={{
            border: "2px solid var(--clr-success, #22C55E)",
            color: "var(--clr-success, #22C55E)",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>

        <div
          className="mb-1 font-mono text-xs uppercase tracking-widest"
          style={{ color: "var(--clr-success, #22C55E)" }}
        >
          // tx confirmed
        </div>
        <h3
          className="mb-2 font-display text-3xl tracking-wide"
          style={{ color: "var(--ink)" }}
        >
          POST CREATED
        </h3>
        <p
          className="mb-6 text-sm"
          style={{ color: "var(--ink-dim)" }}
        >
          Your post is now live on Sepolia.
        </p>

        {txHash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-widest"
            style={{
              border: "2px solid var(--border-strong)",
              color: "var(--ink-dim)",
              display: "flex",
              marginBottom: "24px",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            View on Etherscan
          </a>
        )}

        <button
          type="button"
          className="brutal-hover w-full py-3 font-display text-xl tracking-wide"
          onClick={resetStatus}
          style={{
            border: "2px solid var(--accent)",
            backgroundColor: "var(--accent)",
            color: "#fff",
            boxShadow: "var(--shadow-brutal-sm)",
          }}
        >
          CREATE ANOTHER
        </button>
      </div>
    );
  }

  /* ── FORM ── */
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "2px solid var(--border)",
        backgroundColor: "var(--elevated)",
      }}
    >
      {/* Terminal header */}
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ borderBottom: "2px solid var(--border)" }}
      >
        <div className="flex gap-1.5">
          <span className="h-3 w-3" style={{ backgroundColor: "var(--clr-error, #EF4444)" }} />
          <span className="h-3 w-3" style={{ backgroundColor: "var(--clr-warning, #F59E0B)" }} />
          <span className="h-3 w-3" style={{ backgroundColor: "var(--clr-success, #22C55E)" }} />
        </div>
        <span
          className="font-mono text-xs uppercase tracking-widest"
          style={{ color: "var(--ink-muted)" }}
        >
          new-post.sh
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <div
          className="mb-5 font-mono text-xs uppercase tracking-widest"
          style={{ color: "var(--accent)" }}
        >
          // create new post
        </div>

        {/* Image URL */}
        <div className="mb-5">
          <label
            htmlFor="imageUrl"
            className="mb-1.5 flex items-center justify-between"
          >
            <span
              className="font-mono text-xs uppercase tracking-widest"
              style={{ color: "var(--ink-dim)" }}
            >
              IMAGE_URL
            </span>
            <span className="font-mono text-xs" style={{ color: "var(--ink-muted)" }}>
              https only
            </span>
          </label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setPreviewError(false);
              if (errors.imageUrl) setErrors((p) => ({ ...p, imageUrl: undefined }));
            }}
            placeholder="https://example.com/image.jpg"
            disabled={isSubmitting}
            autoComplete="off"
            className="w-full px-3 py-3 font-mono text-sm"
            style={{
              border: `2px solid ${errors.imageUrl ? "var(--clr-error, #EF4444)" : "var(--border-strong)"}`,
              backgroundColor: "var(--hover)",
              color: "var(--ink)",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = errors.imageUrl ? "var(--clr-error, #EF4444)" : "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = errors.imageUrl ? "var(--clr-error, #EF4444)" : "var(--border-strong)")}
          />
          {errors.imageUrl && (
            <p
              className="mt-1.5 font-mono text-xs animate-error-in"
              style={{ color: "var(--clr-error, #EF4444)" }}
            >
              ⚠ {errors.imageUrl}
            </p>
          )}
        </div>

        {/* Image preview */}
        {showPreview && (
          <div
            className="mb-5 overflow-hidden"
            style={{ border: "2px solid var(--border)" }}
          >
            <div
              className="flex items-center justify-between px-3 py-1.5"
              style={{
                borderBottom: "2px solid var(--border)",
                backgroundColor: "var(--hover)",
              }}
            >
              <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
                preview
              </span>
              {previewError && (
                <span className="font-mono text-xs" style={{ color: "var(--clr-error, #EF4444)" }}>
                  load failed
                </span>
              )}
            </div>
            <div className="aspect-video w-full" style={{ backgroundColor: "var(--hover)" }}>
              {!previewError ? (
                <img
                  src={imageUrl.trim()}
                  alt="Preview"
                  className="h-full w-full object-contain"
                  onError={() => setPreviewError(true)}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="font-mono text-xs" style={{ color: "var(--ink-muted)" }}>
                    Could not load — check URL
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Caption */}
        <div className="mb-5">
          <label
            htmlFor="caption"
            className="mb-1.5 flex items-center justify-between"
          >
            <span
              className="font-mono text-xs uppercase tracking-widest"
              style={{ color: "var(--ink-dim)" }}
            >
              CAPTION
            </span>
            <span
              className="font-mono text-xs tabular-nums"
              style={{ color: captionNearLimit ? "var(--clr-warning, #F59E0B)" : "var(--ink-muted)" }}
            >
              {captionRemaining} left
            </span>
          </label>
          <textarea
            id="caption"
            value={caption}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CAPTION_LENGTH) setCaption(e.target.value);
              if (errors.caption) setErrors((p) => ({ ...p, caption: undefined }));
            }}
            placeholder="Write your caption here…"
            rows={4}
            disabled={isSubmitting}
            className="w-full resize-y px-3 py-3 font-sans text-sm"
            style={{
              border: `2px solid ${errors.caption ? "var(--clr-error, #EF4444)" : "var(--border-strong)"}`,
              backgroundColor: "var(--hover)",
              color: "var(--ink)",
              minHeight: "100px",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = errors.caption ? "var(--clr-error, #EF4444)" : "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = errors.caption ? "var(--clr-error, #EF4444)" : "var(--border-strong)")}
          />
          {errors.caption && (
            <p
              className="mt-1.5 font-mono text-xs animate-error-in"
              style={{ color: "var(--clr-error, #EF4444)" }}
            >
              ⚠ {errors.caption}
            </p>
          )}
        </div>

        {/* Pending state */}
        {appState.transactionStatus === "pending" && (
          <div
            className="mb-5 flex items-center gap-3 px-4 py-3 font-mono text-xs"
            style={{
              border: "2px solid var(--clr-warning, #F59E0B)",
              color: "var(--clr-warning, #F59E0B)",
            }}
          >
            <span className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-current border-t-transparent animate-spin" />
            WAITING FOR METAMASK CONFIRMATION…
          </div>
        )}

        {appState.error && (
          <div
            className="mb-5 flex items-center justify-between px-4 py-3 font-mono text-xs"
            style={{
              border: "2px solid var(--clr-error, #EF4444)",
              color: "var(--clr-error, #EF4444)",
            }}
          >
            <span>⚠ {appState.error}</span>
            <button
              type="button"
              onClick={() => dispatch({ type: "CLEAR_ERROR" })}
              style={{ color: "inherit", cursor: "pointer", background: "none", border: "none", fontSize: "14px" }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="brutal-hover w-full py-3.5 font-display text-2xl tracking-wide"
          disabled={isSubmitting || !walletState.isConnected || !walletState.isCorrectNetwork}
          style={{
            border: "2px solid var(--accent)",
            backgroundColor: "var(--accent)",
            color: "#fff",
            boxShadow: "var(--shadow-brutal)",
            cursor: isSubmitting || !walletState.isConnected || !walletState.isCorrectNetwork ? "not-allowed" : "pointer",
            opacity: isSubmitting || !walletState.isConnected || !walletState.isCorrectNetwork ? 0.6 : 1,
          }}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              CREATING…
            </span>
          ) : "PUBLISH POST"}
        </button>

        {!walletState.isConnected && (
          <p className="mt-3 text-center font-mono text-xs" style={{ color: "var(--ink-muted)" }}>
            // connect wallet to post
          </p>
        )}
        {walletState.isConnected && !walletState.isCorrectNetwork && (
          <p className="mt-3 text-center font-mono text-xs" style={{ color: "var(--ink-muted)" }}>
            // switch to Sepolia to post
          </p>
        )}
      </div>
    </form>
  );
}
