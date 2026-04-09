# TipPost UI Refactor: Glassmorphism → Serious DeFi

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform TipPost from flashy glassmorphism to a serious, trustworthy DeFi platform using Tailwind CSS exclusively (NO custom CSS variables).

**Architecture:** Replace all CSS custom properties with Tailwind utility classes. Remove glassmorphism effects (backdrop-blur, transparency), floating orbs, and gradient-heavy aesthetic. Implement solid surfaces with subtle borders, bento grid layouts, and functional micro-interactions. Use Inter font family for professional typography.

**Tech Stack:** React + TypeScript + Tailwind CSS + Vite

---

## Design Token Reference

**Colors (Tailwind arbitrary values):**

- Primary: `bg-blue-500` / `#3B82F6`
- Background: `bg-[#0A0A0F]`
- Surface Primary: `bg-[#111118]`
- Surface Secondary: `bg-[#1A1A24]`
- Surface Hover: `bg-[#252532]`
- Text Primary: `text-slate-50` / `#F8FAFC`
- Text Secondary: `text-slate-400` / `#94A3B8`
- Text Muted: `text-slate-500` / `#64748B`
- Border: `border-[#2A2A35]`
- Border Light: `border-[#3A3A45]`
- Success: `text-green-500` / `#22C55E`
- Error: `text-red-500` / `#EF4444`
- Warning: `text-amber-500` / `#F59E0B`

**Typography:**

- Sans: `font-sans` (Inter)
- Mono: `font-mono` (JetBrains Mono)

---

## Task 1: Update tailwind.config.ts

**Files:**

- Modify: `tailwind.config.ts`

**Step 1: Replace color configuration**

Replace the entire colors section with static Tailwind-compatible values:

```typescript
colors: {
  // Primary Brand
  primary: {
    DEFAULT: '#3B82F6',
    hover: '#2563EB',
    light: '#60A5FA',
    dark: '#1D4ED8',
  },
  // Background Layers
  void: '#0A0A0F',
  surface: {
    DEFAULT: '#111118',
    elevated: '#1A1A24',
    hover: '#252532',
    active: '#2A2A38',
  },
  // Text
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    muted: '#64748B',
  },
  // Border
  border: {
    DEFAULT: '#2A2A35',
    light: '#3A3A45',
  },
  // Semantic
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  // Accent
  accent: {
    blue: '#3B82F6',
    cyan: '#06B6D4',
  },
},
```

**Step 2: Update font family**

```typescript
fontFamily: {
  sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'ui-monospace', 'SF Mono', 'monospace'],
},
```

**Step 3: Remove glassmorphism-related utilities**

Remove from extend:

- `backdropBlur` (glass, xs variants)
- All glow shadow variants
- gradient-radial, gradient-conic backgrounds

**Step 4: Simplify animations**

Keep only essential animations:

- `error-in` (for error messages)
- `shimmer` (for skeleton loaders)
- `spin` (for loading states)
- `fade-in-up` (for content entry)

Remove:

- `float` (no floating elements)
- `glow-pulse` (no glow effects)
- `heart-beat` (simplify to scale)
- `gradient-shift` (no animated gradients)

---

## Task 2: Replace src/index.css

**Files:**

- Modify: `src/index.css`
- Delete: `src/styles/design-system.css` (after migration)

**Step 1: Remove design-system.css import**

```css
/* Remove this line entirely */
@import "./styles/design-system.css";
```

**Step 2: Replace base styles with Tailwind-only**

```css
@import "tailwindcss";
@config '../tailwind.config.ts';

@layer base {
  html {
    @apply bg-void text-text-primary antialiased;
  }

  body {
    @apply min-h-screen bg-void text-text-primary font-sans;
  }

  /* Clean scrollbar - subtle */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    @apply bg-surface;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-border-light rounded-full;
  }

  ::-webkit-scrollbar-thumb:hover {
    @apply bg-border;
  }

  /* Focus states */
  :focus-visible {
    @apply outline-2 outline-primary outline-offset-2;
  }

  /* Selection */
  ::selection {
    @apply bg-primary/30 text-text-primary;
  }
}

@layer utilities {
  /* Skeleton shimmer - keep for loading states */
  .skeleton-shimmer {
    background: linear-gradient(90deg, #1a1a24 0%, #252532 50%, #1a1a24 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
  }
}
```

