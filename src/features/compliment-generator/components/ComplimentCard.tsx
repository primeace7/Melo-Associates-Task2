import type { ComplimentItem } from '../../../types/compliment';
import { CopyButton } from './CopyButton';
import { GuidelineRulesBadge } from './GuidelineRulesBadge';
import { getComplimentCopyText } from '../utils/complimentText';

interface ComplimentCardProps {
  item: ComplimentItem;
  index: number;
  onEscalate: () => void;
  onCopied: () => void;
}

/**
 * One compliment, styled like an award ticket stub. Before escalation it
 * just shows the compliment. After escalation, both the original and the
 * escalated version are shown with clear visual distinction.
 */
export function ComplimentCard({ item, index, onEscalate, onCopied }: ComplimentCardProps) {
  const { escalation } = item;

  return (
    <li
      className="ticket-card animate-fade-slide-up p-5 pl-7 sm:p-6 sm:pl-9"
      style={{ ['--tear-y' as string]: '2.25rem', animationDelay: `${index * 90}ms` }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="font-mono text-xs uppercase tracking-wide text-stage-inkSoft">
          Compliment {index + 1}
        </span>
        <CopyButton getText={() => getComplimentCopyText(item)} label="Copy" onCopied={onCopied} />
      </div>

      {!escalation && (
        <div className="space-y-2">
          <p className="font-display text-lg leading-snug text-stage-ink sm:text-xl">{item.text}</p>
          <GuidelineRulesBadge ruleNumbers={item.guidelineRulesFollowed} />
        </div>
      )}

      {escalation && (
        <div className="space-y-3">
          <div className="rounded-xl bg-stage-bg/70 p-3">
            <span className="mb-1 block font-mono text-[11px] uppercase tracking-wide text-stage-inkSoft">
              Original
            </span>
            <p className="font-body text-sm text-stage-inkSoft">{escalation.original}</p>
          </div>

          {escalation.isEscalating && (
            <div className="flex items-center gap-2 rounded-xl border border-dashed border-stage-pink/50 p-3">
              <span className="h-4 w-4 animate-spin-slow rounded-full border-2 border-stage-pink/30 border-t-stage-pink" />
              <span className="font-body text-sm text-stage-inkSoft">Cranking the dial past 11...</span>
            </div>
          )}

          {!escalation.isEscalating && escalation.escalated && (
            <div className="space-y-2 rounded-xl border border-stage-pink/30 bg-stage-pink/10 p-3">
              <span className="mb-1 block font-mono text-[11px] uppercase tracking-wide text-stage-pinkDark">
                Escalated
              </span>
              <p className="font-display text-lg leading-snug text-stage-ink sm:text-xl">
                {escalation.escalated}
              </p>
              <GuidelineRulesBadge ruleNumbers={escalation.guidelineRulesFollowed} />
            </div>
          )}

          {!escalation.isEscalating && escalation.error && (
            <p className="rounded-xl bg-red-50 p-3 font-body text-sm text-red-700">{escalation.error}</p>
          )}
        </div>
      )}

      <div className="mt-4">
        <button
          type="button"
          onClick={onEscalate}
          disabled={escalation?.isEscalating}
          className="inline-flex items-center gap-1.5 rounded-full border border-stage-gold/50 bg-stage-gold/10 px-3 py-1.5 text-sm font-medium text-stage-goldDark transition-colors hover:bg-stage-gold/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RocketIcon />
          {escalation?.escalated ? 'Escalate again' : 'Escalate'}
        </button>
      </div>
    </li>
  );
}

function RocketIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}
