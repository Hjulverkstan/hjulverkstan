import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useFocusOnKeyPress } from '@hooks/useFocusOnKeyPress';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const KEY = '/';

const fireKeydown = (key: string = KEY) =>
  window.dispatchEvent(new KeyboardEvent('keydown', { key }));

const appendToBody = <T extends HTMLElement>(el: T): T => {
  document.body.appendChild(el);
  return el;
};

beforeEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

// ─── useFocusOnKeyPress ───────────────────────────────────────────────────────

describe('useFocusOnKeyPress', () => {
  describe('Null ref guard', () => {
    it('does not throw when ref.current is null and the key is pressed', () => {
      // Arrange
      const ref = { current: null } as React.RefObject<HTMLInputElement>;
      renderHook(() => useFocusOnKeyPress(ref, KEY));

      // Act & Assert
      expect(() => fireKeydown()).not.toThrow();
    });
  });

  describe('Happy path', () => {
    it('calls focus() and select() on the target element when the key is pressed', () => {
      // Arrange
      const input = appendToBody(document.createElement('input'));
      const ref = { current: input } as React.RefObject<HTMLInputElement>;
      const focusSpy = vi.spyOn(input, 'focus');
      const selectSpy = vi.spyOn(input, 'select');
      renderHook(() => useFocusOnKeyPress(ref, KEY));

      // Act
      fireKeydown();

      // Assert
      expect(focusSpy).toHaveBeenCalledTimes(1);
      expect(selectSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('isTyping guard', () => {
    it('does not focus the target when an <input> is the active element', () => {
      // Arrange
      const target = appendToBody(document.createElement('input'));
      const activeInput = appendToBody(document.createElement('input'));
      const ref = { current: target } as React.RefObject<HTMLInputElement>;
      const focusSpy = vi.spyOn(target, 'focus');
      renderHook(() => useFocusOnKeyPress(ref, KEY));
      activeInput.focus();

      // Act
      fireKeydown();

      // Assert
      expect(focusSpy).not.toHaveBeenCalled();
    });

    it('does not focus the target when a <textarea> is the active element', () => {
      // Arrange
      const target = appendToBody(document.createElement('input'));
      const textarea = appendToBody(document.createElement('textarea'));
      const ref = { current: target } as React.RefObject<HTMLInputElement>;
      const focusSpy = vi.spyOn(target, 'focus');
      renderHook(() => useFocusOnKeyPress(ref, KEY));
      textarea.focus();

      // Act
      fireKeydown();

      // Assert
      expect(focusSpy).not.toHaveBeenCalled();
    });

    it('does not focus the target when a contentEditable element is the active element', () => {
      // Arrange
      const target = appendToBody(document.createElement('input'));
      const ref = { current: target } as React.RefObject<HTMLInputElement>;
      const focusSpy = vi.spyOn(target, 'focus');
      renderHook(() => useFocusOnKeyPress(ref, KEY));

      // jsdom does not implement isContentEditable, so we stub the getter
      // to return an element that matches the contentEditable branch of the guard
      vi.spyOn(document, 'activeElement', 'get').mockReturnValue({
        tagName: 'DIV',
        isContentEditable: true,
      } as HTMLElement);

      // Act
      fireKeydown();

      // Assert
      expect(focusSpy).not.toHaveBeenCalled();
    });
  });

  describe('Key guard', () => {
    it('does not focus the target when a different key is pressed', () => {
      // Arrange
      const input = appendToBody(document.createElement('input'));
      const ref = { current: input } as React.RefObject<HTMLInputElement>;
      const focusSpy = vi.spyOn(input, 'focus');
      renderHook(() => useFocusOnKeyPress(ref, KEY));

      // Act
      fireKeydown('Enter');

      // Assert
      expect(focusSpy).not.toHaveBeenCalled();
    });
  });
});
