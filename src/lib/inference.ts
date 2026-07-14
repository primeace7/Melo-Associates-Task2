import type { ZodSchema } from 'zod';
import type { AppError } from '../types/compliment';
import { classifyError, validationFailedError } from './errors';

export class InferenceError extends Error {
  appError: AppError;

  constructor(appError: AppError) {
    super(appError.message);
    this.name = 'InferenceError';
    this.appError = appError;
  }
}

/** Strips ```json ... ``` style fences in case the model adds them anyway. */
function extractJsonText(raw: string): string {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced ? fenced[1].trim() : trimmed;
}

interface RunJsonInferenceParams<T> {
  /** Calls the model with the given prompt and resolves to the raw response text. */
  callModel: (prompt: string) => Promise<string>;
  schema: ZodSchema<T>;
  basePrompt: string;
  /** Total attempts, including the first. Defaults to 2 (1 retry on validation failure). */
  maxAttempts?: number;
}

/**
 * Calls the model, parses its output as JSON, and validates it against
 * `schema`. If parsing or validation fails, retries once with a follow-up
 * prompt that includes the previous (invalid) output and a stricter
 * reminder of the required shape.
 *
 * Network, rate-limit, and provider errors are NOT retried here — those
 * throw immediately as an `InferenceError` so the UI can show a specific,
 * relevant message rather than silently retrying a lost cause.
 */
export async function runJsonInference<T>({
  callModel,
  schema,
  basePrompt,
  maxAttempts = 2,
}: RunJsonInferenceParams<T>): Promise<T> {
  let lastRawText = '';

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const prompt =
      attempt === 1
        ? basePrompt
        : `${basePrompt}\n\nYour previous response could not be parsed as valid JSON in the required shape. Here is exactly what you returned:\n${lastRawText}\n\nRespond again with ONLY a single valid JSON object matching the required shape exactly — no markdown fences, no commentary before or after it.`;

    let rawText: string;
    try {
      rawText = await callModel(prompt);
    } catch (err) {
      // Transport-level failure (offline, rate limit, provider down, etc).
      // Don't retry — surface it immediately with the right explanation.
      throw new InferenceError(classifyError(err));
    }

    lastRawText = rawText;

    try {
      const parsed: unknown = JSON.parse(extractJsonText(rawText));
      const result = schema.safeParse(parsed);
      if (result.success) {
        return result.data;
      }
    } catch {
      // JSON.parse failed — fall through and retry (or exhaust attempts) below.
    }
  }

  throw new InferenceError(validationFailedError());
}
