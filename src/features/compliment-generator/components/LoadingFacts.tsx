import { useEffect, useState } from "react";
import { LOADING_FACTS } from "../data/loadingFacts";

const MIN_DURATION_MS = 3200;
const MAX_DURATION_MS = 8000;
const MS_PER_CHARACTER = 45;
const BASE_DURATION_MS = 2200;

/** Longer facts stay on screen longer, shorter ones move along faster. */
function durationForText(text: string): number {
  const estimated = BASE_DURATION_MS + text.length * MS_PER_CHARACTER;
  return Math.min(MAX_DURATION_MS, Math.max(MIN_DURATION_MS, estimated));
}

/**
 * Shown while an inference request is in flight: a simple spinner plus a
 * vertically cycling ticker of research-backed findings about why
 * compliments/recognition matter at work, each one staying on screen for a
 * duration proportional to its length.
 */
export function LoadingFacts() {
  const [index, setIndex] = useState(0);
  const fact = LOADING_FACTS[index];

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIndex((current) => (current + 1) % LOADING_FACTS.length);
    }, durationForText(fact.text));

    return () => window.clearTimeout(timeoutId);
  }, [index, fact.text]);

  return (
    <div
      className="flex flex-col items-center gap-5 py-6"
      role="status"
      aria-live="polite"
    >
      <span className="relative flex h-10 w-10 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full" />
        <span className="h-8 w-8 animate-spin-slow rounded-full border-[3px] border-stage-border border-t-stage-gold" />
      </span>

      <div className="hide-scrollbar h-24 w-full max-w-md overflow-hidden px-4 text-center sm:h-20">
        <p
          key={fact.id}
          className="animate-[ticker-in_var(--ticker-duration)_ease-in-out] font-display text-base italic text-stage-ink sm:text-lg"
          style={{
            ["--ticker-duration" as string]: `${durationForText(fact.text)}ms`,
          }}
        >
          &ldquo;{fact.text}&rdquo;
        </p>
        <p
          key={`${fact.id}-source`}
          className="mt-1 font-mono text-xs size-fit uppercase tracking-wide text-stage-inkSoft"
        >
          — {fact.source}
        </p>
      </div>
    </div>
  );
}
