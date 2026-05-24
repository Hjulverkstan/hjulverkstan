import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useShopOpenStatus } from '@hooks/useShopOpenData';
import type { OpenHours } from '@data/webedit/shop/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

// 2026-01-05 is a Monday — used as a fixed anchor for all time-based tests
const monday = (hours: number, minutes: number) =>
  new Date(2026, 0, 5, hours, minutes, 0, 0);

// ─── useShopOpenStatus ────────────────────────────────────────────────────────

describe('useShopOpenStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Happy path', () => {
    it('returns true when current time is within open hours', () => {
      // Arrange
      vi.setSystemTime(monday(10, 0));

      // Act
      const { result } = renderHook(() =>
        useShopOpenStatus({ mon: '09:00-17:00' }),
      );

      // Assert
      expect(result.current).toBe(true);
    });

    it('returns false when current time is before open hours', () => {
      // Arrange
      vi.setSystemTime(monday(8, 59));

      // Act
      const { result } = renderHook(() =>
        useShopOpenStatus({ mon: '09:00-17:00' }),
      );

      // Assert
      expect(result.current).toBe(false);
    });

    it('returns false when current time is after close time', () => {
      // Arrange
      vi.setSystemTime(monday(18, 0));

      // Act
      const { result } = renderHook(() =>
        useShopOpenStatus({ mon: '09:00-17:00' }),
      );

      // Assert
      expect(result.current).toBe(false);
    });
  });

  describe('Boundaries', () => {
    it('returns true at exactly the opening minute (inclusive)', () => {
      // Arrange
      vi.setSystemTime(monday(9, 0));

      // Act
      const { result } = renderHook(() =>
        useShopOpenStatus({ mon: '09:00-17:00' }),
      );

      // Assert
      expect(result.current).toBe(true);
    });

    it('returns false at exactly the closing minute (exclusive)', () => {
      // Arrange
      vi.setSystemTime(monday(17, 0));

      // Act
      const { result } = renderHook(() =>
        useShopOpenStatus({ mon: '09:00-17:00' }),
      );

      // Assert
      expect(result.current).toBe(false);
    });
  });

  describe('Null / undefined / missing', () => {
    it('returns false when openHoursData is undefined', () => {
      // Arrange
      vi.setSystemTime(monday(10, 0));

      // Act
      const { result } = renderHook(() => useShopOpenStatus(undefined));

      // Assert
      expect(result.current).toBe(false);
    });

    it('returns false when openHoursData is null', () => {
      // Arrange
      vi.setSystemTime(monday(10, 0));

      // Act
      const { result } = renderHook(() => useShopOpenStatus(null));

      // Assert
      expect(result.current).toBe(false);
    });

    it('returns false when today has no entry in openHoursData', () => {
      // Arrange — it is Monday but only Saturday hours are defined
      vi.setSystemTime(monday(10, 0));

      // Act
      const { result } = renderHook(() =>
        useShopOpenStatus({ sat: '09:00-17:00' }),
      );

      // Assert
      expect(result.current).toBe(false);
    });
  });

  describe('Invalid format', () => {
    it('returns false and logs console.warn when the hours string is not HH:MM-HH:MM', () => {
      // Arrange
      vi.setSystemTime(monday(10, 0));
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Act
      const { result } = renderHook(() =>
        useShopOpenStatus({ mon: '9am-5pm' }),
      );

      // Assert
      expect(result.current).toBe(false);
      expect(warnSpy).toHaveBeenCalledOnce();

      warnSpy.mockRestore();
    });
  });

  describe('Overnight range', () => {
    it('returns true when time is after the opening hour (22:00-02:00 at 23:00)', () => {
      // Arrange
      vi.setSystemTime(monday(23, 0));

      // Act
      const { result } = renderHook(() =>
        useShopOpenStatus({ mon: '22:00-02:00' }),
      );

      // Assert
      expect(result.current).toBe(true);
    });

    it('returns true when time is before the closing hour (22:00-02:00 at 01:00)', () => {
      // Arrange
      vi.setSystemTime(monday(1, 0));

      // Act
      const { result } = renderHook(() =>
        useShopOpenStatus({ mon: '22:00-02:00' }),
      );

      // Assert
      expect(result.current).toBe(true);
    });

    it('returns false when time is between close and open (22:00-02:00 at 12:00)', () => {
      // Arrange
      vi.setSystemTime(monday(12, 0));

      // Act
      const { result } = renderHook(() =>
        useShopOpenStatus({ mon: '22:00-02:00' }),
      );

      // Assert
      expect(result.current).toBe(false);
    });
  });

  describe('Reactivity to input changes', () => {
    it('recomputes when openHoursData reference changes', () => {
      // Arrange — shop is open at 10:00
      vi.setSystemTime(monday(10, 0));
      let openHours: OpenHours = { mon: '09:00-17:00' };
      const { result, rerender } = renderHook(() =>
        useShopOpenStatus(openHours),
      );
      expect(result.current).toBe(true);

      // Act — advance time past close AND swap to a new object reference
      vi.setSystemTime(monday(18, 0));
      openHours = { mon: '09:00-17:00' };
      rerender();

      // Assert — new reference forces a recompute against the current time
      expect(result.current).toBe(false);
    });
  });
});
