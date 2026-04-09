import { useWallet } from "./hooks/useWallet";
import { ConnectButton } from "./components/ConnectButton";
import { NetworkGuard } from "./components/NetworkGuard";
import { ToastNotifications } from "./components/ToastNotifications";
import { CreatePost } from "./components/CreatePost";
import { PostFeed } from "./components/PostFeed";
import { Earnings } from "./components/Earnings";

function App() {
  const { state } = useWallet();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Solid Background */}
      <div className="fixed inset-0 -z-10 bg-void" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo & Tagline */}
          <div className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              <span className="text-primary font-semibold">TipPost</span>
            </h1>
            <span className="hidden text-sm font-medium tracking-wide text-text-muted sm:inline">
              Pay-to-like social
            </span>
          </div>

          {/* Right Side Actions */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            {state.isConnected && state.isCorrectNetwork && <Earnings />}
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {!state.isConnected ? (
          /* Welcome State - Not Connected */
          <div className="flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
            {/* Animated Icon */}
            <div className="relative mb-8">
              <div className="absolute inset-0 animate-glow-pulse rounded-full opacity-50" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-border bg-surface-elevated shadow-lg sm:h-28 sm:w-28">
                <svg
                  className="h-12 w-12 text-accent-purple sm:h-14 sm:w-14"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
            </div>

            {/* Welcome Text */}
            <h2 className="mb-3 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Welcome to <span className="gradient-text">TipPost</span>
            </h2>
            <p className="mb-8 max-w-md text-lg text-text-secondary">
              Connect your wallet to start sharing and tipping posts with ETH
            </p>

            {/* Connect Button */}
            <ConnectButton />

            {/* Feature Highlights */}
            <div className="mt-12 grid max-w-2xl gap-6 sm:grid-cols-3">
              {[
                {
                  icon: "💎",
                  title: "Instant Tips",
                  desc: "100% goes to creators",
                },
                {
                  icon: "🔒",
                  title: "On-Chain",
                  desc: "Decentralized & transparent",
                },
                { icon: "⚡", title: "No Fees", desc: "Zero platform fees" },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="animate-fade-in-up rounded-xl border border-border bg-surface-elevated p-4"
                >
                  <div className="mb-2 text-2xl">{feature.icon}</div>
                  <div className="font-display text-sm font-semibold text-text-primary">
                    {feature.title}
                  </div>
                  <div className="text-xs text-text-muted">{feature.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Connected State - Main App */
          <NetworkGuard>
            <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
              {/* Post Feed - Left Column */}
              <div className="order-2 lg:order-1">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-display text-xl font-semibold text-text-primary">
                    Recent Posts
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <span className="inline-block h-2 w-2 rounded-full bg-success animate-pulse" />
                    Live
                  </div>
                </div>
                <PostFeed />
              </div>

              {/* Create Post - Right Column */}
              <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
                <CreatePost />
              </div>
            </div>
          </NetworkGuard>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-text-muted sm:px-6 lg:px-8">
          <p>
            Built with 💜 on{" "}
            <span className="font-mono text-accent-cyan">Sepolia</span> • No
            platform fees • 100% to creators
          </p>
        </div>
      </footer>

      <ToastNotifications />
    </div>
  );
}

export default App;
