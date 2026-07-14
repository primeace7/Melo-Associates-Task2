/**
 * System Prompt 3
 * ----------------
 * The brand guidelines that get appended to whichever prompt is being sent
 * to the model — System Prompt 1 (generation) or System Prompt 2
 * (escalation) — so brand voice rules are obeyed everywhere, not just on
 * first generation.
 *
 * `SYSTEM_PROMPT_3_ADDITIONS` below is the app's built-in "Default" brand
 * guidelines. It's intentionally never read out to the UI: the Brand
 * Guidelines tab shows "Default" as an option a person can select, but
 * never displays or lets anyone edit its actual content. Fill this constant
 * in directly in code with your own default brand voice instructions.
 *
 * People using the app can also write their own custom guidelines from the
 * Brand Guidelines tab (up to 3), and pick one to use instead of Default —
 * see `features/brand-guidelines/`. Whichever is currently active gets
 * passed in as `activeGuidelineContent` below.
 */
export const SYSTEM_PROMPT_3_ADDITIONS = `
All compliments generated on behalf of the company must follow these rules without exception:

- Never reference physical appearance in any way
- Every compliment must reference the person's specific job title or function
- Every compliment must include at least one wildly absurd metaphor or comparison
- Every compliment must include one made-up statistic, for example: you are in the top 0.4% of all spreadsheet whisperers in the Northern Hemisphere
- Maximum 40 words per compliment, no exceptions
- The word "literally" is banned
- Never compare the person to a celebrity or any real public figure
- All compliments must be workplace appropriate
`;

/**
 * Appends the currently active brand guidelines to a base system prompt.
 * When `activeGuidelineContent` is null (the "Default" option is selected,
 * or nothing has been chosen yet), falls back to the built-in
 * `SYSTEM_PROMPT_3_ADDITIONS` above.
 */
export function withBrandGuidelines(
  basePrompt: string,
  activeGuidelineContent: string | null,
): string {
  const guidelines = (
    activeGuidelineContent ?? SYSTEM_PROMPT_3_ADDITIONS
  ).trim();
  if (!guidelines) return basePrompt;
  return `${basePrompt}\n\nBrand guidelines you must follow:\n${guidelines}`;
}
