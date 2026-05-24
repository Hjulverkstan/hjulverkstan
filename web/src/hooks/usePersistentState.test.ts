import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import usePersistentState, {
  readStore,
  writeStore,
} from '@hooks/usePersistentState';

beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

// ─── readStore ────────────────────────────────────────────────────────────────

describe('readStore', () => {
  it('returns undefined when the key does not exist in localStorage', () => {
    // Arrange — localStorage is empty

    // Act
    const result = readStore('missing');

    // Assert
    expect(result).toBeUndefined();
  });

  it('returns undefined when the stored value is the string "undefined"', () => {
    // Arrange
    localStorage.setItem('key', 'undefined');

    // Act
    const result = readStore('key');

    // Assert
    expect(result).toBeUndefined();
  });

  it('returns the parsed value when valid JSON is stored', () => {
    // Arrange
    localStorage.setItem('key', JSON.stringify({ name: 'Alice', age: 30 }));

    // Act
    const result = readStore('key');

    // Assert
    expect(result).toEqual({ name: 'Alice', age: 30 });
  });

  it('returns undefined and calls console.error when stored JSON is malformed', () => {
    // Arrange
    localStorage.setItem('key', '{invalid json');
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // Act
    const result = readStore('key');

    // Assert
    expect(result).toBeUndefined();
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('key'),
      expect.any(Error),
    );
  });
});

// ─── writeStore ───────────────────────────────────────────────────────────────

describe('writeStore', () => {
  it('serialises the value as JSON and writes it to localStorage', () => {
    // Arrange
    const value = { name: 'Alice', age: 30 };

    // Act
    writeStore('key', value);

    // Assert
    expect(localStorage.getItem('key')).toBe(JSON.stringify(value));
  });

  it('catches and logs a storage error without rethrowing', () => {
    // Arrange
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new Error('QuotaExceededError');
    });
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // Act & Assert — must not throw
    expect(() => writeStore('key', 'value')).not.toThrow();
    expect(consoleError).toHaveBeenCalledOnce();
  });
});

// ─── usePersistentState ───────────────────────────────────────────────────────

describe('usePersistentState', () => {
  describe('Initialisation', () => {
    it('initialises from a previously stored localStorage value rather than initState', () => {
      // Arrange
      localStorage.setItem('my-key', JSON.stringify('stored-value'));

      // Act
      const { result } = renderHook(() =>
        usePersistentState('my-key', 'default'),
      );

      // Assert
      expect(result.current[0]).toBe('stored-value');
    });

    it('falls back to the plain initState value when nothing is stored', () => {
      // Arrange — localStorage is empty

      // Act
      const { result } = renderHook(() =>
        usePersistentState('my-key', 'default'),
      );

      // Assert
      expect(result.current[0]).toBe('default');
    });

    it('calls a function initState with the stored value when one exists', () => {
      // Arrange
      localStorage.setItem('my-key', JSON.stringify(10));
      const initFn = vi.fn((fromStore?: number) => (fromStore ?? 0) * 2);

      // Act
      const { result } = renderHook(() => usePersistentState('my-key', initFn));

      // Assert
      expect(initFn).toHaveBeenCalledWith(10);
      expect(result.current[0]).toBe(20);
    });

    it('calls a function initState with undefined when nothing is stored', () => {
      // Arrange
      const initFn = vi.fn((fromStore?: number) => fromStore ?? 99);

      // Act
      const { result } = renderHook(() => usePersistentState('my-key', initFn));

      // Assert
      expect(initFn).toHaveBeenCalledWith(undefined);
      expect(result.current[0]).toBe(99);
    });
  });

  describe('State and persistence', () => {
    it('state updates via setState are reflected in the return value', () => {
      // Arrange
      const { result } = renderHook(() =>
        usePersistentState('my-key', 'initial'),
      );
      expect(result.current[0]).toBe('initial');

      // Act
      act(() => result.current[1]('updated'));

      // Assert
      expect(result.current[0]).toBe('updated');
    });

    it('writes the new state value to localStorage when state changes', () => {
      // Arrange
      const { result } = renderHook(() =>
        usePersistentState('my-key', 'initial'),
      );

      // Act
      act(() => result.current[1]('updated'));

      // Assert
      expect(localStorage.getItem('my-key')).toBe('"updated"');
    });
  });

  describe('beforeunload persistence', () => {
    it('writes the current state to localStorage when beforeunload fires', () => {
      // Arrange — mount, change state, then wipe storage so the in-effect write
      // does not pre-satisfy the assertion.
      const { result } = renderHook(() =>
        usePersistentState('my-key', 'initial'),
      );
      act(() => result.current[1]('updated'));
      localStorage.clear();

      // Act
      window.dispatchEvent(new Event('beforeunload'));

      // Assert — the listener must flush the latest value back to storage
      expect(localStorage.getItem('my-key')).toBe('"updated"');
    });

    it('does not write to localStorage on beforeunload after unmount', () => {
      // Arrange
      const { result, unmount } = renderHook(() =>
        usePersistentState('my-key', 'initial'),
      );
      act(() => result.current[1]('updated'));
      unmount();
      localStorage.clear();

      // Act
      window.dispatchEvent(new Event('beforeunload'));

      // Assert — listener was removed on unmount, so storage stays empty
      expect(localStorage.getItem('my-key')).toBeNull();
    });
  });
});
