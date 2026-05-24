import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLocation, useNavigate } from 'react-router-dom';

import { Lang } from '@data/webedit/types';
import { usePreloadedData } from '@hooks/usePreloadedData';
import { useChangeLang } from '@hooks/useChangeLang';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
}));

vi.mock('@hooks/usePreloadedData', () => ({
  usePreloadedData: vi.fn(),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ALL_LANGS = ['sv', 'en', 'ar', 'fa', 'so', 'bs', 'tr'];
const mockNavigate = vi.fn();

const mockLocation = (pathname: string, search = '', hash = '') =>
  vi.mocked(useLocation).mockReturnValue({
    pathname,
    search,
    hash,
    state: null,
    key: 'default',
  });

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  vi.mocked(usePreloadedData).mockReturnValue({
    langs: ALL_LANGS,
    data: {} as any,
  });
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useChangeLang', () => {
  describe('Happy Path', () => {
    it('strips the current lang prefix and navigates with the new lang', () => {
      // Arrange
      mockLocation('/sv/shops');
      const { result } = renderHook(() => useChangeLang());

      // Act
      result.current(Lang.EN);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/en/shops', { replace: true });
    });

    it('works correctly with multi-segment paths', () => {
      // Arrange
      mockLocation('/sv/shops/my-slug');
      const { result } = renderHook(() => useChangeLang());

      // Act
      result.current(Lang.EN);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/en/shops/my-slug', {
        replace: true,
      });
    });

    it('navigates to the new lang root when on the localized root path', () => {
      // Arrange
      mockLocation('/sv');
      const { result } = renderHook(() => useChangeLang());

      // Act
      result.current(Lang.EN);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/en', { replace: true });
    });
  });

  describe('Boundary / Edge Cases', () => {
    it('preserves the search query string in the new URL', () => {
      // Arrange
      mockLocation('/sv/shops', '?q=foo');
      const { result } = renderHook(() => useChangeLang());

      // Act
      result.current(Lang.EN);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/en/shops?q=foo', {
        replace: true,
      });
    });

    it('preserves the hash fragment in the new URL', () => {
      // Arrange
      mockLocation('/sv/shops', '', '#section');
      const { result } = renderHook(() => useChangeLang());

      // Act
      result.current(Lang.EN);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/en/shops#section', {
        replace: true,
      });
    });

    it('does not strip a lang-looking segment that is not at the path root', () => {
      // Arrange — 'sv' appears mid-path, not as the leading prefix
      mockLocation('/shops/sv/detail');
      const { result } = renderHook(() => useChangeLang());

      // Act
      result.current(Lang.EN);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/en/shops/sv/detail', {
        replace: true,
      });
    });

    it('prepends the new lang when the current path has no existing lang prefix', () => {
      // Arrange
      mockLocation('/portal/inventory');
      const { result } = renderHook(() => useChangeLang());

      // Act
      result.current(Lang.EN);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/en/portal/inventory', {
        replace: true,
      });
    });

    it('strips the lang prefix case-insensitively', () => {
      // Arrange
      mockLocation('/SV/shops');
      const { result } = renderHook(() => useChangeLang());

      // Act
      result.current(Lang.EN);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/en/shops', { replace: true });
    });
  });

  describe('Navigation behaviour', () => {
    it('always navigates with replace: true', () => {
      // Arrange
      mockLocation('/sv/shops');
      const { result } = renderHook(() => useChangeLang());

      // Act
      result.current(Lang.EN);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith(expect.any(String), {
        replace: true,
      });
    });
  });

  describe('Stale-closure / memoisation', () => {
    it('uses the updated pathname after a location change between renders', () => {
      // Arrange — first render on /sv/shops
      mockLocation('/sv/shops');
      const { result, rerender } = renderHook(() => useChangeLang());

      // Act — location changes, hook re-renders, then callback fires
      mockLocation('/sv/stories');
      rerender();
      result.current(Lang.EN);

      // Assert — new pathname is used, stale one is not
      expect(mockNavigate).toHaveBeenCalledWith('/en/stories', {
        replace: true,
      });
      expect(mockNavigate).not.toHaveBeenCalledWith(
        '/en/shops',
        expect.anything(),
      );
    });
  });
});
