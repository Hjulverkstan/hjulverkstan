import { describe, expect, it, vi } from 'vitest';

import {
  findEnum,
  findEnumSafe,
  failedEnum,
  matchEnumsOnRow,
  matchEnumsBy,
} from '@utils/enums';

// ─── Test data ────────────────────────────────────────────────────────────────

const makeEnums = () => [
  { value: 'ACTIVE', dataKey: 'status', label: 'Active' },
  { value: 'INACTIVE', dataKey: 'status', label: 'Inactive' },
  { value: 'PENDING', dataKey: 'status', label: 'Pending' },
];

// ─── findEnum ─────────────────────────────────────────────────────────────────

describe('findEnum', () => {
  it('finds and returns the matching entry from an array', () => {
    // Arrange
    const enums = makeEnums();

    // Act
    const result = findEnum(enums, 'ACTIVE');

    // Assert
    expect(result).toBe(enums[0]);
  });

  it('finds and returns the matching entry from a map by flattening all lists', () => {
    // Arrange
    const map = { statuses: makeEnums() };

    // Act
    const result = findEnum(map, 'PENDING');

    // Assert
    expect(result.label).toBe('Pending');
  });

  it('throws an error containing the unmatched value and all available values', () => {
    expect(() => findEnum(makeEnums(), 'UNKNOWN')).toThrow(
      /\[UNKNOWN\].*\[ACTIVE,INACTIVE,PENDING\]/,
    );
  });
});

// ─── findEnumSafe ─────────────────────────────────────────────────────────────

describe('findEnumSafe', () => {
  it('returns the matched entry when the value exists', () => {
    // Arrange
    const enums = makeEnums();

    // Act
    const result = findEnumSafe(enums, 'INACTIVE');

    // Assert
    expect(result.label).toBe('Inactive');
  });

  it('returns failedEnum and logs to console.error when the value is missing', () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Act
    const result = findEnumSafe(makeEnums(), 'UNKNOWN');

    // Assert
    expect(result).toEqual(failedEnum);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('findSafeEnum'),
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });
});

// ─── matchEnumsOnRow ──────────────────────────────────────────────────────────

describe('matchEnumsOnRow', () => {
  it('returns true when a scalar row field matches an enum value and the label starts with word', () => {
    // Arrange
    const enums = makeEnums();
    const row = { status: 'ACTIVE' };

    // Act & Assert
    expect(matchEnumsOnRow(enums, 'act', row)).toBe(true);
  });

  it('returns true when an array row field contains the enum value and the label starts with word', () => {
    // Arrange
    const enums = makeEnums();
    const row = { status: ['ACTIVE', 'PENDING'] };

    // Act & Assert
    expect(matchEnumsOnRow(enums, 'pen', row)).toBe(true);
  });

  it('returns false when no enum label starts with word', () => {
    // Arrange
    const enums = makeEnums();
    const row = { status: 'ACTIVE' };

    // Act & Assert
    expect(matchEnumsOnRow(enums, 'xyz', row)).toBe(false);
  });

  it('returns false when the label matches but the enum value does not match the row field', () => {
    // Arrange — 'Inactive' starts with 'inac' but INACTIVE !== ACTIVE
    const enums = makeEnums();
    const row = { status: 'ACTIVE' };

    // Act & Assert
    expect(matchEnumsOnRow(enums, 'inac', row)).toBe(false);
  });

  it('accepts a map as input and flattens it', () => {
    // Arrange
    const map = { statuses: makeEnums() };
    const row = { status: 'INACTIVE' };

    // Act & Assert
    expect(matchEnumsOnRow(map, 'inac', row)).toBe(true);
  });
});

// ─── matchEnumsBy ─────────────────────────────────────────────────────────────

describe('matchEnumsBy', () => {
  it('throws when neither includes nor startsWith is provided', () => {
    expect(() => matchEnumsBy({ enums: makeEnums() })).toThrow(
      'enumsMatchWord is missing prop includes or startsWith',
    );
  });

  it('returns true when an enum label starts with startsWith (case-insensitive)', () => {
    expect(matchEnumsBy({ enums: makeEnums(), startsWith: 'Act' })).toBe(true);
  });

  it('returns false when no enum label starts with startsWith', () => {
    expect(matchEnumsBy({ enums: makeEnums(), startsWith: 'xyz' })).toBe(false);
  });

  it('returns true when an enum label contains includes (case-insensitive)', () => {
    expect(matchEnumsBy({ enums: makeEnums(), includes: 'NACTIV' })).toBe(true);
  });

  it('returns false when no enum label contains includes', () => {
    expect(matchEnumsBy({ enums: makeEnums(), includes: 'xyz' })).toBe(false);
  });

  it('filters by isOf — only matches enums whose value is in the isOf list', () => {
    // Arrange — 'Active' starts with 'act' but we restrict to INACTIVE only
    expect(
      matchEnumsBy({
        enums: makeEnums(),
        startsWith: 'act',
        isOf: ['INACTIVE'],
      }),
    ).toBe(false);
  });

  it('accepts isOf as a single string', () => {
    expect(
      matchEnumsBy({ enums: makeEnums(), startsWith: 'act', isOf: 'ACTIVE' }),
    ).toBe(true);
  });

  it('returns false when enums is undefined', () => {
    expect(matchEnumsBy({ enums: undefined, startsWith: 'act' })).toBe(false);
  });
});
