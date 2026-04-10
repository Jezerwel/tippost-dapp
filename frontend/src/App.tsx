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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <header className="sticky top-0 z-50" style={{ backgroundColor: "var(--bg)" }}>
        {/* thin accent top bar */}
        <div style={{ height: "2px", background: "linear-gradient(90deg, var(--accent) 0%, transparent 60%)" }} />
        <div
          style={{
            backgroundColor: "var(--surface)",
            borderBottom: "1px solid var(--border)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">

            {/* Logo */}
            <div className="flex items-center gap-4">
              <h1
                className="glitch font-display text-3xl tracking-wide sm:text-[2.1rem]"
                data-text="TIPPOST"
                style={{ color: "var(--ink)", lineHeight: 1 }}
              >
                TIP<span style={{ color: "var(--accent)" }}>POST</span>
              </h1>
              <span
                className="hidden font-mono text-[10px] uppercase tracking-[0.18em] sm:block"
                style={{
                  color: "var(--ink-muted)",
                  borderLeft: "1px solid var(--border)",
                  paddingLeft: "1rem",
                }}
              >
                pay-to-like
              </span>
            </div>

            {/* Right actions */}
            <div className="flex shrink-0 items-center gap-2">
              {state.isConnected && state.isCorrectNetwork && <Earnings />}
              <ConnectButton />

              {/* Theme toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="brutal-hover inline-flex h-8 w-8 items-center justify-center"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--elevated)",
                  color: "var(--ink-dim)",
                }}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN ───────────────────────────────────────── */}
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {!state.isConnected ? (
          <WelcomeScreen />
        ) : (
          <NetworkGuard>
            <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
              {/* Feed — left */}
              <div className="order-2 lg:order-1">
                <div className="mb-6 flex items-center gap-3">
                  <h2 className="font-display text-2xl tracking-wide" style={{ color: "var(--ink)" }}>
                    LIVE FEED
                  </h2>
                  <span
                    className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: "var(--clr-success, #22C55E)" }}
                  >
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: "var(--clr-success, #22C55E)" }}
                    />
                    LIVE
                  </span>
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
      <Footer />

      <ToastNotifications />
    </div>
  );
}

