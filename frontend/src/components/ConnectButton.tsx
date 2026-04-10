import { useWallet } from "../hooks/useWallet";

const btnBase: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  minHeight: "40px",
  padding: "0 20px",
  fontFamily: "DM Sans, ui-sans-serif",
  fontSize: "0.875rem",
  fontWeight: 600,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  cursor: "pointer",
  border: "2px solid",
  transition: "transform 0.1s ease, box-shadow 0.1s ease",
};

export function ConnectButton() {
  const { state, connect, disconnect } = useWallet();

  if (!state.isMetaMaskInstalled) {
    return (
      <a
        href="https://metamask.io/download/"
        target="_blank"
        rel="noopener noreferrer"
        className="brutal-hover"
        style={{
          ...btnBase,
          backgroundColor: "var(--accent)",
          borderColor: "var(--accent)",
          color: "#fff",
          textDecoration: "none",
          boxShadow: "var(--shadow-brutal-sm)",
        }}
      >
        <DownloadIcon />
        <span>Install MetaMask</span>
      </a>
    );
  }

  if (state.isConnecting) {
    return (
      <button
        type="button"
        disabled
        style={{
          ...btnBase,
          backgroundColor: "var(--accent)",
          borderColor: "var(--accent)",
          color: "#fff",
          opacity: 0.75,
          cursor: "not-allowed",
        }}
      >
        <Spinner />
        <span>Connecting…</span>
      </button>
    );
  }

  if (state.isConnected && state.address) {
    const truncated = `${state.address.slice(0, 6)}…${state.address.slice(-4)}`;
    return (
      <div className="flex items-center gap-2">
        {/* Address chip */}
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{
            border: "2px solid var(--accent)",
            backgroundColor: "var(--elevated)",
            fontFamily: "JetBrains Mono, ui-monospace",
            fontSize: "0.8rem",
            color: "var(--ink)",
          }}
        >
          <span
            className="relative flex h-2 w-2 shrink-0"
          >
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: "var(--clr-success, #22C55E)" }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ backgroundColor: "var(--clr-success, #22C55E)" }}
            />
          </span>
          {truncated}
        </div>

        {/* Disconnect */}
        <button
          type="button"
          className="brutal-hover"
          onClick={disconnect}
          title="Disconnect wallet"
          style={{
            ...btnBase,
            padding: "0 12px",
            backgroundColor: "transparent",
            borderColor: "var(--border-strong)",
            color: "var(--ink-dim)",
            minHeight: "40px",
          }}
        >
          <DisconnectIcon />
          <span className="hidden sm:inline">Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="brutal-hover"
      onClick={connect}
      style={{
        ...btnBase,
        backgroundColor: "var(--accent)",
        borderColor: "var(--accent)",
        color: "#fff",
        boxShadow: "var(--shadow-brutal-sm)",
      }}
    >
      <WalletIcon />
      <span>Connect Wallet</span>
    </button>
  );
}

function Spinner() {
  return (
    <span
      className="h-4 w-4 shrink-0 rounded-full border-2 border-white/30 border-t-white animate-spin"
      aria-hidden
    />
  );
}

function WalletIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <path d="M16 12h.01"/>
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

function DisconnectIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}
