import { ToastContainer, type CloseButtonProps } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CloseBtn({ closeToast, ariaLabel }: CloseButtonProps) {
  return (
    <button
      type="button"
      onClick={closeToast}
      className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center font-mono text-xs"
      style={{ color: "var(--ink-muted)", background: "none", border: "none", cursor: "pointer" }}
      aria-label={ariaLabel ?? "Close"}
    >
      ✕
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
      style={{ fontFamily: "DM Sans, ui-sans-serif" }}
      toastStyle={{
        background: "var(--elevated)",
        color: "var(--ink)",
        border: "2px solid var(--border-strong)",
        borderRadius: "0px",
        boxShadow: "4px 4px 0px var(--border-strong)",
        fontSize: "0.875rem",
      }}
      progressClassName="!bg-[#FF4F30]"
      closeButton={CloseBtn}
    />
  );
}
