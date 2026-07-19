interface GuidelineRulesBadgeProps {
  ruleNumbers: number[];
}

/**
 * Shows which numbered brand guideline rules the model reported following,
 * e.g. "Rules: 1, 3". Renders nothing when the list is empty (no guidelines
 * were active, or none specifically applied).
 */
export function GuidelineRulesBadge({ ruleNumbers }: GuidelineRulesBadgeProps) {
  if (ruleNumbers.length === 0) return null;

  const sorted = [...ruleNumbers].sort((a, b) => a - b);

  return (
    <span className="inline-flex w-fit items-center gap-1 rounded-md bg-stage-ink/5 px-1.5 py-0.5 font-mono text-[11px] text-stage-inkSoft">
      Rules: {sorted.join(', ')}
    </span>
  );
}
