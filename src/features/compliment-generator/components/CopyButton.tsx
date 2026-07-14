import { useState } from 'react';
import { copyToClipboard } from '../../../lib/clipboard';

interface CopyButtonProps {
  getText: () => string;
  label: string;
  copiedLabel?: string;
  onCopied?: () => void;
  variant?: 'primary' | 'ghost';
}

/**
 * A copy button that shows its own brief "Copied!" state (the per-button
 * visual cue) in addition to firing `onCopied` so the caller can also show a
 * toast. Works for both "copy one compliment" and "copy all" use cases.
 */
export function CopyButton({ getText, label, copiedLabel = 'Copied!', onCopied, variant = 'ghost' }: CopyButtonProps) {
  const [justCopied, setJustCopied] = useState(false);

  const handleClick = async () => {
    const success = await copyToClipboard(getText());
    if (success) {
      setJustCopied(true);
      onCopied?.();
      window.setTimeout(() => setJustCopied(false), 1600);
    }
  };

  const baseClasses = 'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all';
  const variantClasses =
    variant === 'primary'
      ? 'bg-stage-ink text-white hover:bg-stage-ink/90'
      : 'border border-stage-border bg-white text-stage-inkSoft hover:border-stage-gold hover:text-stage-goldDark';
  const copiedClasses = justCopied ? 'ring-2 ring-stage-mint ring-offset-1' : '';

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses} ${copiedClasses}`}
    >
      {justCopied ? (
        <>
          <CheckIcon /> {copiedLabel}
        </>
      ) : (
        <>
          <CopyIcon /> {label}
        </>
      )}
    </button>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="text-stage-mint">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
