import type { ToastMessage } from '../hooks/useToast';

interface ToastProps {
  toast: ToastMessage | null;
}

/** Renders the current toast (if any) fixed to the top center of the screen. */
export function Toast({ toast }: ToastProps) {
  if (!toast) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      aria-live="polite"
      role="status"
    >
      <div
        key={toast.id}
        className="animate-fade-slide-up rounded-full bg-stage-ink px-4 py-2 text-sm font-medium text-white shadow-lg"
      >
        {toast.text}
      </div>
    </div>
  );
}