**Step 3: Verify no CSS variables remain**

Search for `var(--` patterns - should find NONE in the new file.

---

## Task 3: Update App.tsx - Remove Floating Orbs

**Files:**

- Modify: `src/App.tsx`

**Step 1: Remove animated background section**

Replace the entire background div (lines 14-49) with a simple solid background:

```tsx
{
  /* Solid Background */
}
<div className="fixed inset-0 -z-10 bg-void" />;
```

**Step 2: Update header - remove glassmorphism**

Change header from:

```tsx
<header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--glass-bg)] backdrop-blur-xl">
```

To:

```tsx
<header className="sticky top-0 z-50 border-b border-border bg-surface">
```

**Step 3: Update logo styling - remove gradient text**

Change from:

```tsx
<span className="bg-gradient-to-r from-[var(--color-accent-purple)] via-[var(--color-primary-light)] to-[var(--color-accent-cyan)] bg-clip-text text-transparent">
```

To:

```tsx
<span className="text-primary font-semibold">
```

**Step 4: Update welcome state cards**

Change feature cards from glassmorphism to solid:

```tsx
<div className="animate-fade-in-up rounded-xl border border-border bg-surface-elevated p-4">
```

**Step 5: Update footer**

Change from:

```tsx
<footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/50 backdrop-blur-sm">
```

To:

```tsx
<footer className="border-t border-border bg-surface">
```

---

## Task 4: Refactor PostCard.tsx

**Files:**

- Modify: `src/components/PostCard.tsx`

**Step 1: Remove gradient overlays and glow effects**

Remove lines 39-45 (subtle glow border effect on hover).

Remove lines 129-134 (bottom gradient accent).

**Step 2: Update card container**

Change from:

```tsx
<article className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/30 hover:shadow-[var(--glow-blue)]">
```

To:

```tsx
<article className="group relative overflow-hidden rounded-xl border border-border bg-surface-elevated transition-all duration-200 hover:border-border-light">
```

**Step 3: Update image container gradient overlay**

Change from:

```tsx
<div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[var(--color-surface-elevated)] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-60">
```

To:

```tsx
<div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-surface-elevated/80 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
```

**Step 4: Update author badge**

Change from:

```tsx
<code className="rounded-md border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/15 px-2 py-0.5 font-mono text-[0.85rem] text-[var(--color-text-accent)]">
```

To:

```tsx
<code className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-sm text-primary-light">
```

---

## Task 5: Refactor CreatePost.tsx

**Files:**

- Modify: `src/components/CreatePost.tsx`

**Step 1: Update success state styling**

Change success container from:

```tsx
<div className="animate-scale-in relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 text-center shadow-lg sm:p-10">
```

To:

```tsx
<div className="animate-scale-in rounded-xl border border-border bg-surface-elevated p-8 text-center sm:p-10">
```

Remove the gradient overlay div inside success state (lines 200-206).

**Step 2: Update success icon container**

Change from:

```tsx
<div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full border border-[var(--color-success)]/30 bg-[var(--color-success)]/15 text-[var(--color-success)]">
```

To:

```tsx
<div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full border border-success/30 bg-success/10 text-success">
```

**Step 3: Update Etherscan link**

Change from:

```tsx
className =
  "mb-6 inline-flex items-center gap-2 rounded-lg border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/15 px-4 py-2 font-mono text-sm text-[var(--color-text-accent)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-text-primary)]";
```

To:

```tsx
className =
  "mb-6 inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 font-mono text-sm text-primary-light transition-colors hover:border-primary hover:bg-primary hover:text-white";
```

**Step 4: Update primary button**

Change from:

```tsx
className =
  "inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-ocean)] px-8 py-3 font-medium text-[var(--color-text-primary)] shadow-[var(--glow-primary)] transition-all hover:-translate-y-px hover:shadow-[var(--glow-primary-lg)]";
```

