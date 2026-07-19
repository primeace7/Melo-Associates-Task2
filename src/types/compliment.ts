/**
 * The three ways a person can describe who they want a compliment for.
 * This drives both the UI (toggle buttons, suggestion pills) and which
 * variant of System Prompt 1 gets used for inference.
 */
export type ComplimentMode = 'jobTitle' | 'describeSomeone' | 'auto';

/** Stable ids for the three compliments returned by a single inference call. */
export type ComplimentSlot = 'compliment1' | 'compliment2' | 'compliment3';

/**
 * One compliment as tracked in UI state. `text` is always the original,
 * un-escalated compliment. `escalation` is only present once the user has
 * asked to escalate that specific compliment.
 */
export interface ComplimentItem {
  slot: ComplimentSlot;
  text: string;
  /** Which numbered brand guideline rules (if any) the model says shaped this compliment. */
  guidelineRulesFollowed: number[];
  escalation: EscalationState | null;
}

export interface EscalationState {
  /** The compliment text at the moment escalation was requested. */
  original: string;
  /** The over-the-top version returned by the model, once available. */
  escalated: string | null;
  /** Which numbered brand guideline rules (if any) the model says shaped the escalated version. */
  guidelineRulesFollowed: number[];
  isEscalating: boolean;
  error: string | null;
}

/** The full successful result of a "generate compliments" inference call. */
export interface ComplimentResult {
  description: string | null;
  items: ComplimentItem[];
}

/**
 * A snapshot of "what was on screen" saved when the user hits Clear, so the
 * Restore button can bring it back exactly as it was.
 */
export interface ComplimentSnapshot {
  inputText: string;
  mode: ComplimentMode;
  result: ComplimentResult;
}

/** The categories of failure the UI knows how to explain to a person. */
export type AppErrorKind =
  | 'offline'
  | 'rate-limit'
  | 'provider-down'
  | 'invalid-input'
  | 'validation-failed'
  | 'unknown';

export interface AppError {
  kind: AppErrorKind;
  message: string;
}
