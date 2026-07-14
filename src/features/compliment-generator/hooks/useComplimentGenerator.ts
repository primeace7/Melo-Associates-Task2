import { useCallback, useMemo, useReducer } from 'react';
import type {
  AppError,
  ComplimentItem,
  ComplimentMode,
  ComplimentResult,
  ComplimentSlot,
  ComplimentSnapshot,
} from '../../../types/compliment';
import { createJsonModel, generateJsonText } from '../../../lib/firebase';
import { runJsonInference, InferenceError } from '../../../lib/inference';
import { ComplimentGenerationSchema, EscalationSchema, UserInputSchema } from '../schemas/complimentSchemas';
import { getSystemPrompt1, buildComplimentUserPrompt } from '../prompts/systemPrompt1';
import { SYSTEM_PROMPT_2, buildEscalationUserPrompt } from '../prompts/systemPrompt2';
import { invalidInputError } from '../../../lib/errors';

interface State {
  mode: ComplimentMode;
  inputText: string;
  isSubmitting: boolean;
  result: ComplimentResult | null;
  error: AppError | null;
  snapshot: ComplimentSnapshot | null;
}

type Action =
  | { type: 'SET_INPUT_TEXT'; text: string }
  | { type: 'SET_MODE'; mode: ComplimentMode }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; result: ComplimentResult }
  | { type: 'SUBMIT_FAILURE'; error: AppError }
  | { type: 'DISMISS_ERROR' }
  | { type: 'CLEAR' }
  | { type: 'RESTORE' }
  | { type: 'ESCALATE_START'; slot: ComplimentSlot }
  | { type: 'ESCALATE_SUCCESS'; slot: ComplimentSlot; original: string; escalated: string }
  | { type: 'ESCALATE_FAILURE'; slot: ComplimentSlot; message: string };

const initialState: State = {
  mode: 'auto',
  inputText: '',
  isSubmitting: false,
  result: null,
  error: null,
  snapshot: null,
};

function updateItem(result: ComplimentResult, slot: ComplimentSlot, update: (item: ComplimentItem) => ComplimentItem): ComplimentResult {
  return {
    ...result,
    items: result.items.map((item) => (item.slot === slot ? update(item) : item)),
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_INPUT_TEXT':
      return { ...state, inputText: action.text };

    case 'SET_MODE':
      return { ...state, mode: action.mode };

    case 'SUBMIT_START':
      return { ...state, isSubmitting: true, error: null };

    case 'SUBMIT_SUCCESS':
      return { ...state, isSubmitting: false, result: action.result, error: null };

    case 'SUBMIT_FAILURE':
      return { ...state, isSubmitting: false, error: action.error };

    case 'DISMISS_ERROR':
      return { ...state, error: null };

    case 'CLEAR': {
      if (!state.result) return state;
      return {
        ...state,
        snapshot: { inputText: state.inputText, mode: state.mode, result: state.result },
        inputText: '',
        result: null,
        error: null,
      };
    }

    case 'RESTORE': {
      if (!state.snapshot) return state;
      return {
        ...state,
        inputText: state.snapshot.inputText,
        mode: state.snapshot.mode,
        result: state.snapshot.result,
        snapshot: null,
        error: null,
      };
    }

    case 'ESCALATE_START': {
      if (!state.result) return state;
      return {
        ...state,
        result: updateItem(state.result, action.slot, (item) => ({
          ...item,
          escalation: { original: item.text, escalated: null, isEscalating: true, error: null },
        })),
      };
    }

    case 'ESCALATE_SUCCESS': {
      if (!state.result) return state;
      return {
        ...state,
        result: updateItem(state.result, action.slot, (item) => ({
          ...item,
          escalation: { original: action.original, escalated: action.escalated, isEscalating: false, error: null },
        })),
      };
    }

    case 'ESCALATE_FAILURE': {
      if (!state.result) return state;
      return {
        ...state,
        result: updateItem(state.result, action.slot, (item) => ({
          ...item,
          escalation: item.escalation
            ? { ...item.escalation, isEscalating: false, error: action.message }
            : { original: item.text, escalated: null, isEscalating: false, error: action.message },
        })),
      };
    }

    default:
      return state;
  }
}

