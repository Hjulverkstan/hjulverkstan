import { describe, expect, it } from 'vitest';
import { langTranslationsMap } from './index';

describe('langTranslationsMap', () => {
  it('should have sv and en keys', () => {
    expect(langTranslationsMap).toHaveProperty('sv');
    expect(langTranslationsMap).toHaveProperty('en');
  });

  it('sv and en should share the same translation keys', () => {
    const svKeys = Object.keys(langTranslationsMap.sv).sort();
    const enKeys = Object.keys(langTranslationsMap.en).sort();
    expect(svKeys).toEqual(enKeys);
  });
});
