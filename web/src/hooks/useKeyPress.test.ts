import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useKeyPress from '@hooks/useKeyPress';

const fireKeydown = (key: string) =>
  window.dispatchEvent(new KeyboardEvent('keydown', { key }));

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── useKeyPress ──────────────────────────────────────────────────────────────

describe('useKeyPress', () => {
  describe('Callback fires on key match', () => {
    it('invokes the callback exactly once when the registered key is pressed', () => {
      // Arrange
      const callback = vi.fn();
      renderHook(() => useKeyPress('Enter', callback));

      // Act
      fireKeydown('Enter');

      // Assert
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('passes the full KeyboardEvent to the callback with the matching key property', () => {
      // Arrange
      const callback = vi.fn();
      renderHook(() => useKeyPress('Escape', callback));

      // Act
      fireKeydown('Escape');

      // Assert
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'Escape' }),
      );
    });
  });

  describe('Key guard', () => {
    it('does not invoke the callback when a different key is pressed', () => {
      // Arrange
      const callback = vi.fn();
      renderHook(() => useKeyPress('Enter', callback));

      // Act
      fireKeydown('Escape');

      // Assert
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Cleanup on unmount', () => {
    it('does not invoke the callback after the hook unmounts', () => {
      // Arrange
      const callback = vi.fn();
      const { unmount } = renderHook(() => useKeyPress('Enter', callback));

      // Act
      unmount();
      fireKeydown('Enter');

      // Assert
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('targetKey dependency change', () => {
    it('fires the callback for the new key after targetKey changes', () => {
      // Arrange
      const callback = vi.fn();
      let key = 'Enter';
      const { rerender } = renderHook(() => useKeyPress(key, callback));

      // Act
      key = 'Escape';
      rerender();
      fireKeydown('Escape');

      // Assert
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('no longer fires the callback for the old key after targetKey changes', () => {
      // Arrange
      const callback = vi.fn();
      let key = 'Enter';
      const { rerender } = renderHook(() => useKeyPress(key, callback));

      // Act
      key = 'Escape';
      rerender();
      fireKeydown('Enter');

      // Assert
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('callback dependency change', () => {
    it('uses the new callback after it changes and does not call the stale one', () => {
      // Arrange
      const oldCallback = vi.fn();
      const newCallback = vi.fn();
      let currentCallback = oldCallback;
      const { rerender } = renderHook(() =>
        useKeyPress('Enter', currentCallback),
      );

      // Act
      currentCallback = newCallback;
      rerender();
      fireKeydown('Enter');

      // Assert
      expect(newCallback).toHaveBeenCalledTimes(1);
      expect(oldCallback).not.toHaveBeenCalled();
    });
  });
});