const SLOTS: ComplimentSlot[] = ['compliment1', 'compliment2', 'compliment3'];

export function useComplimentGenerator() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setInputText = useCallback((text: string) => dispatch({ type: 'SET_INPUT_TEXT', text }), []);
  const setMode = useCallback((mode: ComplimentMode) => dispatch({ type: 'SET_MODE', mode }), []);
  const dismissError = useCallback(() => dispatch({ type: 'DISMISS_ERROR' }), []);

  const canSubmit = useMemo(() => {
    const trimmedLength = state.inputText.trim().length;
    return trimmedLength >= 3 && !state.isSubmitting && !state.result;
  }, [state.inputText, state.isSubmitting, state.result]);

  const submit = useCallback(async () => {
    const parsedInput = UserInputSchema.safeParse(state.inputText);
    if (!parsedInput.success) return;

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      dispatch({
        type: 'SUBMIT_FAILURE',
        error: { kind: 'offline', message: "You seem to be offline. Check your connection and give it another try." },
      });
      return;
    }

    dispatch({ type: 'SUBMIT_START' });

    try {
      const systemInstruction = getSystemPrompt1(state.mode);
      const model = createJsonModel(systemInstruction);

      const data = await runJsonInference({
        callModel: (prompt) => generateJsonText(model, prompt),
        schema: ComplimentGenerationSchema,
        basePrompt: buildComplimentUserPrompt(parsedInput.data),
      });

      if (data.error) {
        dispatch({ type: 'SUBMIT_FAILURE', error: invalidInputError(data.error) });
        return;
      }

      const result: ComplimentResult = {
        description: data.description ?? null,
        items: SLOTS.map((slot) => ({
          slot,
          text: data[slot] ?? '',
          escalation: null,
        })),
      };

      dispatch({ type: 'SUBMIT_SUCCESS', result });
    } catch (err) {
      const appError = err instanceof InferenceError ? err.appError : { kind: 'unknown' as const, message: 'Something unexpected happened. Please try again.' };
      dispatch({ type: 'SUBMIT_FAILURE', error: appError });
    }
  }, [state.inputText, state.mode]);

  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const restore = useCallback(() => dispatch({ type: 'RESTORE' }), []);

  const escalate = useCallback(async (slot: ComplimentSlot) => {
    const item = state.result?.items.find((i) => i.slot === slot);
    if (!item) return;

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      dispatch({ type: 'ESCALATE_FAILURE', slot, message: "You seem to be offline. Check your connection and try again." });
      return;
    }

    dispatch({ type: 'ESCALATE_START', slot });

    try {
      const model = createJsonModel(SYSTEM_PROMPT_2);

      const data = await runJsonInference({
        callModel: (prompt) => generateJsonText(model, prompt),
        schema: EscalationSchema,
        basePrompt: buildEscalationUserPrompt(item.text),
      });

      if (data.error) {
        dispatch({ type: 'ESCALATE_FAILURE', slot, message: data.error });
        return;
      }

      dispatch({
        type: 'ESCALATE_SUCCESS',
        slot,
        original: data.original ?? item.text,
        escalated: data.escalated ?? '',
      });
    } catch (err) {
      const message = err instanceof InferenceError ? err.appError.message : 'Something unexpected happened. Please try again.';
      dispatch({ type: 'ESCALATE_FAILURE', slot, message });
    }
  }, [state.result]);

  return {
    mode: state.mode,
    inputText: state.inputText,
    isSubmitting: state.isSubmitting,
    result: state.result,
    error: state.error,
    canRestore: state.snapshot !== null,
    canClear: state.result !== null,
    canSubmit,
    setInputText,
    setMode,
    submit,
    clear,
    restore,
    escalate,
    dismissError,
  };
}
