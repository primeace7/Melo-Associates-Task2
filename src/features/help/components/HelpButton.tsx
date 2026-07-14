import { useEffect, useState } from 'react';

const STEPS: { title: string; body: string }[] = [
  {
    title: '1. Choose a mode',
    body: 'Pick "Job title" if you\u2019re typing a role like "barista", "Describe someone" if you\u2019re writing a few words about a specific person, or "Auto" to let the app figure out which one you meant.',
  },
  {
    title: '2. Type or tap a suggestion',
    body: 'Enter at least 3 characters in the box. In "Job title" mode you can also tap one of the 3 suggested pills to fill the box instantly.',
  },
  {
    title: '3. Get compliments',
    body: 'Tap "Get compliments". While it\u2019s thinking, you\u2019ll see some real research about why recognition matters at work.',
  },
  {
    title: '4. Copy, escalate, or start over',
    body: 'Copy any single compliment or all three at once. Tap "Escalate" on a compliment to make it even more over-the-top. Use "Clear" to reset, and "Restore" to bring back what you just cleared.',
  },
];

/** Renders both the trigger button and the modal it opens; no parent state needed. */
export function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-stage-border bg-white/70 px-3.5 py-1.5 text-sm font-medium text-stage-inkSoft transition-colors hover:border-stage-gold hover:text-stage-goldDark"
      >
        <HelpIcon />
        How to use
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-stage-ink/40 p-0 sm:items-center sm:p-4" onClick={() => setIsOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="How to use the Compliment Machine"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-3xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-stage-ink">How to use this thing</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="rounded-full p-1.5 text-stage-inkSoft hover:bg-stage-bg"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <ol className="space-y-4">
              {STEPS.map((step) => (
                <li key={step.title}>
                  <p className="font-semibold text-stage-ink">{step.title}</p>
                  <p className="mt-0.5 text-sm text-stage-inkSoft">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </>
  );
}

function HelpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
