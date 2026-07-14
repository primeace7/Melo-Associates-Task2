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

/** Mirrors `ComplimentGenerationSchema`. */
export const complimentGenerationResponseSchema = Schema.object({
  properties: {
    description: Schema.string({ nullable: true }),
    error: Schema.string({ nullable: true }),
    compliment1: Schema.string({ nullable: true }),
    compliment2: Schema.string({ nullable: true }),
    compliment3: Schema.string({ nullable: true }),
  },
  optionalProperties: [],
});

/** Mirrors `EscalationSchema`. */
export const escalationResponseSchema: TypedSchema = Schema.object({
  properties: {
    original: Schema.string({ nullable: true }),
    escalated: Schema.string({ nullable: true }),
    error: Schema.string({ nullable: true }),
  },
  optionalProperties: [],
});
