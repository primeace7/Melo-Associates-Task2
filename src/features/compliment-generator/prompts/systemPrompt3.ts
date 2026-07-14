/**
 * System Prompt 3
 * ----------------
 * Extra instructions that get appended to the end of every System Prompt 1
 * variant (Job Title / Describe Someone / Auto). This file is intentionally
 * left blank for now — it's a placeholder for a future phase of the build
 * where more specific behavior/tone rules will be dropped in here.
 *
 * Nothing else needs to change when this is filled in: `getSystemPrompt1()`
 * in `systemPrompt1.ts` already appends `SYSTEM_PROMPT_3_ADDITIONS` to
 * whichever mode variant is active, as long as it's non-empty.
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
