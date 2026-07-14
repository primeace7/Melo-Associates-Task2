interface SubmitButtonProps {
  isSubmitting: boolean;
  canSubmit: boolean;
  hasResult: boolean;
  onClick: () => void;
}

/**
 * Enabled once 3+ characters are entered. Shows "Submitting" with a spinner
 * while the request is in flight, and stays disabled once a result is on
 * screen — hit Clear to unlock it for another round.
 */
export function SubmitButton({ isSubmitting, canSubmit, hasResult, onClick }: SubmitButtonProps) {
  const label = isSubmitting ? 'Submitting' : hasResult ? 'Submitted' : 'Get compliments';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!canSubmit}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-stage-gold px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-stage-goldDark disabled:cursor-not-allowed disabled:bg-stage-border disabled:text-stage-inkSoft"
    >
      {isSubmitting && <span className="h-3.5 w-3.5 animate-spin-slow rounded-full border-2 border-white/40 border-t-white" />}
      {label}
    </button>
  );
}
