import { useState } from "react";
import type { ReactNode } from "react";
import { useWallet } from "../hooks/useWallet";

interface NetworkGuardProps {
  children: ReactNode;
}

export function NetworkGuard({ children }: NetworkGuardProps) {
  const { state, switchNetwork } = useWallet();
  const [isSwitching, setIsSwitching] = useState(false);

  if (!state.isConnected) return <>{children}</>;

  if (!state.isCorrectNetwork) {
    const handleSwitch = async () => {
      setIsSwitching(true);
      await switchNetwork();
      setIsSwitching(false);
    };

    return (
      <div className="flex min-h-[60vh] items-center justify-center p-8">
        <div
          className="w-full max-w-md animate-fade-up p-8 text-center"
          style={{
            border: "2px solid var(--clr-warning, #F59E0B)",
            backgroundColor: "var(--elevated)",
          }}
        >
          {/* Icon */}
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center"
            style={{
              border: "2px solid var(--clr-warning, #F59E0B)",
              color: "var(--clr-warning, #F59E0B)",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>

          <div
            className="mb-1 font-mono text-xs uppercase tracking-widest"
            style={{ color: "var(--clr-warning, #F59E0B)" }}
          >
            // network error
          </div>

          <h2
            className="mb-3 font-display text-3xl tracking-wide"
            style={{ color: "var(--ink)" }}
          >
            WRONG NETWORK
          </h2>

          <p
            className="mb-5 text-sm leading-relaxed"
            style={{ color: "var(--ink-dim)" }}
          >
            TipPost runs on Sepolia testnet. Switch your wallet network to continue.
          </p>

          {state.chainId && (
            <div
              className="mb-6 px-4 py-2 font-mono text-xs"
              style={{
                border: "2px solid var(--border)",
                color: "var(--ink-muted)",
              }}
            >
              CURRENT: CHAIN ID {state.chainId.toString()}
            </div>
          )}

          <button
            type="button"
            className="brutal-hover w-full py-3 font-display text-xl tracking-wide"
            onClick={handleSwitch}
            disabled={isSwitching}
            style={{
              border: "2px solid var(--clr-warning, #F59E0B)",
              backgroundColor: "var(--clr-warning, #F59E0B)",
              color: "#000",
              boxShadow: "4px 4px 0px #000",
              cursor: isSwitching ? "not-allowed" : "pointer",
              opacity: isSwitching ? 0.7 : 1,
            }}
          >
            {isSwitching ? "SWITCHING…" : "SWITCH TO SEPOLIA"}
          </button>

          {state.error && (
            <p
              className="mt-4 p-3 font-mono text-xs"
              style={{
                border: "2px solid var(--clr-error, #EF4444)",
                color: "var(--clr-error, #EF4444)",
              }}
            >
              {state.error}
            </p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
