import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLocation } from 'react-router-dom';

import usePortalSlugs from '@hooks/useSlugs';

vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(),
}));

const mockPathname = (pathname: string) =>
  vi
    .mocked(useLocation)
    .mockReturnValue({ pathname } as ReturnType<typeof useLocation>);

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── usePortalSlugs ───────────────────────────────────────────────────────────

describe('usePortalSlugs', () => {
  describe('Happy Path — with lang prefix', () => {
    it('extracts url, baseUrl, appSlug and pageSlug from a 4-segment lang-prefixed path', () => {
      // Arrange
      mockPathname('/sv/portal/shop/tickets');

      // Act
      const { result } = renderHook(() => usePortalSlugs());

      // Assert
      expect(result.current.url).toBe('/sv/portal/shop/tickets');
      expect(result.current.baseUrl).toBe('/sv/portal');
      expect(result.current.appSlug).toBe('/shop');
      expect(result.current.pageSlug).toBe('/tickets');
    });

    it('tailSlug is undefined when the path has exactly 4 segments', () => {
      // Arrange
      mockPathname('/sv/portal/shop/tickets');

      // Act
      const { result } = renderHook(() => usePortalSlugs());

      // Assert
      expect(result.current.tailSlug).toBeUndefined();
    });
  });

  describe('Happy Path — without lang prefix', () => {
    it('extracts baseUrl, appSlug and pageSlug when there is no lang prefix', () => {
      // Arrange
      mockPathname('/portal/shop/tickets');

      // Act
      const { result } = renderHook(() => usePortalSlugs());

      // Assert
      expect(result.current.baseUrl).toBe('/portal');
      expect(result.current.appSlug).toBe('/shop');
      expect(result.current.pageSlug).toBe('/tickets');
    });

    it('baseUrl contains no lang segment when lang prefix is absent', () => {
      // Arrange
      mockPathname('/portal/admin/users');

      // Act
      const { result } = renderHook(() => usePortalSlugs());

      // Assert
      expect(result.current.baseUrl).toBe('/portal');
    });
  });

  describe('tailSlug', () => {
    it('captures a single trailing segment as tailSlug with a leading slash', () => {
      // Arrange
      mockPathname('/sv/portal/shop/tickets/42');

      // Act
      const { result } = renderHook(() => usePortalSlugs());

      // Assert
      expect(result.current.tailSlug).toBe('/42');
    });

    it('captures a multi-segment tail entirely within tailSlug', () => {
      // Arrange
      mockPathname('/sv/portal/shop/tickets/42/edit');

      // Act
      const { result } = renderHook(() => usePortalSlugs());

      // Assert
      expect(result.current.tailSlug).toBe('/42/edit');
    });
  });

  describe('Return value integrity', () => {
    it('coreUrl equals baseUrl + appSlug', () => {
      // Arrange
      mockPathname('/en/portal/admin/users');

      // Act
      const { result } = renderHook(() => usePortalSlugs());

      // Assert
      expect(result.current.coreUrl).toBe('/en/portal/admin');
    });

    it('url is the raw location.pathname with no modification', () => {
      // Arrange
      const pathname = '/sv/portal/web-edit/articles';
      mockPathname(pathname);

      // Act
      const { result } = renderHook(() => usePortalSlugs());

      // Assert
      expect(result.current.url).toBe(pathname);
    });
  });

  describe('All Lang values accepted', () => {
    it('correctly parses a non-sv lang code (ar) as the lang prefix', () => {
      // Arrange
      mockPathname('/ar/portal/shop/tickets');

      // Act
      const { result } = renderHook(() => usePortalSlugs());

      // Assert
      expect(result.current.baseUrl).toBe('/ar/portal');
      expect(result.current.appSlug).toBe('/shop');
    });
  });

  describe('Non-Lang first segment', () => {
    it('treats a non-Lang first segment as baseUrl rather than a lang prefix', () => {
      // Arrange — "de" is not a valid Lang value
      mockPathname('/de/portal/shop/tickets');

      // Act
      const { result } = renderHook(() => usePortalSlugs());

      // Assert
      expect(result.current.baseUrl).toBe('/de');
      expect(result.current.appSlug).toBe('/portal');
    });
  });

  describe('Error', () => {
    it('throws the expected message when pathname is root /', () => {
      // Arrange
      mockPathname('/');
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Act & Assert
      expect(() => renderHook(() => usePortalSlugs())).toThrow(
        'useSlugs failed to match the location pathname',
      );

      consoleError.mockRestore();
    });

    it('throws when pathname has only one segment and cannot match the required groups', () => {
      // Arrange
      mockPathname('/only');
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Act & Assert
      expect(() => renderHook(() => usePortalSlugs())).toThrow(
        'useSlugs failed to match the location pathname',
      );

      consoleError.mockRestore();
    });
  });
});
