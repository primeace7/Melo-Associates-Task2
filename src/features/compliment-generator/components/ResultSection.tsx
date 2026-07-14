import type { ComplimentResult, ComplimentSlot } from '../../../types/compliment';
import { ComplimentCard } from './ComplimentCard';
import { CopyButton } from './CopyButton';

interface ResultSectionProps {
  result: ComplimentResult;
  onEscalate: (slot: ComplimentSlot) => void;
  onCopied: (message: string) => void;
}

function displayTextFor(item: ComplimentResult['items'][number]): string {
  return item.escalation?.escalated ?? item.text;
}

/**
 * Only ever mounted once a successful inference result exists (see
 * `ComplimentGeneratorPage`), per the "add to the DOM only after the result
 * is returned" requirement.
 */
export function ResultSection({ result, onEscalate, onCopied }: ResultSectionProps) {
  const copyAllText = () =>
    result.items.map((item, index) => `${index + 1}. ${displayTextFor(item)}`).join('\n');

  return (
    <section aria-label="Your compliments" className="animate-fade-slide-up space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        {result.description ? (
          <p className="max-w-lg font-display text-base italic text-stage-inkSoft sm:text-lg">
            {result.description}
          </p>
        ) : (
          <span />
        )}
        <CopyButton
          getText={copyAllText}
          label="Copy all 3"
          copiedLabel="All copied!"
          variant="primary"
          onCopied={() => onCopied('All 3 compliments copied!')}
        />
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {result.items.map((item, index) => (
          <ComplimentCard
            key={item.slot}
            item={item}
            index={index}
            onEscalate={() => onEscalate(item.slot)}
            onCopied={() => onCopied('Compliment copied!')}
          />
        ))}
      </ul>
    </section>
  );
}
