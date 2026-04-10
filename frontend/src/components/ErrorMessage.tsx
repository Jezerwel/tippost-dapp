interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div
      className="animate-error-in flex items-center justify-between gap-3 px-3 py-2.5 font-mono text-xs"
      style={{
        border: "2px solid var(--clr-error, #EF4444)",
        color: "var(--clr-error, #EF4444)",
      }}
      role="alert"
    >
      <div className="flex items-start gap-2">
        <span>⚠</span>
        <span className="min-w-0 break-words">{message}</span>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error"
          style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
