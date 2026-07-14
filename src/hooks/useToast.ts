import { useCallback, useRef, useState } from 'react';

export interface ToastMessage {
  id: number;
  text: string;
}

/**
 * Tiny toast manager: call `showToast("Copied!")` from anywhere and a
 * message appears (and auto-dismisses) at the top center of the screen via
 * the sibling `<Toast />` component.
 */
export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const counterRef = useRef(0);

  const showToast = useCallback((text: string, durationMs = 2200) => {
    counterRef.current += 1;
    const id = counterRef.current;
    setToast({ id, text });

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, durationMs);
  }, []);

  return { toast, showToast };
}