To:

```tsx
className =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-8 py-3 font-medium text-white transition-all hover:bg-primary-hover active:scale-[0.98]";
```

**Step 5: Update form container**

Change from:

```tsx
className =
  "relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-lg sm:p-8";
```

To:

```tsx
className = "rounded-xl border border-border bg-surface-elevated p-6 sm:p-8";
```

Remove gradient accent div (lines 268-274).

**Step 6: Update input base class**

Change from:

```tsx
const inputBaseClass = `
  w-full rounded-xl border bg-[var(--color-surface-hover)] px-4 py-3.5
  font-sans text-base text-[var(--color-text-primary)]
  placeholder:text-[var(--color-text-muted)]/80
  transition-all duration-200
  focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25
  disabled:cursor-not-allowed disabled:opacity-60
`;
```

To:

```tsx
const inputBaseClass = `
  w-full rounded-lg border bg-surface-hover px-4 py-3.5
  font-sans text-base text-text-primary
  placeholder:text-text-muted
  transition-all duration-200
  focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
  disabled:cursor-not-allowed disabled:opacity-60
`;
```

**Step 7: Update submit button**

Change from:

```tsx
className =
  "group relative inline-flex min-h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-ocean)] px-8 py-3.5 font-medium text-[var(--color-text-primary)] shadow-[var(--glow-primary)] transition-all hover:-translate-y-px hover:shadow-[var(--glow-primary-lg)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";
```

To:

```tsx
className =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5 font-medium text-white transition-all hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";
```

Remove the shine effect div inside the button.

**Step 8: Update pending status banner**

Change from:

```tsx
className =
  "mb-5 flex items-center gap-3 rounded-xl border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/15 px-4 py-3.5 text-sm text-[var(--color-warning)]";
```

To:

```tsx
className =
  "mb-5 flex items-center gap-3 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3.5 text-sm text-warning";
```

**Step 9: Update image preview container**

Change from:

```tsx
<div className="mb-5 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-hover)]">
```

To:

```tsx
<div className="mb-5 overflow-hidden rounded-lg border border-border bg-surface-hover">
```

---

## Task 6: Refactor ConnectButton.tsx

**Files:**

- Modify: `src/components/ConnectButton.tsx`

**Step 1: Update base button styles**

Change from:

```tsx
const baseBtn = `
  inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 py-3 
  text-[0.95rem] font-medium tracking-wide text-[var(--color-text-primary)] 
  transition-all duration-200 
  disabled:cursor-not-allowed disabled:opacity-70
`;
```

To:

```tsx
const baseBtn = `
  inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-6 py-3 
  text-base font-medium text-white 
  transition-all duration-200 
  disabled:cursor-not-allowed disabled:opacity-70
`;
```

**Step 2: Update Install MetaMask button**

Change from:

```tsx
className={`${baseBtn} relative overflow-hidden bg-gradient-to-r from-[var(--color-install-from)] to-[var(--color-install-to)] shadow-[var(--glow-success)] hover:-translate-y-px hover:shadow-[var(--glow-success-lg)] active:translate-y-0`}
```

To:

```tsx
className={`${baseBtn} bg-success hover:bg-success/90 active:scale-[0.98]`}
```

Remove shine effect div.

**Step 3: Update connecting state**

Change from:

```tsx
className={`${baseBtn} relative overflow-hidden bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-ocean)] shadow-[var(--glow-primary)]`}
```

To:

```tsx
className={`${baseBtn} bg-primary cursor-wait`}
```

**Step 4: Update connected address badge**

Change from:

```tsx
<div className="group relative">
  <div className="pointer-events-none absolute -inset-[1px] rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-ocean)] opacity-50 transition-opacity group-hover:opacity-100" />
  <div className="relative flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-2">
```

To:

```tsx
<div className="flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 py-2">
```

**Step 5: Update disconnect button**

Change from:

```tsx
className =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-transparent px-4 py-2 text-[0.85rem] font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/15 hover:text-[var(--color-text-accent)]";
```

To:

```tsx
className =
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary-light";
```

