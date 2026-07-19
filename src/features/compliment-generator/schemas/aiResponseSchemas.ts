import { Schema, type TypedSchema } from "firebase/ai";

/**
 * Controlled-generation schemas for Firebase AI Logic. These mirror
 * `complimentSchemas.ts` field-for-field and are passed as
 * `generationConfig.responseSchema` so the model is constrained to return
 * the right shape directly, rather than relying solely on the wording of
 * the system prompt. We still run the Zod schemas afterwards — controlled
 * generation guarantees *shape*, not the extra rules Zod checks (like "not
 * empty" or the error/compliments relationship).
 */

/** A schema for an array of 1-based rule numbers. */
const guidelineRulesArraySchema = Schema.array({ items: Schema.integer() });

/** Mirrors `ComplimentGenerationSchema`. */
export const complimentGenerationResponseSchema: TypedSchema = Schema.object({
  properties: {
    description: Schema.string({ nullable: true }),
    error: Schema.string({ nullable: true }),
    compliment1: Schema.string(),
    compliment1GuidelineRules: guidelineRulesArraySchema,
    compliment2: Schema.string(),
    compliment2GuidelineRules: guidelineRulesArraySchema,
    compliment3: Schema.string(),
    compliment3GuidelineRules: guidelineRulesArraySchema,
  },
});

/** Mirrors `EscalationSchema`. */
export const escalationResponseSchema: TypedSchema = Schema.object({
  properties: {
    original: Schema.string(),
    escalated: Schema.string(),
    guidelineRules: guidelineRulesArraySchema,
    error: Schema.string({ nullable: true }),
  },
});
