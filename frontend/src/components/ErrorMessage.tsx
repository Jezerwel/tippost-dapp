interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div
      className="animate-error-in flex items-center justify-between gap-3 rounded-lg border border-error/20 bg-error/10 p-4 text-sm leading-snug text-error"
      role="alert"
    >
      <div className="flex flex-1 items-start gap-2">
        <svg
          className="mt-0.5 h-5 w-5 shrink-0 text-error"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span className="min-w-0 break-words">{message}</span>
      </div>
      {onDismiss && (
        <button
          type="button"
          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md p-1 text-inherit opacity-70 transition hover:bg-error/10 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-error/40"
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