**Step 6: Update connect button**

Change from:

```tsx
className={`${baseBtn} group relative overflow-hidden bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-ocean)] shadow-[var(--glow-primary)] hover:-translate-y-px hover:shadow-[var(--glow-primary-lg)] active:translate-y-0`}
```

To:

```tsx
className={`${baseBtn} bg-primary hover:bg-primary-hover active:scale-[0.98]`}
```

Remove gradient border div and shine effect div.

---

## Task 7: Refactor LikeButton.tsx

**Files:**

- Modify: `src/components/LikeButton.tsx`

**Step 1: Update base button class**

Change from:

```tsx
const base =
  "group relative inline-flex min-h-11 min-w-11 items-center justify-center gap-2 overflow-hidden rounded-lg px-5 py-2.5 text-sm font-medium tracking-wide text-[var(--color-text-primary)] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 max-sm:w-full max-sm:py-3 max-sm:text-base";
```

To:

```tsx
const base =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98] max-sm:w-full max-sm:py-3 max-sm:text-base";
```

**Step 2: Update state classes**

Change default state from:

```tsx
stateClass =
  "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-ocean)] shadow-[var(--glow-primary)] hover:-translate-y-px hover:shadow-[var(--glow-primary-lg)] active:translate-y-0";
```

To:

```tsx
stateClass = "bg-primary hover:bg-primary-hover";
```

Change liked state from:

```tsx
stateClass =
  "bg-gradient-to-r from-[var(--color-like-from)] to-[var(--color-like-to)] shadow-[var(--glow-like)] hover:-translate-y-px hover:shadow-[var(--glow-like-lg)] active:translate-y-0";
```

To:

```tsx
stateClass = "bg-blue-600 cursor-default";
```

Change own post state from:

```tsx
stateClass =
  "border border-[var(--color-border)] bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] shadow-none hover:translate-y-0 hover:bg-[var(--color-surface-active)] hover:shadow-none";
```

To:

```tsx
stateClass =
  "border border-border bg-surface-hover text-text-secondary cursor-default";
```

**Step 3: Remove shine effect**

Remove the shine effect div inside the button (lines 210-213).

**Step 4: Update error message**

Change from:

```tsx
className =
  "animate-error-shake rounded-lg border border-[var(--color-error)]/30 bg-[var(--color-error)]/15 px-3 py-2 text-sm text-[var(--color-error)]";
```

To:

```tsx
className =
  "animate-error-shake rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-sm text-error";
```

---

## Task 8: Refactor Earnings.tsx

**Files:**

- Modify: `src/components/Earnings.tsx`

**Step 1: Update card container**

Change from:

```tsx
<div className={`group relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 shadow-lg transition-all duration-300 hover:border-[var(--color-primary)]/30 hover:shadow-[var(--glow-blue)] sm:p-5 ${className}`}>
```

To:

```tsx
<div className={`rounded-xl border border-border bg-surface-elevated p-4 sm:p-5 ${className}`}>
```

**Step 2: Remove gradient accent**

Remove the gradient accent div (lines 83-89) and bottom gradient line (lines 137-142).

**Step 3: Update loading spinner**

Change from:

```tsx
<span className="h-4 w-4 shrink-0 rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)] motion-safe:animate-spin" />
```

To:

```tsx
<span className="h-4 w-4 shrink-0 rounded-full border-2 border-border border-t-primary motion-safe:animate-spin" />
```

**Step 4: Update retry button**

Change from:

```tsx
className =
  "rounded-md border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/15 px-3 py-1.5 text-xs font-medium text-[var(--color-text-accent)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-text-primary)]";
```

To:

```tsx
className =
  "rounded-md border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary-light transition-colors hover:border-primary hover:bg-primary hover:text-white";
```

---

## Task 9: Refactor ToastNotifications.tsx

**Files:**

- Modify: `src/components/ToastNotifications.tsx`

**Step 1: Update ToastContainer classes**

Change from:

```tsx
toastClassName =
  "!rounded-xl !border !border-border !bg-background-secondary !font-sans !text-sm !text-text-primary !shadow-xl";
progressClassName = "!bg-gradient-to-r !from-primary !to-violet-500";
```

