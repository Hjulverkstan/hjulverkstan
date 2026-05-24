import React from 'react';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  PreloadedDataProvider,
  usePreloadedData,
  usePreloadedDataLocalized,
} from '@hooks/usePreloadedData';
import { LangProvider } from '@hooks/useCurrentLang';
import { LangAllEntitiesMap } from '@data/webedit/types';

// ─── Test data ────────────────────────────────────────────────────────────────

const makeData = (): LangAllEntitiesMap => ({
  sv: { text: {} as any, shops: [], stories: [] },
  en: { text: {} as any, shops: [], stories: [] },
});

// ─── Wrappers ─────────────────────────────────────────────────────────────────

const withPreloaded =
  (data: LangAllEntitiesMap) =>
  ({ children }: { children: React.ReactNode }) => (
    <PreloadedDataProvider value={data}>{children}</PreloadedDataProvider>
  );

const withPreloadedAndLang =
  (data: LangAllEntitiesMap, lang: string) =>
  ({ children }: { children: React.ReactNode }) => (
    <PreloadedDataProvider value={data}>
      <LangProvider value={lang}>{children}</LangProvider>
    </PreloadedDataProvider>
  );

// ─── usePreloadedData ─────────────────────────────────────────────────────────

describe('usePreloadedData', () => {
  describe('Happy path', () => {
    it('returns data equal to the value provided to PreloadedDataProvider', () => {
      // Arrange
      const data = makeData();

      // Act
      const { result } = renderHook(() => usePreloadedData(), {
        wrapper: withPreloaded(data),
      });

      // Assert
      expect(result.current.data).toBe(data);
    });

    it('returns langs as the keys of the provided map', () => {
      // Arrange
      const data = makeData();

      // Act
      const { result } = renderHook(() => usePreloadedData(), {
        wrapper: withPreloaded(data),
      });

      // Assert
      expect(result.current.langs).toEqual(
        expect.arrayContaining(['sv', 'en']),
      );
      expect(result.current.langs).toHaveLength(2);
    });

    it('returns langs as an empty array when the map is empty', () => {
      // Arrange
      const data: LangAllEntitiesMap = {};

      // Act
      const { result } = renderHook(() => usePreloadedData(), {
        wrapper: withPreloaded(data),
      });

      // Assert
      expect(result.current.langs).toEqual([]);
    });
  });

  describe('Error handling', () => {
    it('throws "PreloadedDataContext was called outside of its provider" when used with no provider', () => {
      // Arrange
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Act & Assert
      expect(() => renderHook(() => usePreloadedData())).toThrow(
        'PreloadedDataContext was called outside of its provider',
      );

      consoleSpy.mockRestore();
    });
  });
});

// ─── usePreloadedDataLocalized ────────────────────────────────────────────────

describe('usePreloadedDataLocalized', () => {
  describe('Happy path', () => {
    it('returns data for the current language key', () => {
      // Arrange
      const data = makeData();

      // Act
      const { result } = renderHook(() => usePreloadedDataLocalized(), {
        wrapper: withPreloadedAndLang(data, 'sv'),
      });

      // Assert
      expect(result.current.data).toBe(data.sv);
    });

    it('returns currLang matching the value provided to LangProvider', () => {
      // Arrange
      const data = makeData();

      // Act
      const { result } = renderHook(() => usePreloadedDataLocalized(), {
        wrapper: withPreloadedAndLang(data, 'en'),
      });

      // Assert
      expect(result.current.currLang).toBe('en');
    });

    it('returns langs as the keys of the map', () => {
      // Arrange
      const data = makeData();

      // Act
      const { result } = renderHook(() => usePreloadedDataLocalized(), {
        wrapper: withPreloadedAndLang(data, 'sv'),
      });

      // Assert
      expect(result.current.langs).toEqual(
        expect.arrayContaining(['sv', 'en']),
      );
      expect(result.current.langs).toHaveLength(2);
    });

    it('returns data as undefined when currLang is not a key in the map', () => {
      // Arrange
      const data = makeData(); // only has 'sv' and 'en'

      // Act
      const { result } = renderHook(() => usePreloadedDataLocalized(), {
        wrapper: withPreloadedAndLang(data, 'ar'),
      });

      // Assert
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('Error handling', () => {
    it('throws "PreloadedDataContext was called outside of its provider" when used with no PreloadedDataProvider', () => {
      // Arrange — LangProvider present, PreloadedDataProvider absent
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <LangProvider value="sv">{children}</LangProvider>
      );

      // Act & Assert
      expect(() =>
        renderHook(() => usePreloadedDataLocalized(), { wrapper }),
      ).toThrow('PreloadedDataContext was called outside of its provider');

      consoleSpy.mockRestore();
    });

    it('throws "LocaleContext was called outside of its provider" when used with no LangProvider', () => {
      // Arrange — PreloadedDataProvider present, LangProvider absent
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const data = makeData();

      // Act & Assert
      expect(() =>
        renderHook(() => usePreloadedDataLocalized(), {
          wrapper: withPreloaded(data),
        }),
      ).toThrow('LocaleContext was called outside of its provider');

      consoleSpy.mockRestore();
    });
  });
});
