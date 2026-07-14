import type { AppError } from '../../../types/compliment';

interface ErrorBannerProps {
  error: AppError;
  onDismiss: () => void;
}

const KIND_LABELS: Record<AppError['kind'], string> = {
  offline: 'No connection',
  'rate-limit': 'Slow down a little',
  'provider-down': 'AI service unavailable',
  'invalid-input': "Couldn't understand that",
  'validation-failed': 'Response got garbled',
  unknown: 'Something went wrong',
};

/** A dismissible, kind-toned banner for any of the app's error categories. */
export function ErrorBanner({ error, onDismiss }: ErrorBannerProps) {
  return (
    <div role="alert" className="flex items-start justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
      <div>
        <p className="font-body text-sm font-semibold text-red-800">{KIND_LABELS[error.kind]}</p>
        <p className="mt-0.5 font-body text-sm text-red-700">{error.message}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="shrink-0 rounded-full p-1 text-red-500 hover:bg-red-100"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
