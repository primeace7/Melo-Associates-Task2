import { useToast } from "../../hooks/useToast";
import { Toast } from "../../components/Toast";
import { useComplimentGenerator } from "./hooks/useComplimentGenerator";
import { ModeToggle } from "./components/ModeToggle";
import { SuggestionPills } from "./components/SuggestionPills";
import { InputPanel } from "./components/InputPanel";
import { SubmitButton } from "./components/SubmitButton";
import { ClearRestoreControls } from "./components/ClearRestoreControls";
import { LoadingFacts } from "./components/LoadingFacts";
import { ResultSection } from "./components/ResultSection";
import { ErrorBanner } from "./components/ErrorBanner";
import { HelpButton } from "../help/components/HelpButton";
import { useBrandGuidelines } from "../brand-guidelines/hooks/useBrandGuidelines";
import { BrandGuidelinesButton } from "../brand-guidelines/components/BrandGuidelinesButton";

export function ComplimentGeneratorPage() {
  const { toast, showToast } = useToast();
  const brandGuidelines = useBrandGuidelines();
  const {
    mode,
    inputText,
    isSubmitting,
    result,
    error,
    canRestore,
    canClear,
    canSubmit,
    setInputText,
    setMode,
    submit,
    clear,
    restore,
    escalate,
    dismissError,
  } = useComplimentGenerator(brandGuidelines.activeGuidelineRules);

  return (
    <div className="min-h-screen px-4 py-12 sm:px-8 sm:py-20">
      <Toast toast={toast} />

      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <header className="flex flex-col items-center gap-4 text-center">
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-xl uppercase tracking-wide text-stage-inkSoft">
              Compliment Machine
            </span>
            <div className="flex items-center gap-2">
              <BrandGuidelinesButton {...brandGuidelines} />
              <HelpButton />
            </div>
          </div>
          <h1 className="font-display text-3xl font-semibold leading-tight text-stage-ink sm:text-4xl">
            Hour biggest, most unhinged fan.
          </h1>
          <p className="max-w-md text-sm text-stage-inkSoft sm:text-base">
            Type a job title or describe someone, and get 3 compliments so
            enthusiastic they should probably come with a confetti cannon.
          </p>
        </header>

        <main className="mx-auto flex w-full max-w-3xl flex-col gap-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <ModeToggle
              mode={mode}
              onChange={setMode}
              disabled={isSubmitting || !!result}
            />
            <ClearRestoreControls
              canClear={canClear}
              canRestore={canRestore}
              onClear={clear}
              onRestore={restore}
            />
          </div>

          {mode === "jobTitle" && !result && (
            <SuggestionPills onSelect={setInputText} disabled={isSubmitting} />
          )}

          <InputPanel
            value={inputText}
            onChange={setInputText}
            disabled={isSubmitting || !!result}
          />

          <div>
            <SubmitButton
              isSubmitting={isSubmitting}
              canSubmit={canSubmit}
              hasResult={!!result}
              onClick={submit}
            />
          </div>

          {error && <ErrorBanner error={error} onDismiss={dismissError} />}

          {isSubmitting && <LoadingFacts />}
        </main>

        {result && (
          <div className="w-full">
            <ResultSection
              result={result}
              onEscalate={escalate}
              onCopied={showToast}
            />
          </div>
        )}
      </div>
    </div>
  );
}
