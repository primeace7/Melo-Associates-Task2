import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_GUIDELINE_ID, MAX_CUSTOM_GUIDELINES } from '../constants';
import { loadPersistedGuidelines, savePersistedGuidelines } from '../storage';
import type { BrandGuidelineOption, CustomGuideline } from '../types';

function generateId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useBrandGuidelines() {
  const initial = useMemo(() => loadPersistedGuidelines(), []);
  const [customGuidelines, setCustomGuidelines] = useState<CustomGuideline[]>(initial.customGuidelines);
  const [activeGuidelineId, setActiveGuidelineIdState] = useState<string>(initial.activeGuidelineId);

  useEffect(() => {
    savePersistedGuidelines({ customGuidelines, activeGuidelineId });
  }, [customGuidelines, activeGuidelineId]);

  const options: BrandGuidelineOption[] = useMemo(
    () => [
      { id: DEFAULT_GUIDELINE_ID, name: 'Default', isDefault: true },
      ...customGuidelines.map((g) => ({ id: g.id, name: g.name, isDefault: false })),
    ],
    [customGuidelines],
  );

  // Guard against a guideline having been deleted elsewhere (e.g. another tab) while still marked active.
  const activeGuidelineId_ = options.some((o) => o.id === activeGuidelineId) ? activeGuidelineId : DEFAULT_GUIDELINE_ID;
  const activeGuideline = options.find((o) => o.id === activeGuidelineId_) ?? options[0];

  /** null means "use the built-in Default guidelines" — see `withBrandGuidelines()`. */
  const activeGuidelineContent: string | null = useMemo(() => {
    if (activeGuidelineId_ === DEFAULT_GUIDELINE_ID) return null;
    return customGuidelines.find((g) => g.id === activeGuidelineId_)?.content ?? null;
  }, [activeGuidelineId_, customGuidelines]);

  const canAddMore = customGuidelines.length < MAX_CUSTOM_GUIDELINES;

  const addGuideline = useCallback((name: string, content: string) => {
    setCustomGuidelines((prev) => {
      if (prev.length >= MAX_CUSTOM_GUIDELINES) return prev;
      return [...prev, { id: generateId(), name: name.trim(), content: content.trim() }];
    });
  }, []);

  const updateGuideline = useCallback((id: string, name: string, content: string) => {
    setCustomGuidelines((prev) => prev.map((g) => (g.id === id ? { ...g, name: name.trim(), content: content.trim() } : g)));
  }, []);

  const deleteGuideline = useCallback((id: string) => {
    setCustomGuidelines((prev) => prev.filter((g) => g.id !== id));
    setActiveGuidelineIdState((current) => (current === id ? DEFAULT_GUIDELINE_ID : current));
  }, []);

  const setActiveGuidelineId = useCallback((id: string) => setActiveGuidelineIdState(id), []);

  return {
    options,
    customGuidelines,
    activeGuidelineId: activeGuidelineId_,
    activeGuideline,
    activeGuidelineContent,
    canAddMore,
    addGuideline,
    updateGuideline,
    deleteGuideline,
    setActiveGuidelineId,
  };
}

export type UseBrandGuidelinesReturn = ReturnType<typeof useBrandGuidelines>;