To:

```tsx
toastClassName =
  "!rounded-lg !border !border-border !bg-surface-elevated !font-sans !text-sm !text-text-primary";
progressClassName = "!bg-primary";
```

**Step 2: Update close button hover**

Change from:

```tsx
className =
  "ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition hover:bg-background-tertiary hover:text-text-primary";
```

To:

```tsx
className =
  "ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition hover:bg-surface-hover hover:text-text-primary";
```

---

## Task 10: Refactor SkeletonLoader.tsx

**Files:**

- Modify: `src/components/SkeletonLoader.tsx`

**Step 1: Update SkeletonPostCard container**

Change from:

```tsx
<div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-lg">
```

To:

```tsx
<div className="overflow-hidden rounded-xl border border-border bg-surface-elevated">
```

**Step 2: Update SkeletonForm container**

Change from:

```tsx
<div className="flex flex-col gap-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 shadow-lg">
```

To:

```tsx
<div className="flex flex-col gap-6 rounded-xl border border-border bg-surface-elevated p-8">
```

**Step 3: Update SkeletonEarnings container**

Change from:

```tsx
<div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-lg">
```

To:

```tsx
<div className="rounded-xl border border-border bg-surface-elevated p-5">
```

**Step 4: Update SkeletonCardEnhanced container**

Change from:

```tsx
<div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-lg">
```

To:

```tsx
<div className="overflow-hidden rounded-xl border border-border bg-surface-elevated">
```

Remove the animated border glow div (lines 94-101).

---

## Task 11: Refactor ErrorMessage.tsx

**Files:**

- Modify: `src/components/ErrorMessage.tsx`

**Step 1: Update error container**

Change from:

```tsx
className =
  "animate-error-in flex items-center justify-between gap-3 rounded-lg border border-error/30 bg-error/15 px-4 py-3 text-sm leading-snug text-error";
```

To:

```tsx
className =
  "animate-error-in flex items-center justify-between gap-3 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm leading-snug text-error";
```

**Step 2: Update dismiss button hover**

Change from:

```tsx
className =
  "flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md p-1 text-inherit opacity-70 transition hover:bg-error/10 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-error/40";
```

To:

```tsx
className =
  "flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md p-1 text-inherit opacity-70 transition hover:bg-error/10 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-error/30";
```

---

## Task 12: Refactor NetworkGuard.tsx

**Files:**

- Modify: `src/components/NetworkGuard.tsx`

**Step 1: Update warning card container**

Change from:

```tsx
<div className="w-full max-w-md rounded-2xl border border-border bg-background-secondary p-8 text-center shadow-lg sm:p-10">
```

To:

```tsx
<div className="w-full max-w-md rounded-xl border border-border bg-surface-elevated p-8 text-center sm:p-10">
```

**Step 2: Update icon container**

Change from:

```tsx
<div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-primary">
```

To:

```tsx
<div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-warning/10 text-warning">
```

**Step 3: Update chain ID display**

Change from:

```tsx
className =
  "mb-6 rounded-lg border border-border bg-background-tertiary px-4 py-2 font-mono text-sm text-text-secondary";
```

To:

```tsx
className =
  "mb-6 rounded-lg border border-border bg-surface-hover px-4 py-2 font-mono text-sm text-text-secondary";
```

**Step 4: Update switch button**

Change from:

```tsx
className =
  "inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 px-8 py-3.5 font-medium text-text-primary shadow-glow-primary transition-all hover:-translate-y-px hover:shadow-glow-primary-lg disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto";
```

To:

```tsx
className =
  "inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-8 py-3.5 font-medium text-white transition-all hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto";
```

**Step 5: Update error message**

Change from:

```tsx
className =
  "mt-4 rounded-lg border border-error/30 bg-error/15 px-4 py-3 text-sm text-error";
```

To:

```tsx
className =
  "mt-4 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error";
```

---

## Task 13: Refactor PostFeed.tsx

**Files:**

- Modify: `src/components/PostFeed.tsx`