/* ── TICKER ──────────────────────────────────────────── */
const TICKER_ITEMS = [
  "POST CONTENT",
  "EARN ETH",
  "ZERO FEES",
  "100% TO CREATORS",
  "PAY-TO-LIKE",
  "ON SEPOLIA",
  "TRUSTLESS",
  "DECENTRALIZED",
];

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div
      className="overflow-hidden"
      style={{
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        backgroundColor: "var(--surface)",
      }}
    >
      <div className="flex animate-ticker whitespace-nowrap py-2">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center">
            <span
              className="font-mono text-[10px] uppercase tracking-[0.2em] px-5"
              style={{ color: "var(--ink-dim)" }}
            >
              {item}
            </span>
            <span style={{ color: "var(--accent)", fontSize: "0.5rem" }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── WELCOME SCREEN ──────────────────────────────────── */
function WelcomeScreen() {
  const features = [
    {
      num: "01",
      label: "INSTANT TIPS",
      desc: "Every like is an on-chain payment. ETH lands in the creator's wallet, not ours.",
      accent: "Ξ 0.001",
    },
    {
      num: "02",
      label: "ZERO PLATFORM CUT",
      desc: "No middleman. No hidden fees. 100% of every tip flows directly to the creator.",
      accent: "0%",
    },
    {
      num: "03",
      label: "FULLY TRUSTLESS",
      desc: "Smart contracts run it. Nobody controls your funds. Not even us.",
      accent: ">_",
    },
  ];

  return (
    <div className="relative">
      {/* ── Hero ─────────────────────────────────── */}
      <section className="dot-grid relative flex min-h-[82vh] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center">

        {/* Ambient glow behind title */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-glow-pulse"
          style={{
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
            zIndex: 0,
          }}
        />

        <div className="relative z-10 flex flex-col items-center">
          {/* Eyebrow */}
          <div
            className="animate-fade-up mb-6 inline-flex items-center gap-2 border px-3 py-1"
            style={{
              animationDelay: "0ms",
              borderColor: "var(--accent-border)",
              backgroundColor: "var(--accent-muted)",
            }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <span
              className="font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: "var(--accent)" }}
            >
              decentralized social — sepolia testnet
            </span>
          </div>

          {/* Main headline */}
          <h2
            className="glitch animate-fade-up font-display leading-none tracking-wide"
            data-text="TIPPOST"
            style={{
              animationDelay: "60ms",
              color: "var(--ink)",
              fontSize: "clamp(5rem, 18vw, 13rem)",
            }}
          >
            TIP<span style={{ color: "var(--accent)" }}>POST</span>
          </h2>

          {/* Divider line */}
          <div
            className="animate-line-grow my-6 w-full max-w-xs rule-accent"
            style={{ animationDelay: "200ms" }}
          />

          {/* Subheadline */}
          <p
            className="animate-fade-up mb-2 max-w-lg text-lg font-light leading-snug sm:text-xl"
            style={{ animationDelay: "240ms", color: "var(--ink-dim)" }}
          >
            Post content. Get tipped in ETH.
            <br />
            <span style={{ color: "var(--ink)" }}>No platform takes a cut. Ever.</span>
          </p>

          <p
            className="animate-fade-up mb-10 font-mono text-xs uppercase tracking-widest"
            style={{ animationDelay: "300ms", color: "var(--ink-muted)" }}
          >
            0.001 Ξ per like &nbsp;·&nbsp; 100% to creator &nbsp;·&nbsp; zero fees
          </p>

          {/* CTA */}
          <div className="animate-fade-up" style={{ animationDelay: "380ms" }}>
            <ConnectButton />
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--bg))",
            zIndex: 1,
          }}
        />
      </section>

      {/* ── Ticker ───────────────────────────────── */}
      <Ticker />

      {/* ── Feature cards ────────────────────────── */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">

          {/* Section label */}
          <div className="mb-12 flex items-center gap-4">
            <span
              className="font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: "var(--accent)" }}
            >
              How it works
            </span>
            <div
              className="animate-line-grow flex-1 rule-accent"
              style={{ animationDelay: "100ms" }}
            />
          </div>

          {/* Cards grid */}
          <div className="stagger grid gap-5 sm:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.num}
                className="animate-fade-up brutal-hover ticket-edge bracket-corner relative flex flex-col p-6"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--surface)",
                }}
              >
                {/* Number */}
                <div
                  className="mb-4 font-mono text-[10px] tracking-widest uppercase"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {f.num}
                </div>

                {/* Accent value */}
                <div
                  className="mb-4 font-display text-4xl leading-none"
                  style={{ color: "var(--accent)" }}
                >
                  {f.accent}
                </div>

                {/* Label */}
                <div
                  className="mb-2 font-display text-xl tracking-wide"
                  style={{ color: "var(--ink)" }}
                >
                  {f.label}
                </div>

                {/* Desc */}
                <div
                  className="mt-auto font-sans text-[13px] leading-relaxed"
                  style={{ color: "var(--ink-dim)" }}
                >
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────── */}
      <section
        style={{
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div className="mx-auto grid max-w-5xl grid-cols-3 px-6 py-10 sm:py-12">
          {[
            { value: "0.001 Ξ", label: "Cost per like" },
            { value: "100%",    label: "To creators" },
            { value: "0%",      label: "Platform fee" },
          ].map((s, i) => (
            <div
              key={s.label}
              className="animate-counter-in flex flex-col items-center gap-1 px-4 text-center"
              style={i > 0 ? { borderLeft: "1px solid var(--border)" } : undefined}
            >
              <span
                className="font-display text-4xl leading-none tracking-wide sm:text-5xl"
                style={{ color: "var(--ink)" }}
              >
                {s.value}
              </span>
              <span
                className="font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ color: "var(--ink-muted)" }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────── */}
      <section className="flex flex-col items-center px-4 py-20 text-center sm:py-24">
        <p
          className="animate-fade-up mb-2 font-mono text-[11px] uppercase tracking-[0.2em]"
          style={{ color: "var(--accent)" }}
        >
          Ready?
        </p>
        <h3
          className="animate-fade-up mb-8 font-display text-4xl leading-tight sm:text-6xl"
          style={{ animationDelay: "60ms", color: "var(--ink)" }}
        >
          CONNECT YOUR<br />
          <span style={{ color: "var(--accent)" }}>WALLET</span> TO START
        </h3>
        <div className="animate-fade-up" style={{ animationDelay: "120ms" }}>
          <ConnectButton />
        </div>
      </section>
    </div>
  );
}

/* ── FOOTER ──────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--surface)", borderTop: "1px solid var(--border)" }}>
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">

          {/* Brand */}
          <div className="flex items-baseline gap-3">
            <span className="font-display text-xl tracking-wide" style={{ color: "var(--ink-muted)" }}>
              TIP<span style={{ color: "var(--accent)" }}>POST</span>
            </span>
            <span
              className="font-mono text-[9px] uppercase tracking-[0.2em]"
              style={{ color: "var(--ink-muted)" }}
            >
              v1.0 · Sepolia
            </span>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {["Sepolia Testnet", "Zero Fees", "Open Source", "100% On-Chain"].map((item) => (
              <span
                key={item}
                className="font-mono text-[9px] uppercase tracking-[0.18em]"
                style={{ color: "var(--ink-muted)" }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom micro-line */}
        <div
          className="mt-5 pt-4 font-mono text-[9px] uppercase tracking-widest"
          style={{ borderTop: "1px solid var(--border)", color: "var(--ink-muted)" }}
        >
          Built on Ethereum · Smart contracts are immutable · Tip responsibly
        </div>
      </div>
    </footer>
  );
}

export default App;
