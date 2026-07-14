import type { AppError } from '../types/compliment';

/**
 * Turns whatever a failed fetch/SDK call throws into one of the error
 * categories the UI knows how to explain kindly to a person.
 */
export function classifyError(err: unknown): AppError {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return {
      kind: 'offline',
      message: "You seem to be offline. Check your connection and give it another try.",
    };
  }

  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();

  if (lower.includes('429') || lower.includes('quota') || lower.includes('rate limit') || lower.includes('resource_exhausted') || lower.includes('resource-exhausted')) {
    return {
      kind: 'rate-limit',
      message: "We're getting a lot of compliment requests right now and hit a rate limit. Please wait a moment before trying again.",
    };
  }

  if (
    lower.includes('500') ||
    lower.includes('503') ||
    lower.includes('unavailable') ||
    lower.includes('internal error') ||
    lower.includes('deadline')
  ) {
    return {
      kind: 'provider-down',
      message: "The AI service seems to be having a moment. Please try again shortly.",
    };
  }

  return {
    kind: 'unknown',
    message: 'Something unexpected happened on our end. Please try again.',
  };
}

/** Used when the model's response fails schema validation twice in a row. */
export function validationFailedError(): AppError {
  return {
    kind: 'validation-failed',
    message: "We couldn't quite get a clean response that time. Please try again — a second attempt usually does the trick.",
  };
}

/** Used when the model itself reports it couldn't interpret the user's input. */
export function invalidInputError(modelMessage: string): AppError {
  return {
    kind: 'invalid-input',
    message: modelMessage,
  };
}
