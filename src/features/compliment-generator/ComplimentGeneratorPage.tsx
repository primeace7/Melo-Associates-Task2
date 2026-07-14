import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';
import { useComplimentGenerator } from './hooks/useComplimentGenerator';
import { ModeToggle } from './components/ModeToggle';
import { SuggestionPills } from './components/SuggestionPills';
import { InputPanel } from './components/InputPanel';
import { SubmitButton } from './components/SubmitButton';
import { ClearRestoreControls } from './components/ClearRestoreControls';
import { LoadingFacts } from './components/LoadingFacts';
import { ResultSection } from './components/ResultSection';
import { ErrorBanner } from './components/ErrorBanner';
import { HelpButton } from '../help/components/HelpButton';

export function ComplimentGeneratorPage() {
  const { toast, showToast } = useToast();
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
  } = useComplimentGenerator();

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 sm:py-14">
      <Toast toast={toast} />

      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <header className="flex flex-col items-center gap-3 text-center">
          <div className="flex w-full items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wide text-stage-inkSoft">
              Compliment Machine
            </span>
            <HelpButton />
          </div>
          <h1 className="font-display text-3xl font-semibold leading-tight text-stage-ink sm:text-4xl">
            Say hello to your biggest, most unhinged fan.
          </h1>
          <p className="max-w-md text-sm text-stage-inkSoft sm:text-base">
            Type a job title or describe someone, and get 3 compliments so enthusiastic they should
            probably come with a confetti cannon.
          </p>
        </header>

        <main className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <ModeToggle mode={mode} onChange={setMode} disabled={isSubmitting || !!result} />
            <ClearRestoreControls canClear={canClear} canRestore={canRestore} onClear={clear} onRestore={restore} />
          </div>

          {mode === 'jobTitle' && !result && (
            <SuggestionPills onSelect={setInputText} disabled={isSubmitting} />
          )}

          <InputPanel value={inputText} onChange={setInputText} disabled={isSubmitting || !!result} />

          <div>
            <SubmitButton isSubmitting={isSubmitting} canSubmit={canSubmit} hasResult={!!result} onClick={submit} />
          </div>

          {error && <ErrorBanner error={error} onDismiss={dismissError} />}

          {isSubmitting && <LoadingFacts />}

          {result && (
            <ResultSection result={result} onEscalate={escalate} onCopied={showToast} />
          )}
        </main>
      </div>
    </div>
  );
}
