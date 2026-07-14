import { z } from 'zod';

/**
 * Validates the raw JSON returned when generating the initial 3 compliments
 * (System Prompt 1). Shape recap:
 *  - description: short optional summary of the role/person and the compliments
 *  - error: null on success, otherwise a human-readable explanation of what
 *    went wrong (e.g. the input didn't look like a job title or a person)
 *  - compliment1/2/3: required, non-empty strings — but ONLY when `error`
 *    is null. When the model reports an error it's fine for these to be
 *    missing, so the "required" check is done in `.superRefine` below rather
 *    than with plain `z.string()`.
 */
export const ComplimentGenerationSchema = z
  .object({
    description: z.string().trim().nullable().optional(),
    error: z.string().trim().nullable(),
    compliment1: z.string().trim().optional(),
    compliment2: z.string().trim().optional(),
    compliment3: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.error) return; // Model reported a semantic error; compliments are allowed to be absent.

    (['compliment1', 'compliment2', 'compliment3'] as const).forEach((slot) => {
      if (!data[slot] || data[slot]!.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${slot} must be a non-empty string when there is no error`,
          path: [slot],
        });
      }
    });
  });

export type ComplimentGenerationResponse = z.infer<typeof ComplimentGenerationSchema>;

/**
 * Validates the raw JSON returned when escalating a single compliment to be
 * even more over-the-top (System Prompt 2).
 */
export const EscalationSchema = z
  .object({
    original: z.string().trim().optional(),
    escalated: z.string().trim().optional(),
    error: z.string().trim().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.error) return;

    if (!data.original) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'original is required when there is no error', path: ['original'] });
    }
    if (!data.escalated) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'escalated is required when there is no error', path: ['escalated'] });
    }
  });

export type EscalationResponse = z.infer<typeof EscalationSchema>;

/** The user's raw textarea input, validated before we ever call the model. */
export const UserInputSchema = z
  .string()
  .trim()
  .min(3, 'Please enter at least 3 characters.')
  .max(500, 'Please keep it under 500 characters.');
