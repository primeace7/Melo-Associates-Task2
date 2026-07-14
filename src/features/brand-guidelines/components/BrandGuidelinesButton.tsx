import { useEffect, useState } from "react";
import type { UseBrandGuidelinesReturn } from "../hooks/useBrandGuidelines";
import { MAX_CUSTOM_GUIDELINES } from "../constants";
import { Pill } from "../../../components/Pill";

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
  const [draftName, setDraftName] = useState("");
  const [draftContent, setDraftContent] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const startAdding = () => {
    setEditingId("new");
    setDraftName("");
    setDraftContent("");
  };

  const startEditing = (id: string) => {
    const guideline = customGuidelines.find((g) => g.id === id);
    if (!guideline) return;
    setEditingId(id);
    setDraftName(guideline.name);
    setDraftContent(guideline.content);
  };

  const cancelEditing = () => setEditingId(null);

  const saveDraft = () => {
    const name = draftName.trim();
    const content = draftContent.trim();
    if (!name || !content) return;

    if (editingId === "new") {
      addGuideline(name, content);
    } else if (editingId) {
      updateGuideline(editingId, name, content);
    }
    setEditingId(null);
  };

  const canSaveDraft =
    draftName.trim().length > 0 && draftContent.trim().length > 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-stage-border bg-white/70 px-3.5 py-1.5 text-sm font-medium text-stage-inkSoft transition-colors hover:border-stage-gold hover:text-stage-goldDark"
      >
        <SparkleIcon />
        {activeGuideline.isDefault
          ? "Brand guidelines"
          : `Brand guidelines: ${activeGuideline.name}`}
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
              <h2 className="font-display text-xl font-semibold text-stage-ink">
                Brand guidelines
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="rounded-full p-1.5 text-stage-inkSoft hover:bg-stage-bg"
              >
                <CloseIcon />
              </button>
            </div>
            <p className="mb-5 text-m text-stage-inkSoft">
              Add your own style or rules and every compliment (and escalation)
              will follow them. "Default" is built into the app and can't be
              viewed or edited here.
            </p>

            <ul className="space-y-2">
              {options.map((option) => {
                const isActive = option.id === activeGuidelineId;
                const isEditingThis = editingId === option.id;

                return (
                  <li
                    key={option.id}
                    className="rounded-2xl border border-stage-border"
                  >
                    <div className="flex items-center gap-2 px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => setActiveGuidelineId(option.id)}
                        aria-pressed={isActive}
                        className="flex flex-1 items-center gap-2 text-left"
                      >
                        <RadioIcon checked={isActive} />
                        <span className="font-medium text-stage-ink">
                          {option.name}
                        </span>
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

                    {isEditingThis && (
                      <div className="space-y-2 border-t border-stage-border p-3">
                        <input
                          type="text"
                          value={draftName}
                          onChange={(e) => setDraftName(e.target.value)}
                          placeholder="Guideline name, e.g. Playful startup voice"
                          className="w-full rounded-lg border border-stage-border px-3 py-1.5 text-sm text-stage-ink placeholder:text-stage-inkSoft/70"
                        />
                        <textarea
                          value={draftContent}
                          onChange={(e) => setDraftContent(e.target.value)}
                          rows={4}
                          placeholder="e.g. Always keep it PG-13. Never use emoji. Mention teamwork when relevant."
                          className="w-full resize-none rounded-lg border border-stage-border px-3 py-2 text-sm text-stage-ink placeholder:text-stage-inkSoft/70"
                        />
                        <div className="flex justify-end gap-2">
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
                    )}
                  </li>
                );
              })}

              {editingId === "new" && (
                <li className="space-y-2 rounded-2xl border border-dashed border-stage-gold/50 bg-stage-gold/5 p-3">
                  <input
                    type="text"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    placeholder="Guideline name, e.g. Playful startup voice"
                    autoFocus
                    className="w-full rounded-lg border border-stage-border px-3 py-1.5 text-sm text-stage-ink placeholder:text-stage-inkSoft/70"
                  />
                  <textarea
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    rows={4}
                    placeholder="e.g. Always keep it PG-13. Never use emoji. Mention teamwork when relevant."
                    className="w-full resize-none rounded-lg border border-stage-border px-3 py-2 text-sm text-stage-ink placeholder:text-stage-inkSoft/70"
                  />
                  <div className="flex justify-end gap-2">
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
                  {MAX_CUSTOM_GUIDELINES} of {MAX_CUSTOM_GUIDELINES} custom
                  slots used — delete one to add another
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
        checked ? "border-stage-gold" : "border-stage-border"
      }`}
    >
      {checked && <span className="h-2 w-2 rounded-full bg-stage-gold" />}
    </span>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
