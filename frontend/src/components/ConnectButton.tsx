import { useWallet } from "../hooks/useWallet";

export function ConnectButton() {
  const { state, connect, disconnect } = useWallet();

  const baseBtn = `
    inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 py-3 
    text-[0.95rem] font-medium tracking-wide text-white 
    transition-all duration-200 
    disabled:cursor-not-allowed disabled:opacity-70
  `;

  // MetaMask not installed
  if (!state.isMetaMaskInstalled) {
    return (
      <a
        href="https://metamask.io/download/"
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseBtn} relative overflow-hidden bg-gradient-to-r from-install-from to-install-to shadow-glow-success hover:-translate-y-px hover:shadow-glow-success-lg active:translate-y-0`}
      >
        {/* Shine Effect */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 hover:translate-x-full" />
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
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span>Install MetaMask</span>
      </a>
    );
  }

  // Connecting state
  if (state.isConnecting) {
    return (
      <button
        type="button"
        className={`${baseBtn} relative overflow-hidden bg-gradient-to-r from-primary to-accent-ocean shadow-glow-primary`}
        disabled
      >
        <span className="h-4 w-4 shrink-0 rounded-full border-2 border-white/30 border-t-white motion-safe:animate-spin" />
        <span>Connecting...</span>
      </button>
    );
  }

  // Connected state
  if (state.isConnected && state.address) {
    const truncatedAddress = `${state.address.slice(0, 6)}...${state.address.slice(-4)}`;

    return (
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        {/* Connected Address Badge */}
        <div className="group relative">
          {/* Gradient Border */}
          <div className="pointer-events-none absolute -inset-[1px] rounded-lg bg-gradient-to-r from-primary to-accent-ocean opacity-50 transition-opacity group-hover:opacity-100" />
          <div className="relative flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 py-2">
            {/* Connected Indicator */}
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <code className="font-mono text-sm text-white">
              {truncatedAddress}
            </code>
          </div>
        </div>

        {/* Disconnect Button */}
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-transparent px-4 py-2 text-[0.85rem] font-medium text-text-secondary transition-colors hover:border-primary/40 hover:bg-primary/15 hover:text-text-accent"
          onClick={disconnect}
          title="Disconnect wallet"
        >
          <svg
            className="mr-1.5 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Disconnect
        </button>
      </div>
    );
  }

  // Default: Connect button
  return (
    <button
      type="button"
      className={`${baseBtn} group relative overflow-hidden bg-gradient-to-r from-primary to-accent-ocean shadow-glow-primary hover:-translate-y-px hover:shadow-glow-primary-lg active:translate-y-0`}
      onClick={connect}
    >
      {/* Animated Gradient Border */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-xl bg-gradient-to-r from-accent-ocean via-primary to-primary-light opacity-0 transition-opacity group-hover:opacity-100"
        style={{ zIndex: -1 }}
      />

      {/* Shine Effect */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />

      {/* Wallet Icon */}
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
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
      <span>Connect Wallet</span>
    </button>
  );
}
