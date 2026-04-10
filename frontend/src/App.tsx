import { useState, useEffect } from "react";
import { useWallet } from "./hooks/useWallet";
import { ConnectButton } from "./components/ConnectButton";
import { NetworkGuard } from "./components/NetworkGuard";
import { ToastNotifications } from "./components/ToastNotifications";
import { CreatePost } from "./components/CreatePost";
import { PostFeed } from "./components/PostFeed";
import { Earnings } from "./components/Earnings";

type Theme = "dark" | "light";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

function App() {
  const { state } = useWallet();

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("tippost-theme") as Theme) ?? "dark";
    }
    return "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("tippost-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "var(--bg)", color: "var(--ink)" }}>

      {/* ── HEADER ─────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: "var(--surface)",
          borderBottom: "2px solid var(--border)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

          {/* Logo */}
          <div className="flex items-baseline gap-3">
            <h1
              className="glitch font-display text-3xl tracking-wide sm:text-4xl"
              data-text="TIPPOST"
              style={{ color: "var(--ink)" }}
            >
              TIP<span style={{ color: "var(--accent)" }}>POST</span>
            </h1>
            <span
              className="hidden font-mono text-xs uppercase tracking-widest sm:block"
              style={{ color: "var(--ink-muted)" }}
            >
              // pay-to-like
            </span>
          </div>

          {/* Right actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {state.isConnected && state.isCorrectNetwork && <Earnings />}
            <ConnectButton />

            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="brutal-hover inline-flex h-9 w-9 items-center justify-center"
              style={{
                border: "2px solid var(--border)",
                backgroundColor: "var(--elevated)",
                color: "var(--ink-dim)",
              }}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN ───────────────────────────────────────── */}
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {!state.isConnected ? (
          /* ── WELCOME SCREEN ── */
          <WelcomeScreen />
        ) : (
          /* ── CONNECTED APP ── */
          <NetworkGuard>
            <div className="grid gap-8 lg:grid-cols-[1fr_420px]">

              {/* Feed — left */}
              <div className="order-2 lg:order-1">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2
                      className="font-display text-2xl tracking-wide"
                      style={{ color: "var(--ink)" }}
                    >
                      LIVE FEED
                    </h2>
                    <span
                      className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest"
                      style={{ color: "var(--clr-success, #22C55E)" }}
                    >
                      <span className="inline-block h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--clr-success, #22C55E)" }} />
                      LIVE
                    </span>
                  </div>
                </div>
                <PostFeed />
              </div>

              {/* Create panel — right */}
              <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
                <CreatePost />
              </div>
            </div>
          </NetworkGuard>
        )}
      </main>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer
        className="mt-16"
        style={{ borderTop: "2px solid var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <span className="font-display text-lg tracking-wide" style={{ color: "var(--ink-muted)" }}>
              TIP<span style={{ color: "var(--accent)" }}>POST</span>
            </span>
            <p className="font-mono text-xs" style={{ color: "var(--ink-muted)" }}>
              SEPOLIA TESTNET &nbsp;·&nbsp; ZERO FEES &nbsp;·&nbsp; 100% TO CREATORS
            </p>
          </div>
        </div>
      </footer>

      <ToastNotifications />
    </div>
  );
}

/* ── WELCOME SCREEN ──────────────────────────────────── */
function WelcomeScreen() {
  const features = [
    { label: "INSTANT TIPS", desc: "100% goes directly to creators on-chain", symbol: "Ξ" },
    { label: "ZERO FEES",    desc: "No platform cut, ever",                    symbol: "#" },
    { label: "TRUSTLESS",    desc: "Decentralized & transparent on Sepolia",   symbol: ">" },
  ];

  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center py-16 text-center">

      {/* Hero heading */}
      <div className="mb-3 animate-fade-up">
        <div
          className="mb-2 font-mono text-xs uppercase tracking-widest"
          style={{ color: "var(--accent)" }}
        >
          // decentralized social
        </div>
        <h2
          className="font-display text-6xl leading-none tracking-wide sm:text-8xl"
          style={{ color: "var(--ink)" }}
        >
          TIP<span style={{ color: "var(--accent)" }}>POST</span>
        </h2>
      </div>

      <p
        className="mb-10 max-w-md animate-fade-up text-base leading-relaxed"
        style={{ animationDelay: "80ms", color: "var(--ink-dim)" }}
      >
        Post images. Earn ETH. Pay 0.001 Ξ to like.
        <br />
        Every like sends real value to the creator.
      </p>

      {/* CTA */}
      <div className="animate-fade-up" style={{ animationDelay: "160ms" }}>
        <ConnectButton />
      </div>

      {/* Feature cards */}
      <div className="stagger mt-14 grid max-w-2xl gap-4 sm:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.label}
            className="animate-fade-up brutal-hover p-5 text-left"
            style={{
              border: "2px solid var(--border)",
              backgroundColor: "var(--elevated)",
            }}
          >
            <div
              className="mb-3 font-mono text-2xl font-bold"
              style={{ color: "var(--accent)" }}
            >
              {f.symbol}
            </div>
            <div
              className="mb-1 font-display text-lg tracking-wide"
              style={{ color: "var(--ink)" }}
            >
              {f.label}
            </div>
            <div className="font-sans text-xs" style={{ color: "var(--ink-muted)" }}>
              {f.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
