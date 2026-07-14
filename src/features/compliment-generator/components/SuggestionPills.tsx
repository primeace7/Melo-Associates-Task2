import { useState } from 'react';
import { getRandomJobTitles } from '../data/suggestedJobTitles';

interface SuggestionPillsProps {
  onSelect: (title: string) => void;
  disabled?: boolean;
}

/**
 * Shows 3 random job title pills. Mounted only while "Job title" mode is
 * active (see `ComplimentGeneratorPage`), so a fresh random set appears
 * every time a person switches into that mode.
 */
export function SuggestionPills({ onSelect, disabled }: SuggestionPillsProps) {
  const [titles] = useState(() => getRandomJobTitles(3));

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Suggested job titles">
      <span className="font-mono text-xs uppercase tracking-wide text-stage-inkSoft">Try:</span>
      {titles.map((title) => (
        <button
          key={title}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(title)}
          className="rounded-full border border-stage-border bg-white px-3 py-1 text-sm text-stage-ink transition-colors hover:border-stage-gold hover:text-stage-goldDark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {title}
        </button>
      ))}
    </div>
  );
}
