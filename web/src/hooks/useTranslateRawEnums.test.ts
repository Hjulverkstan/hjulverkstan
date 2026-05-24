import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import { useTranslations } from '@hooks/useTranslations';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@hooks/useTranslations', () => ({
  useTranslations: vi.fn(),
}));

const mockT = vi.fn((key: string | undefined) =>
  key !== undefined ? `translated:${key}` : 'noTranslationKeyFound',
);

beforeEach(() => {
  mockT.mockClear();
  vi.mocked(useTranslations).mockReturnValue({ t: mockT as any });
});

// ─── Test data ────────────────────────────────────────────────────────────────

const makeMap = () => ({
  statuses: [
    {
      value: 'ACTIVE',
      dataKey: 'ACTIVE',
      translationKey: 'status.active' as any,
    },
    {
      value: 'INACTIVE',
      dataKey: 'INACTIVE',
      translationKey: 'status.inactive' as any,
    },
  ],
});

// ─── useTranslateRawEnums ─────────────────────────────────────────────────────

describe('useTranslateRawEnums', () => {
  describe('Happy path', () => {
    it('adds a label equal to the translated translationKey for a single-item list', () => {
      // Arrange
      const map = {
        statuses: [
          {
            value: 'ACTIVE',
            dataKey: 'ACTIVE',
            translationKey: 'status.active' as any,
          },
        ],
      };

      // Act
      const { result } = renderHook(() => useTranslateRawEnums(map));

      // Assert
      expect(result.current.statuses[0].label).toBe('translated:status.active');
    });

    it('assigns the correct label to each item in a multi-item list', () => {
      // Arrange
      const map = makeMap();

      // Act
      const { result } = renderHook(() => useTranslateRawEnums(map));

      // Assert
      expect(result.current.statuses[0].label).toBe('translated:status.active');
      expect(result.current.statuses[1].label).toBe(
        'translated:status.inactive',
      );
    });

    it('translates every key independently in a multi-key map', () => {
      // Arrange
      const map = {
        statuses: [
          { value: 'A', dataKey: 'A', translationKey: 'key.a' as any },
        ],
        roles: [
          {
            value: 'ADMIN',
            dataKey: 'ADMIN',
            translationKey: 'key.admin' as any,
          },
        ],
      };

      // Act
      const { result } = renderHook(() => useTranslateRawEnums(map));

      // Assert
      expect(result.current.statuses[0].label).toBe('translated:key.a');
      expect(result.current.roles[0].label).toBe('translated:key.admin');
    });

    it('preserves all original properties alongside the added label', () => {
      // Arrange
      const icon = () => null;
      const map = {
        statuses: [
          {
            value: 'ACTIVE',
            dataKey: 'ACTIVE',
            translationKey: 'status.active' as any,
            icon,
            variant: 'green' as any,
            count: 5,
          },
        ],
      };

      // Act
      const { result } = renderHook(() => useTranslateRawEnums(map));

      // Assert
      const item = result.current.statuses[0];
      expect(item.value).toBe('ACTIVE');
      expect(item.dataKey).toBe('ACTIVE');
      expect(item.icon).toBe(icon);
      expect(item.variant).toBe('green');
      expect(item.count).toBe(5);
      expect(item.label).toBe('translated:status.active');
    });
  });

  describe('Boundary / edge cases', () => {
    it('sets label to "noTranslationKeyFound" when translationKey is undefined', () => {
      // Arrange
      const map = {
        statuses: [{ value: 'X', dataKey: 'X', translationKey: undefined }],
      };

      // Act
      const { result } = renderHook(() => useTranslateRawEnums(map));

      // Assert
      expect(result.current.statuses[0].label).toBe('noTranslationKeyFound');
    });

    it('returns an empty object when given an empty map', () => {
      // Arrange
      const map = {};

      // Act
      const { result } = renderHook(() => useTranslateRawEnums(map));

      // Assert
      expect(result.current).toEqual({});
    });

    it('returns an empty array for a key whose value is an empty array', () => {
      // Arrange
      const map = { statuses: [] };

      // Act
      const { result } = renderHook(() => useTranslateRawEnums(map));

      // Assert
      expect(result.current.statuses).toEqual([]);
    });
  });

  describe('Input changes', () => {
    it('updates the label when the translationKey changes between renders', () => {
      // Arrange
      let map = {
        statuses: [
          { value: 'A', dataKey: 'A', translationKey: 'first.key' as any },
        ],
      };
      const { result, rerender } = renderHook(() => useTranslateRawEnums(map));
      expect(result.current.statuses[0].label).toBe('translated:first.key');

      // Act — swap to a map with a different translationKey
      act(() => {
        map = {
          statuses: [
            { value: 'A', dataKey: 'A', translationKey: 'second.key' as any },
          ],
        };
        rerender();
      });

      // Assert
      expect(result.current.statuses[0].label).toBe('translated:second.key');
    });

    it('re-translates labels when the t function changes (language switch)', () => {
      // Arrange — initial t prefixes with "translated:"
      const map = makeMap();
      const { result, rerender } = renderHook(() => useTranslateRawEnums(map));
      expect(result.current.statuses[0].label).toBe('translated:status.active');

      // Act — swap to a t that prefixes with "sv:"
      act(() => {
        vi.mocked(useTranslations).mockReturnValue({
          t: vi.fn((key: string | undefined) =>
            key !== undefined ? `sv:${key}` : 'noTranslationKeyFound',
          ) as any,
        });
        rerender();
      });

      // Assert
      expect(result.current.statuses[0].label).toBe('sv:status.active');
    });
  });
});