**Step 1: Update error state icon container**

Change from:

```tsx
<div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[var(--color-error)]/30 bg-[var(--color-error)]/15 text-[var(--color-error)]">
```

To:

```tsx
<div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-error/30 bg-error/10 text-error">
```

**Step 2: Update retry button**

Change from:

```tsx
className =
  "inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-ocean)] px-6 py-3 font-medium text-[var(--color-text-primary)] shadow-[var(--glow-primary)] transition-all hover:-translate-y-px hover:shadow-[var(--glow-primary-lg)]";
```

To:

```tsx
className =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-white transition-all hover:bg-primary-hover active:scale-[0.98]";
```

**Step 3: Update empty state icon container**

Change from:

```tsx
<div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-lg sm:h-36 sm:w-36">
```

To:

```tsx
<div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-border bg-surface-elevated sm:h-36 sm:w-36">
```

**Step 4: Update floating decorative elements**

Change decorative elements from animated floating to static:

Change from:

```tsx
<div
  className="absolute -left-4 -top-4 h-8 w-8 animate-float rounded-lg border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10"
  style={{ animationDelay: "0s" }}
/>
```

To:

```tsx
<div className="absolute -left-4 -top-4 h-8 w-8 rounded-lg border border-primary/20 bg-primary/5" />
```

Apply same change to all three floating elements, removing animation-delay styles.

**Step 5: Update grid layout for bento style**

Change from:

```tsx
<div className="grid w-full max-w-5xl grid-cols-1 gap-6 p-2 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] sm:p-4">
```

To (bento grid):

```tsx
<div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
```

---

## Task 14: Final Verification

**Files:**

- All modified files

**Step 1: Search for remaining CSS variables**

```bash
grep -r "var(--color-" src/ --include="*.tsx" --include="*.ts" --include="*.css"
```

Expected: No matches (or only in comments)

**Step 2: Search for glassmorphism patterns**

```bash
grep -r "backdrop-blur\|backdropBlur\|glass" src/ --include="*.tsx" --include="*.ts"
```

Expected: No matches

**Step 3: Search for gradient backgrounds on buttons**

```bash
grep -r "bg-gradient-to" src/ --include="*.tsx"
```

Expected: Only in specific design elements (not on primary buttons)

**Step 4: Build verification**

```bash
npm run build
```

Expected: Build succeeds with no errors

---

## Design Principles Applied

1. **Solid over Transparent**: All surfaces use solid colors, no backdrop-blur or transparency
2. **Subtle over Flashy**: Removed floating orbs, animated gradients, glow effects
3. **Trustworthy Colors**: Deep void (#0A0A0F) background with trust blue (#3B82F6) accents
4. **Clean Typography**: Inter for UI, JetBrains Mono for data/addresses
5. **Functional Micro-interactions**: Active scale on buttons (active:scale-[0.98]), hover state changes
6. **Bento Grid Layout**: Clean grid system for posts with consistent gaps
7. **Professional Spacing**: Reduced border-radius (rounded-xl → rounded-lg), tighter padding

---

## Committing Changes

**No auto-commits will be performed.**

After all tasks are complete and verified, manually commit your changes when ready:

```bash
git add .
git commit -m "refactor(ui): transform TipPost from glassmorphism to serious DeFi design

- Replace all CSS custom properties with Tailwind utility classes
- Remove glassmorphism effects (backdrop-blur, transparency)
- Remove floating orbs and animated gradients
- Implement solid surfaces with subtle borders
- Update to Inter font family for professional typography
- Add bento grid layout for posts
- Add functional micro-interactions (button scale on active)"
```

---

## Execution Handoff

**Plan complete and saved to `docs/plans/2026-03-31-tippost-ui-refactor.md`.**

**Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**

**If Subagent-Driven chosen:**

- **REQUIRED SUB-SKILL:** Use superpowers:subagent-driven-development
- Stay in this session
- Fresh subagent per task + code review

**If Parallel Session chosen:**

- Guide them to open new session in worktree
- **REQUIRED SUB-SKILL:** New session uses superpowers:executing-plans
