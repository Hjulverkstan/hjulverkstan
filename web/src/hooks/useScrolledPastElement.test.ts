import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useScrolledPastElement } from '@hooks/useScrolledPastElement';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SELECTOR = '#target';
const ELEMENT_ABS_Y = 200; // fixed absolute document Y of the test element

const createTarget = () => {
  const el = document.createElement('div');
  el.id = 'target';
  document.body.appendChild(el);
  return el;
};

const makeDOMRect = (top: number): DOMRect => ({
  top,
  bottom: 0,
  left: 0,
  right: 0,
  width: 0,
  height: 0,
  x: 0,
  y: top,
  toJSON: () => ({}),
});

const setScrollY = (y: number) =>
  Object.defineProperty(window, 'scrollY', {
    writable: true,
    configurable: true,
    value: y,
  });

// Mirrors real-browser behaviour: bcrTop = absoluteY - scrollY, so that
// targetTop = bcrTop + scrollY always equals ELEMENT_ABS_Y regardless of scroll.
const mockScrollState = (el: HTMLElement, scrollY: number) => {
  setScrollY(scrollY);
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue(
    makeDOMRect(ELEMENT_ABS_Y - scrollY),
  );
};

const fireScroll = () => window.dispatchEvent(new Event('scroll'));

beforeEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  setScrollY(0);
});

// ─── useScrolledPastElement ───────────────────────────────────────────────────

describe('useScrolledPastElement', () => {
  describe('No element found', () => {
    it('returns false and does not throw when selector matches no element', () => {
      // Arrange & Act
      const { result } = renderHook(() =>
        useScrolledPastElement('#nonexistent'),
      );

      // Assert
      expect(result.current).toBe(false);
    });

    it('does not change state when a scroll event fires and no element is found', () => {
      // Arrange
      const { result } = renderHook(() =>
        useScrolledPastElement('#nonexistent'),
      );

      // Act
      act(() => fireScroll());

      // Assert
      expect(result.current).toBe(false);
    });
  });

  describe('Initialisation', () => {
    it('returns false on mount when not yet scrolled to the element', () => {
      // Arrange
      const el = createTarget();
      mockScrollState(el, 0); // scrollY=0 → currentScroll=0, targetTop=200

      // Act
      const { result } = renderHook(() => useScrolledPastElement(SELECTOR));

      // Assert
      expect(result.current).toBe(false);
    });

    it('returns true on mount when already scrolled past the element', () => {
      // Arrange
      const el = createTarget();
      mockScrollState(el, ELEMENT_ABS_Y); // scrollY=200 → currentScroll=200, targetTop=200

      // Act
      const { result } = renderHook(() => useScrolledPastElement(SELECTOR));

      // Assert
      expect(result.current).toBe(true);
    });

    it('returns false when scrolled partway to the element but not yet past it', () => {
      // Arrange — scrollY=100, BCR.top = 200-100 = 100.
      // targetTop = BCR.top + scrollY = 100 + 100 = 200; currentScroll = 100 < 200 → false.
      // With the −scrollY mutation: targetTop = 100 − 100 = 0; 100 ≥ 0 → true (wrong).
      const el = createTarget();
      mockScrollState(el, 100);

      // Act
      const { result } = renderHook(() => useScrolledPastElement(SELECTOR));

      // Assert
      expect(result.current).toBe(false);
    });
  });

  describe('Scroll updates', () => {
    it('updates to true when a scroll event moves position to the element', () => {
      // Arrange
      const el = createTarget();
      mockScrollState(el, 0);
      const { result } = renderHook(() => useScrolledPastElement(SELECTOR));
      expect(result.current).toBe(false);

      // Act
      act(() => {
        mockScrollState(el, ELEMENT_ABS_Y);
        fireScroll();
      });

      // Assert
      expect(result.current).toBe(true);
    });

    it('updates to false when a scroll event moves position back before the element', () => {
      // Arrange
      const el = createTarget();
      mockScrollState(el, ELEMENT_ABS_Y);
      const { result } = renderHook(() => useScrolledPastElement(SELECTOR));
      expect(result.current).toBe(true);

      // Act
      act(() => {
        mockScrollState(el, 0);
        fireScroll();
      });

      // Assert
      expect(result.current).toBe(false);
    });
  });

  describe('Offset', () => {
    it('returns true before reaching the element when a positive offset is supplied', () => {
      // Arrange — scrollY=150, offset=50 → currentScroll=200 = targetTop → true
      // Without offset: currentScroll=150 < targetTop=200 → would be false
      const el = createTarget();
      const offset = 50;
      mockScrollState(el, 150);

      // Act
      const { result } = renderHook(() =>
        useScrolledPastElement(SELECTOR, offset),
      );

      // Assert
      expect(result.current).toBe(true);
    });
  });

  describe('Cleanup on unmount', () => {
    it('does not update state after unmount when a scroll event fires', () => {
      // Arrange
      const el = createTarget();
      mockScrollState(el, 0);
      const { result, unmount } = renderHook(() =>
        useScrolledPastElement(SELECTOR),
      );
      expect(result.current).toBe(false);

      // Act
      unmount();
      act(() => {
        mockScrollState(el, ELEMENT_ABS_Y);
        fireScroll();
      });

      // Assert — state frozen at false since the listener was removed on unmount
      expect(result.current).toBe(false);
    });
  });

  describe('Dependency changes', () => {
    it('re-evaluates scroll state when the offset changes', () => {
      // Arrange — scrollY=100, element at absolute Y 200; without offset currentScroll=100 < 200 → false
      const el = createTarget();
      mockScrollState(el, 100);

      let offset = 0;
      const { result, rerender } = renderHook(() =>
        useScrolledPastElement(SELECTOR, offset),
      );
      expect(result.current).toBe(false);

      // Act — offset=100 → currentScroll = 100+100 = 200 ≥ targetTop=200 → true
      act(() => {
        offset = 100;
        rerender();
      });

      // Assert
      expect(result.current).toBe(true);
    });

    it('re-evaluates scroll state when the selector changes to a different element', () => {
      // Arrange — #target is already scrolled past (scrollY = ELEMENT_ABS_Y)
      const el1 = createTarget();
      mockScrollState(el1, ELEMENT_ABS_Y);

      let selector = SELECTOR;
      const { result, rerender } = renderHook(() =>
        useScrolledPastElement(selector),
      );
      expect(result.current).toBe(true);

      // Arrange — #target2 is far below current scroll position → not past it
      const el2 = document.createElement('div');
      el2.id = 'target2';
      document.body.appendChild(el2);
      vi.spyOn(el2, 'getBoundingClientRect').mockReturnValue(
        makeDOMRect(ELEMENT_ABS_Y), // BCR.top=200; targetTop=200+200=400; currentScroll=200 < 400 → false
      );

      // Act
      act(() => {
        selector = '#target2';
        rerender();
      });

      // Assert
      expect(result.current).toBe(false);
    });
  });
});
