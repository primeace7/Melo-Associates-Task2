interface ClearRestoreControlsProps {
  canClear: boolean;
  canRestore: boolean;
  onClear: () => void;
  onRestore: () => void;
}

/**
 * Clear is only active once a successful result exists; Restore is only
 * active right after Clear has been used (i.e. there's a snapshot to bring
 * back). Both render always so their availability itself is a visible cue.
 */
export function ClearRestoreControls({ canClear, canRestore, onClear, onRestore }: ClearRestoreControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onClear}
        disabled={!canClear}
        className="rounded-full border border-stage-border px-3.5 py-1.5 text-sm font-medium text-stage-inkSoft transition-colors hover:border-stage-ink hover:text-stage-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-stage-border disabled:hover:text-stage-inkSoft"
      >
        Clear
      </button>
      <button
        type="button"
        onClick={onRestore}
        disabled={!canRestore}
        className="rounded-full border border-stage-border px-3.5 py-1.5 text-sm font-medium text-stage-inkSoft transition-colors hover:border-stage-ink hover:text-stage-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-stage-border disabled:hover:text-stage-inkSoft"
      >
        Restore
      </button>
    </div>
  );
}
