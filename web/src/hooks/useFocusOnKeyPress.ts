import { useCallback } from 'react';
import useKeyPress from './useKeyPress';

export const useFocusOnKeyPress = (
  ref: React.RefObject<HTMLInputElement>,
  keyCode: string,
) => {
  const focus = useCallback((e: KeyboardEvent) => {
    const el = ref.current;
    if (!el) return;

    const active = document.activeElement as HTMLElement | null;
    const isTyping =
      active?.tagName === 'INPUT' ||
      active?.tagName === 'TEXTAREA' ||
      active?.isContentEditable;

    if (isTyping) return;

    e.preventDefault();
    el.focus();
    el.select();
  }, [ref]);

  useKeyPress(keyCode, focus);
}