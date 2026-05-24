import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useAggregatedQueries } from '@hooks/useAggregatedQueries';

// ─── Query shape helpers ──────────────────────────────────────────────────────

type MockQuery<D = unknown, E = unknown> = {
  isLoading: boolean;
  isError: boolean;
  error?: E | null;
  data?: D;
};

const resolved = <D>(data: D): MockQuery<D> => ({
  isLoading: false,
  isError: false,
  data,
});

const loading = (): MockQuery => ({
  isLoading: true,
  isError: false,
  data: undefined,
});

const errored = <E>(error: E): MockQuery<unknown, E> => ({
  isLoading: false,
  isError: true,
  error,
  data: undefined,
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useAggregatedQueries', () => {
  describe('Happy Path', () => {
    it('returns select result and cleared flags when a single query resolves', () => {
      // Arrange
      const select = vi.fn((d1: string) => d1.toUpperCase());
      const query = resolved('hello');

      // Act
      const { result } = renderHook(() =>
        useAggregatedQueries(select, [query]),
      );

      // Assert
      expect(result.current.data).toBe('HELLO');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeUndefined();
    });

    it('passes both data values to select in correct order when two queries resolve', () => {
      // Arrange
      const select = vi.fn((d1: string, d2: number) => `${d1}-${d2}`);
      const q1 = resolved('bike');
      const q2 = resolved(42);

      // Act
      const { result } = renderHook(() =>
        useAggregatedQueries(select, [q1, q2]),
      );

      // Assert
      expect(select).toHaveBeenCalledWith('bike', 42);
      expect(result.current.data).toBe('bike-42');
    });

    it('passes all three data values to select in correct order when three queries resolve', () => {
      // Arrange
      const select = vi.fn(
        (d1: string, d2: number, d3: boolean) => `${d1}-${d2}-${d3}`,
      );
      const q1 = resolved('a');
      const q2 = resolved(1);
      const q3 = resolved(true);

      // Act
      const { result } = renderHook(() =>
        useAggregatedQueries(select, [q1, q2, q3]),
      );

      // Assert
      expect(select).toHaveBeenCalledWith('a', 1, true);
      expect(result.current.data).toBe('a-1-true');
    });
  });

  describe('Loading states', () => {
    it('sets isLoading and suppresses data when one of two queries is loading', () => {
      // Arrange
      const select = vi.fn();
      const q1 = resolved('done');
      const q2 = loading();

      // Act
      const { result } = renderHook(() =>
        useAggregatedQueries(select, [q1, q2]),
      );

      // Assert
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(select).not.toHaveBeenCalled();
    });

    it('sets isLoading and suppresses data when all queries are loading', () => {
      // Arrange
      const select = vi.fn();

      // Act
      const { result } = renderHook(() =>
        useAggregatedQueries(select, [loading(), loading()]),
      );

      // Assert
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(select).not.toHaveBeenCalled();
    });
  });

  describe('Error states', () => {
    it('sets isError, surfaces the error, and suppresses data when one query errors', () => {
      // Arrange
      const select = vi.fn();
      const err = new Error('fetch failed');
      const q1 = resolved('ok');
      const q2 = errored(err);

      // Act
      const { result } = renderHook(() =>
        useAggregatedQueries(select, [q1, q2]),
      );

      // Assert
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(err);
      expect(result.current.data).toBeUndefined();
      expect(select).not.toHaveBeenCalled();
    });

    it('returns the first errored query error when multiple queries error', () => {
      // Arrange
      const select = vi.fn();
      const firstError = new Error('first');
      const secondError = new Error('second');

      // Act
      const { result } = renderHook(() =>
        useAggregatedQueries(select, [
          errored(firstError),
          errored(secondError),
        ]),
      );

      // Assert
      expect(result.current.error).toBe(firstError);
      expect(result.current.error).not.toBe(secondError);
    });

    it('sets both isLoading and isError and suppresses data when queries are simultaneously loading and errored', () => {
      // Arrange
      const select = vi.fn();

      // Act
      const { result } = renderHook(() =>
        useAggregatedQueries(select, [loading(), errored(new Error('boom'))]),
      );

      // Assert
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isError).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(select).not.toHaveBeenCalled();
    });

    it('returns null (not undefined) as error when a query has isError=true but error=null', () => {
      // Arrange
      const select = vi.fn();
      const nullErrorQuery = {
        isLoading: false,
        isError: true,
        error: null,
        data: undefined,
      };

      // Act
      const { result } = renderHook(() =>
        useAggregatedQueries(select, [nullErrorQuery]),
      );

      // Assert
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Input changes', () => {
    it('recomputes and returns updated data when a query data value changes', () => {
      // Arrange
      const select = (d1: string) => ({ value: d1 });
      let query = resolved('hello');

      const { rerender, result } = renderHook(() =>
        useAggregatedQueries(select, [query]),
      );
      const firstDataRef = result.current.data;

      // Act — swap to a new query object so the memo dependency changes
      query = resolved('world');
      rerender();

      // Assert — new reference and updated value
      expect(result.current.data).not.toBe(firstDataRef);
      expect(result.current.data).toEqual({ value: 'world' });
    });
  });
});
