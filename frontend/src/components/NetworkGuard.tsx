import { useState } from "react";
import type { ReactNode } from "react";
import { useWallet } from "../hooks/useWallet";

interface NetworkGuardProps {
  children: ReactNode;
}

export function NetworkGuard({ children }: NetworkGuardProps) {
  const { state, switchNetwork } = useWallet();
  const [isSwitching, setIsSwitching] = useState(false);

  if (!state.isConnected) {
    return <>{children}</>;
  }

  if (!state.isCorrectNetwork) {
    const handleSwitch = async () => {
      setIsSwitching(true);
      await switchNetwork();
      setIsSwitching(false);
    };

    return (
      <div className="flex min-h-[60vh] items-center justify-center p-8 sm:p-10">
        <div className="w-full max-w-md rounded-2xl border border-warning/20 bg-warning/10 p-8 text-center shadow-lg sm:p-10">
          <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-warning/10 text-warning">
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
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2 className="mb-3 font-display text-xl font-semibold text-text-primary">
            Wrong Network
          </h2>
          <p className="mb-4 text-text-secondary leading-relaxed">
            TipPost requires Sepolia testnet. Please switch your network to
            continue.
          </p>
          {state.chainId && (
            <p className="mb-6 rounded-lg border border-border bg-background-tertiary px-4 py-2 font-mono text-sm text-text-secondary">
              Current: Chain ID {state.chainId.toString()}
            </p>
          )}
          <button
            type="button"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-warning px-8 py-3.5 font-medium text-black transition-all hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            onClick={handleSwitch}
            disabled={isSwitching}
          >
            {isSwitching ? "Switching..." : "Switch to Sepolia"}
          </button>
          {state.error && (
            <p className="mt-4 rounded-lg border border-error/30 bg-error/15 px-4 py-3 text-sm text-error">
              {state.error}
            </p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
