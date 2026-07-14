import type { ReactNode } from 'react';

interface PillProps {
  children: ReactNode;
  tone?: 'gold' | 'ink' | 'mint' | 'pink';
}

const TONE_CLASSES: Record<NonNullable<PillProps['tone']>, string> = {
  gold: 'bg-stage-gold/15 text-stage-goldDark',
  ink: 'bg-stage-ink/10 text-stage-ink',
  mint: 'bg-stage-mint/15 text-stage-mint',
  pink: 'bg-stage-pink/15 text-stage-pinkDark',
};

/** A small rounded label used to call out UI terms (button/mode names) or statuses inline in text. */
export function Pill({ children, tone = 'gold' }: PillProps) {
  return (
    <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 font-mono text-[0.8em] font-medium ${TONE_CLASSES[tone]}`}>
      {children}
    </span>
  );
}
