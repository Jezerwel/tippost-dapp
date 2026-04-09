import { ToastContainer, type CloseButtonProps } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ToastCloseButton({ closeToast, ariaLabel }: CloseButtonProps) {
  return (
    <button
      type="button"
      onClick={closeToast}
      className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition hover:bg-background-tertiary hover:text-text-primary"
      aria-label={ariaLabel ?? "Close notification"}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}

export function ToastNotifications() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      toastClassName="toast-success:!border-l-success toast-error:!border-l-error !rounded-xl !border !border-border !bg-surface !font-sans !text-sm !text-text-primary !shadow-xl !border-l-4"
      progressClassName="!bg-gradient-to-r !from-primary !to-violet-500"
      closeButton={ToastCloseButton}
    />
  );
}
