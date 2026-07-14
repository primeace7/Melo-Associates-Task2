import type { ComplimentResult, ComplimentSlot } from '../../../types/compliment';
import { ComplimentCard } from './ComplimentCard';
import { CopyButton } from './CopyButton';
import { getComplimentCopyText } from '../utils/complimentText';

interface ResultSectionProps {
  result: ComplimentResult;
  onEscalate: (slot: ComplimentSlot) => void;
  onCopied: (message: string) => void;
}

/**
 * Only ever mounted once a successful inference result exists (see
 * `ComplimentGeneratorPage`), per the "add to the DOM only after the result
 * is returned" requirement.
 */
export function ResultSection({ result, onEscalate, onCopied }: ResultSectionProps) {
  const copyAllText = () =>
    result.items.map((item, index) => `${index + 1}. ${getComplimentCopyText(item)}`).join('\n\n');

  return (
    <section aria-label="Your compliments" className="animate-fade-slide-up mt-2 space-y-6">
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

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
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
