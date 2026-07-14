import type { ComplimentMode } from '../../../types/compliment';

interface ModeOption {
  value: ComplimentMode;
  label: string;
}

const MODE_OPTIONS: ModeOption[] = [
  { value: 'jobTitle', label: 'Job title' },
  { value: 'describeSomeone', label: 'Describe someone' },
  { value: 'auto', label: 'Auto' },
];

interface ModeToggleProps {
  mode: ComplimentMode;
  onChange: (mode: ComplimentMode) => void;
  disabled?: boolean;
}

/** Segmented control for choosing how to interpret the textarea's contents. */
export function ModeToggle({ mode, onChange, disabled }: ModeToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Input mode"
      className="inline-flex w-full flex-wrap gap-1 rounded-full border border-stage-border bg-white/70 p-1 sm:w-auto"
    >
      {MODE_OPTIONS.map((option) => {
        const isActive = option.value === mode;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={`flex-1 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors sm:flex-none ${
              isActive
                ? 'bg-stage-ink text-white shadow-sm'
                : 'text-stage-inkSoft hover:bg-stage-bg disabled:hover:bg-transparent'
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
