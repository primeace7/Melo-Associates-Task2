/**
 * System Prompt 3
 * ----------------
 * The brand guidelines that get appended to whichever prompt is being sent
 * to the model — System Prompt 1 (generation) or System Prompt 2
 * (escalation) — so brand voice rules are obeyed everywhere, not just on
 * first generation.
 *
 * Guidelines are always a numbered list of individual rules (an array of
 * strings, one per rule) rather than one freeform blob. That's what lets
 * the model reference specific rule numbers in its "guidelineRules" fields
 * (see systemPrompt1.ts / systemPrompt2.ts).
 *
 * `SYSTEM_PROMPT_3_ADDITIONS` below is the app's built-in "Default" set of
 * rules. It's intentionally never read out to the UI: the Brand Guidelines
 * tab shows "Default" as an option a person can select, but never displays
 * or lets anyone edit its actual rules. Fill this array in directly in code
 * with your own default brand voice rules, e.g.:
 *   ['Always keep it PG-13.', 'Never use emoji.', 'Mention teamwork when relevant.']
 *
 * People using the app can also write their own custom guidelines (as a
 * numbered rule list) from the Brand Guidelines tab (up to 3), and pick one
 * to use instead of Default — see `features/brand-guidelines/`. Whichever
 * is currently active gets passed in as `activeGuidelineRules` below.
 */
export const SYSTEM_PROMPT_3_ADDITIONS: string[] = [
  "Never reference physical appearance in any way",
  "Every compliment must reference the person's specific job title or function",
  "Every compliment must include at least one wildly absurd metaphor or comparison",
  "Every compliment must include one made-up statistic, for example: you are in the top 0.4% of all spreadsheet whisperers in the Northern Hemisphere",
  "Maximum 40 words per compliment, no exceptions",
  "The word 'literally' is banned",
  "Never compare the person to a celebrity or any real public figure",
  "All compliments must be workplace appropriate",
];

/** Renders a list of rules as a 1-indexed numbered list, one rule per line. */
function buildNumberedList(rules: string[]): string {
  return rules.map((rule, index) => `${index + 1}. ${rule}`).join("\n");
}

/**
 * Appends the currently active brand guidelines — as a numbered list — to a
 * base system prompt. When `activeGuidelineRules` is null (the "Default"
 * option is selected, or nothing has been chosen yet), falls back to the
 * built-in `SYSTEM_PROMPT_3_ADDITIONS` above. If there are no rules either
 * way, the base prompt is returned unchanged.
 */
export function withBrandGuidelines(
  basePrompt: string,
  activeGuidelineRules: string[] | null,
): string {
  const rules = (activeGuidelineRules ?? SYSTEM_PROMPT_3_ADDITIONS)
    .map((r) => r.trim())
    .filter((r) => r.length > 0);
  if (rules.length === 0) return basePrompt;

  return `${basePrompt}\n\nNumbered brand guidelines you MUST follow, without any exception:\n${buildNumberedList(rules)}\n\nWhen filling in any "GuidelineRules" field in your JSON response, you MUST use the numbers from this exact list:`;
}
