import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useWallet } from "../hooks/useWallet";
import { useApp } from "../context/AppContext";
import { createContract } from "../config";
import { ErrorMessage } from "./ErrorMessage";

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
  const [isFocused, setIsFocused] = useState<{
    imageUrl: boolean;
    caption: boolean;
  }>({
    imageUrl: false,
    caption: false,
  });

  const { state: walletState } = useWallet();
  const { state: appState, dispatch } = useApp();

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required";
    } else {
      try {
        new URL(imageUrl.trim());
      } catch {
        newErrors.imageUrl = "Please enter a valid URL";
      }
    }

    if (!caption.trim()) {
      newErrors.caption = "Caption is required";
    } else if (caption.length > MAX_CAPTION_LENGTH) {
      newErrors.caption = `Caption must be ${MAX_CAPTION_LENGTH} characters or less (${caption.length}/${MAX_CAPTION_LENGTH})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [imageUrl, caption]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

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
      "Transaction pending... Please confirm in MetaMask and wait.",
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      },
    );

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = createContract(signer);

      const tx = await contract.createPost(imageUrl.trim(), caption.trim());
      setTxHash(tx.hash);

      toast.update(pendingToastId, {
        render: `Transaction submitted! Waiting for confirmation...`,
      });

      const receipt = await tx.wait(1);

      if (receipt?.status === 1) {
        toast.dismiss(pendingToastId);
        toast.success("Post created successfully!", {
          onClick: () => {
            if (tx.hash) {
              window.open(
                `https://sepolia.etherscan.io/tx/${tx.hash}`,
                "_blank",
              );
            }
          },
        });
        dispatch({ type: "SET_TRANSACTION_STATUS", payload: "success" });

        setImageUrl("");
        setCaption("");
        setErrors({});
        setPreviewError(false);
      } else {
        toast.dismiss(pendingToastId);
        toast.error("Transaction failed. Please try again.");
        dispatch({ type: "SET_TRANSACTION_STATUS", payload: "error" });
        dispatch({
          type: "SET_ERROR",
          payload: "Transaction failed. Please try again.",
        });
      }
    } catch (error: unknown) {
      const err = error as { code?: number; message?: string; reason?: string };
      toast.dismiss(pendingToastId);

      if (err.code === 4001) {
        toast.error("Transaction rejected by user");
        dispatch({ type: "SET_TRANSACTION_STATUS", payload: "idle" });
      } else if (err.code === -32603) {
        toast.error(
          "Network error. Please check your connection and try again.",
        );
        dispatch({ type: "SET_TRANSACTION_STATUS", payload: "error" });
      } else {
        dispatch({ type: "SET_TRANSACTION_STATUS", payload: "error" });

        const errorMessage =
          err.reason || err.message || "Something went wrong";

        if (errorMessage.includes("EmptyImageUrl")) {
          toast.error("Image URL cannot be empty");
        } else if (errorMessage.includes("EmptyCaption")) {
          toast.error("Caption cannot be empty");
        } else if (errorMessage.includes("CaptionTooLong")) {
          toast.error("Caption is too long");
        } else {
          toast.error(errorMessage);
        }

        dispatch({ type: "SET_ERROR", payload: errorMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CAPTION_LENGTH) {
      setCaption(value);
    }
    if (errors.caption) {
      setErrors((prev) => ({ ...prev, caption: undefined }));
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setPreviewError(false);
    if (errors.imageUrl) {
      setErrors((prev) => ({ ...prev, imageUrl: undefined }));
    }
  };

  const resetStatus = () => {
    dispatch({ type: "SET_TRANSACTION_STATUS", payload: "idle" });
    dispatch({ type: "CLEAR_ERROR" });
    setTxHash(null);
  };

  const inputBaseClass = `
    w-full rounded-xl border bg-surface-hover px-4 py-3.5
    font-sans text-base text-text-primary
    placeholder:text-text-muted/80
    transition-all duration-200
    focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25
    disabled:cursor-not-allowed disabled:opacity-60
  `;

  if (appState.transactionStatus === "success") {
    return (
      <div className="mx-auto w-full max-w-[500px] px-2 sm:px-0">
        <div className="animate-scale-in relative overflow-hidden rounded-2xl border border-border bg-surface-elevated p-8 text-center shadow-lg sm:p-10">
          {/* Success Gradient */}
          <div
            className="pointer-events-none absolute inset-0 opacity-5"
            style={{
              background:
                "radial-gradient(circle at center, #22C55E, transparent 70%)",
            }}
          />

          <div className="relative">
            <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full border border-success/30 bg-success/15 text-success">
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
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>

            <h3 className="mb-2 font-display text-xl font-semibold text-text-primary">
              Post Created Successfully!
            </h3>
            <p className="mb-6 text-text-secondary">
              Your post has been submitted to the blockchain.
            </p>

            {txHash && (
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-6 inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/15 px-4 py-2 font-mono text-sm text-text-accent transition-colors hover:border-primary hover:bg-primary hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                View on Etherscan
              </a>
            )}

            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-accent-ocean px-8 py-3 font-medium text-white shadow-glow-primary transition-all hover:-translate-y-px hover:shadow-glow-primary-lg"
              onClick={resetStatus}
            >
              Create Another Post
            </button>
          </div>
        </div>
      </div>
    );
  }

  const showPreview =
    imageUrl.trim().length > 0 &&
    isProbablyImageUrl(imageUrl) &&
    !errors.imageUrl;

  return (
    <div className="mx-auto w-full max-w-[500px] px-2 sm:px-0">
      <form
        className="relative overflow-hidden rounded-2xl border border-border bg-surface-elevated p-6 shadow-lg sm:p-8"
        onSubmit={handleSubmit}
      >
        {/* Subtle Gradient Accent */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(14, 165, 233, 0.05))",
          }}
        />

        <div className="relative">
          <h2 className="mb-6 font-display text-xl font-semibold text-text-primary sm:text-2xl">
            Create a New Post
          </h2>

          {/* Image URL Input */}
          <div className="mb-5">
            <label
              htmlFor="imageUrl"
              className="mb-2 flex items-center justify-between text-sm font-medium text-text-primary"
            >
              <span>Image URL</span>
              <span className="text-xs text-text-muted">
                Direct link to image
              </span>
            </label>
            <div className="relative">
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={handleImageUrlChange}
                onFocus={() =>
                  setIsFocused((prev) => ({ ...prev, imageUrl: true }))
                }
                onBlur={() =>
                  setIsFocused((prev) => ({ ...prev, imageUrl: false }))
                }
                placeholder="https://example.com/image.jpg"
                disabled={isSubmitting}
                autoComplete="off"
                className={`${inputBaseClass} ${errors.imageUrl ? "border-error ring-2 ring-error/20" : "border-border"}`}
              />
              {isFocused.imageUrl && !errors.imageUrl && (
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-primary/20" />
              )}
            </div>
            {errors.imageUrl && <ErrorMessage message={errors.imageUrl} />}
          </div>

          {/* Image Preview */}
          {showPreview && (
            <div className="mb-5 overflow-hidden rounded-xl border border-border bg-surface-hover">
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Preview
                </span>
                <span className="text-xs text-text-muted">
                  {previewError ? "Failed to load" : "Loading..."}
                </span>
              </div>
              <div className="aspect-video w-full bg-surface-active">
                {!previewError ? (
                  <img
                    src={imageUrl.trim()}
                    alt="Preview of image from your URL"
                    className="h-full w-full object-contain"
                    onError={() => setPreviewError(true)}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center p-4 text-sm text-text-secondary">
                    <div className="text-center">
                      <svg
                        className="mx-auto mb-2 h-8 w-8 text-text-muted"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      Could not load image — check the URL
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Caption Input */}
          <div className="mb-5">
            <label
              htmlFor="caption"
              className="mb-2 flex items-center justify-between text-sm font-medium text-text-primary"
            >
              <span>Caption</span>
              <span
                className={`font-mono text-xs transition-colors ${
                  caption.length > MAX_CAPTION_LENGTH * 0.9
                    ? "text-warning"
                    : "text-text-secondary"
                }`}
              >
                {caption.length}/{MAX_CAPTION_LENGTH}
              </span>
            </label>
            <textarea
              id="caption"
              value={caption}
              onChange={handleCaptionChange}
              onFocus={() =>
                setIsFocused((prev) => ({ ...prev, caption: true }))
              }
              onBlur={() =>
                setIsFocused((prev) => ({ ...prev, caption: false }))
              }
              placeholder="Write a caption for your post..."
              rows={3}
              disabled={isSubmitting}
              className={`${inputBaseClass} min-h-[100px] resize-y ${errors.caption ? "border-error ring-2 ring-error/20" : "border-border"}`}
            />
            {errors.caption && <ErrorMessage message={errors.caption} />}
          </div>

          {/* Transaction Status */}
          {appState.transactionStatus === "pending" && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-warning/30 bg-warning/15 px-4 py-3.5 text-sm text-warning">
              <span
                className="h-[18px] w-[18px] shrink-0 rounded-full border-2 border-current border-t-transparent motion-safe:animate-spin"
                aria-hidden
              />
              <span>
                Transaction pending... Please confirm in MetaMask and wait.
              </span>
            </div>
          )}

          {appState.error && (
            <div className="mb-5">
              <ErrorMessage
                message={appState.error}
                onDismiss={() => dispatch({ type: "CLEAR_ERROR" })}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="group relative inline-flex min-h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-accent-ocean px-8 py-3.5 font-medium text-white shadow-glow-primary transition-all hover:-translate-y-px hover:shadow-glow-primary-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            disabled={
              isSubmitting ||
              !walletState.isConnected ||
              !walletState.isCorrectNetwork
            }
          >
            {/* Button Shine Effect */}
            <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />

            {isSubmitting ? (
              <>
                <span
                  className="h-4 w-4 shrink-0 rounded-full border-2 border-white/30 border-t-white motion-safe:animate-spin"
                  aria-hidden
                />
                <span>Creating...</span>
              </>
            ) : (
              <>
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
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                <span>Create Post</span>
              </>
            )}
          </button>

          {/* Helper Text */}
          {!walletState.isConnected && (
            <p className="mt-4 text-center text-sm text-text-secondary">
              Please connect your wallet to create posts
            </p>
          )}
          {walletState.isConnected && !walletState.isCorrectNetwork && (
            <p className="mt-4 text-center text-sm text-text-secondary">
              Please switch to Sepolia network to create posts
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
