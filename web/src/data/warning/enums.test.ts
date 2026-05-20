import { describe, expect, it } from 'vitest';
import { warningEnums } from './enums';
import { Warning } from './types';

describe('warningEnums', () => {
  it('should have one entry per Warning value', () => {
    const warningValues = Object.values(Warning);
    expect(warningEnums).toHaveLength(warningValues.length);
  });

  it('every entry should have dataKey "warning" and variant "red"', () => {
    warningEnums.forEach((entry) => {
      expect(entry.dataKey).toBe('warning');
      expect(entry.variant).toBe('red');
    });
  });

  it('every entry should have a non-null icon', () => {
    warningEnums.forEach((entry) => {
      expect(entry.icon).toBeTruthy();
    });
  });
});
