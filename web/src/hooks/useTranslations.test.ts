import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useTranslations } from '@hooks/useTranslations';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@hooks/usePreloadedData', () => ({
  usePreloadedDataLocalized: vi.fn(),
}));

vi.mock('@data/translations', () => ({
  langTranslationsMap: {
    sv: { greeting: 'Hej', welcome: 'Välkommen {name}' },
    en: { greeting: 'Hello', welcome: 'Welcome {name}' },
  },
}));

vi.mock('@root', () => ({
  fallbackLang: 'sv',
}));

beforeEach(() => {
  vi.mocked(usePreloadedDataLocalized).mockReturnValue({
    currLang: 'sv',
    data: undefined,
    langs: ['sv', 'en'],
  });
});

// ─── useTranslations ──────────────────────────────────────────────────────────

describe('useTranslations', () => {
  describe('Happy path', () => {
    it('returns the translated string for a key that exists in the current language', () => {
      // Arrange — currLang is 'sv' (set in beforeEach)
      // Act
      const { result } = renderHook(() => useTranslations());

      // Assert
      expect(result.current.t('greeting' as any)).toBe('Hej');
    });

    it('returns the translated string for a different language', () => {
      // Arrange
      vi.mocked(usePreloadedDataLocalized).mockReturnValue({
        currLang: 'en',
        data: undefined,
        langs: ['sv', 'en'],
      });

      // Act
      const { result } = renderHook(() => useTranslations());

      // Assert
      expect(result.current.t('greeting' as any)).toBe('Hello');
    });

    it('recomputes translations when currLang changes between renders', () => {
      // Arrange — start in Swedish
      const { result, rerender } = renderHook(() => useTranslations());
      expect(result.current.t('greeting' as any)).toBe('Hej');

      // Act — simulate a language switch
      vi.mocked(usePreloadedDataLocalized).mockReturnValue({
        currLang: 'en',
        data: undefined,
        langs: ['sv', 'en'],
      });
      rerender();

      // Assert — hook must pick up the new language
      expect(result.current.t('greeting' as any)).toBe('Hello');
    });

    it('interpolates ICU placeholders when values are provided', () => {
      // Arrange — currLang is 'sv', template is "Välkommen {name}"

      // Act
      const { result } = renderHook(() => useTranslations());

      // Assert
      expect(result.current.t('welcome' as any, { name: 'Jessica' })).toBe(
        'Välkommen Jessica',
      );
    });
  });

  describe('Fallback / missing key', () => {
    it('returns the key itself when the key is not in the translation dictionary', () => {
      // Act
      const { result } = renderHook(() => useTranslations());

      // Assert
      expect(result.current.t('nonexistent.key' as any)).toBe(
        'nonexistent.key',
      );
    });

    it('returns "noTranslationKeyFound" when key is undefined', () => {
      // Act
      const { result } = renderHook(() => useTranslations());

      // Assert
      expect(result.current.t(undefined)).toBe('noTranslationKeyFound');
    });
  });

  describe('Language fallback', () => {
    it('returns the key itself when currLang is not in langTranslationsMap', () => {
      // Arrange — 'ar' is absent from the mock map; the ?? branch resolves to fallbackLang
      // which is the string 'sv', not the sv translation object, so all key lookups
      // return undefined and t falls back to returning the key
      vi.mocked(usePreloadedDataLocalized).mockReturnValue({
        currLang: 'ar',
        data: undefined,
        langs: ['sv', 'en', 'ar'],
      });

      // Act
      const { result } = renderHook(() => useTranslations());

      // Assert
      expect(result.current.t('greeting' as any)).toBe('greeting');
    });
  });
});
