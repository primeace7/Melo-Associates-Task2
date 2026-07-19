import { useEffect, useState } from 'react';
import type { UseBrandGuidelinesReturn } from '../hooks/useBrandGuidelines';
import { MAX_CUSTOM_GUIDELINES, MAX_RULES_PER_GUIDELINE } from '../constants';
import { Pill } from '../../../components/Pill';

type BrandGuidelinesButtonProps = UseBrandGuidelinesReturn;

/** Trigger button + modal for viewing, selecting, and managing brand guidelines. */
export function BrandGuidelinesButton({
  options,
  customGuidelines,
  activeGuidelineId,
  activeGuideline,
  canAddMore,
  addGuideline,
  updateGuideline,
  deleteGuideline,
  setActiveGuidelineId,
}: BrandGuidelinesButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // 'new', a custom guideline id, or null
  const [draftName, setDraftName] = useState('');
  const [draftRules, setDraftRules] = useState<string[]>(['']);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const startAdding = () => {
    setEditingId('new');
    setDraftName('');
    setDraftRules(['']);
  };

  const startEditing = (id: string) => {
    const guideline = customGuidelines.find((g) => g.id === id);
    if (!guideline) return;
    setEditingId(id);
    setDraftName(guideline.name);
    setDraftRules(guideline.rules.length > 0 ? guideline.rules : ['']);
  };

  const cancelEditing = () => setEditingId(null);

  const saveDraft = () => {
    const name = draftName.trim();
    const cleanedRules = draftRules.map((r) => r.trim()).filter((r) => r.length > 0);
    if (!name || cleanedRules.length === 0) return;

    if (editingId === 'new') {
      addGuideline(name, cleanedRules);
    } else if (editingId) {
      updateGuideline(editingId, name, cleanedRules);
    }
    setEditingId(null);
  };

  const canSaveDraft = draftName.trim().length > 0 && draftRules.some((r) => r.trim().length > 0);

  const renderForm = () => (
    <div className="space-y-2 border-t border-stage-border p-3 first:border-t-0">
      <input
        type="text"
        value={draftName}
        onChange={(e) => setDraftName(e.target.value)}
        placeholder="Guideline name, e.g. Playful startup voice"
        autoFocus
        className="w-full rounded-lg border border-stage-border px-3 py-1.5 text-sm text-stage-ink placeholder:text-stage-inkSoft/70"
      />

      <div className="space-y-1.5">
        {draftRules.map((rule, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="w-5 shrink-0 font-mono text-xs text-stage-inkSoft">{index + 1}.</span>
            <input
              type="text"
              value={rule}
              onChange={(e) =>
                setDraftRules((prev) => prev.map((r, i) => (i === index ? e.target.value : r)))
              }
              placeholder="e.g. Always mention teamwork"
              className="flex-1 rounded-lg border border-stage-border px-3 py-1.5 text-sm text-stage-ink placeholder:text-stage-inkSoft/70"
            />
            <button
              type="button"
              onClick={() => setDraftRules((prev) => prev.filter((_, i) => i !== index))}
              aria-label={`Remove rule ${index + 1}`}
              className="shrink-0 rounded-full p-1.5 text-stage-inkSoft hover:bg-red-50 hover:text-red-600"
            >
              <TrashIcon />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setDraftRules((prev) => [...prev, ''])}
        disabled={draftRules.length >= MAX_RULES_PER_GUIDELINE}
        className="inline-flex items-center gap-1 rounded-full border border-dashed border-stage-border px-2.5 py-1 text-xs font-medium text-stage-inkSoft hover:border-stage-gold hover:text-stage-goldDark disabled:cursor-not-allowed disabled:opacity-40"
      >
        <PlusIcon />
        Add rule
      </button>

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={cancelEditing}
          className="rounded-full px-3 py-1.5 text-sm font-medium text-stage-inkSoft hover:bg-stage-bg"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={saveDraft}
          disabled={!canSaveDraft}
          className="rounded-full bg-stage-ink px-3.5 py-1.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-stage-border bg-white/70 px-3.5 py-1.5 text-sm font-medium text-stage-inkSoft transition-colors hover:border-stage-gold hover:text-stage-goldDark"
      >
        <SparkleIcon />
        {activeGuideline.isDefault ? 'Brand guidelines' : `Brand guidelines: ${activeGuideline.name}`}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-stage-ink/40 p-0 sm:items-center sm:p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Brand guidelines"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-3xl"
          >
            <div className="mb-1 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-stage-ink">Brand guidelines</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="rounded-full p-1.5 text-stage-inkSoft hover:bg-stage-bg"
              >
                <CloseIcon />
              </button>
            </div>
            <p className="mb-5 text-sm text-stage-inkSoft">
              Add your own numbered style/tone rules and every compliment (and escalation) will follow
              them — and report back which rule numbers it actually used. "Default" is built into the
              app and can't be viewed or edited here.
            </p>

            <ul className="space-y-2">
              {options.map((option) => {
                const isActive = option.id === activeGuidelineId;
                const isEditingThis = editingId === option.id;

                return (
                  <li key={option.id} className="rounded-2xl border border-stage-border">
                    <div className="flex items-center gap-2 px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => setActiveGuidelineId(option.id)}
                        aria-pressed={isActive}
                        className="flex flex-1 items-center gap-2 text-left"
                      >
                        <RadioIcon checked={isActive} />
                        <span className="font-medium text-stage-ink">{option.name}</span>
                        {isActive && <Pill tone="mint">Active</Pill>}
                        {option.isDefault && (
                          <span className="font-mono text-[11px] uppercase tracking-wide text-stage-inkSoft/70">
                            hidden
                          </span>
                        )}
                      </button>

                      {!option.isDefault && (
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() => startEditing(option.id)}
                            aria-label={`Edit ${option.name}`}
                            className="rounded-full p-1.5 text-stage-inkSoft hover:bg-stage-bg hover:text-stage-ink"
                          >
                            <EditIcon />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteGuideline(option.id)}
                            aria-label={`Delete ${option.name}`}
                            className="rounded-full p-1.5 text-stage-inkSoft hover:bg-red-50 hover:text-red-600"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      )}
                    </div>

                    {isEditingThis && renderForm()}
                  </li>
                );
              })}

              {editingId === 'new' && (
                <li className="rounded-2xl border border-dashed border-stage-gold/50 bg-stage-gold/5">
                  {renderForm()}
                </li>
              )}
            </ul>

            <div className="mt-4">
              {canAddMore ? (
                <button
                  type="button"
                  onClick={startAdding}
                  disabled={editingId !== null}
                  className="inline-flex items-center gap-1.5 rounded-full border border-stage-border px-3.5 py-1.5 text-sm font-medium text-stage-inkSoft transition-colors hover:border-stage-gold hover:text-stage-goldDark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <PlusIcon />
                  Add guideline
                </button>
              ) : (
                <p className="font-mono text-xs uppercase tracking-wide text-stage-inkSoft/70">
                  {MAX_CUSTOM_GUIDELINES} of {MAX_CUSTOM_GUIDELINES} custom slots used — delete one to add another
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function RadioIcon({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
        checked ? 'border-stage-gold' : 'border-stage-border'
      }`}
    >
      {checked && <span className="h-2 w-2 rounded-full bg-stage-gold" />}
    </span>
  );
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
