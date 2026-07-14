import { DEFAULT_GUIDELINE_ID, MAX_CUSTOM_GUIDELINES } from './constants';
import type { CustomGuideline } from './types';

const STORAGE_KEY = 'compliment-machine:brand-guidelines:v1';

export interface PersistedGuidelinesState {
  customGuidelines: CustomGuideline[];
  activeGuidelineId: string;
}

const EMPTY_STATE: PersistedGuidelinesState = {
  customGuidelines: [],
  activeGuidelineId: DEFAULT_GUIDELINE_ID,
};

function isCustomGuideline(value: unknown): value is CustomGuideline {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.id === 'string' && typeof record.name === 'string' && typeof record.content === 'string';
}

/**
 * Reads persisted brand guidelines from localStorage. Falls back to an
 * empty/default state if nothing is stored, storage is unavailable (e.g.
 * private browsing), or the stored data doesn't look like what we expect.
 */
export function loadPersistedGuidelines(): PersistedGuidelinesState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return EMPTY_STATE;

    const record = parsed as Record<string, unknown>;
    const customGuidelines = Array.isArray(record.customGuidelines)
      ? record.customGuidelines.filter(isCustomGuideline).slice(0, MAX_CUSTOM_GUIDELINES)
      : [];
    const activeGuidelineId = typeof record.activeGuidelineId === 'string' ? record.activeGuidelineId : DEFAULT_GUIDELINE_ID;

    return { customGuidelines, activeGuidelineId };
  } catch {
    return EMPTY_STATE;
  }
}

/** Persists brand guidelines to localStorage. Silently no-ops if storage isn't available. */
export function savePersistedGuidelines(state: PersistedGuidelinesState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage might be full or unavailable (e.g. private browsing) — not worth surfacing to the user.
  }
}
