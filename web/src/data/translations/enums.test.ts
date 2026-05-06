import { describe, expect, it } from 'vitest';
import { lang, langCodes } from './enums';
import { Lang } from '@data/webedit/types';

describe('translations enums', () => {
  describe('lang', () => {
    it('should have one entry per Lang value', () => {
      const langValues = Object.values(Lang);
      expect(lang).toHaveLength(langValues.length);
    });

    it('every entry should have dataKey "lang" and a non-empty translationKey', () => {
      lang.forEach((entry) => {
        expect(entry.dataKey).toBe('lang');
        expect(entry.translationKey).toBeTruthy();
      });
    });
  });

  describe('langCodes', () => {
    it('should have one entry per Lang value', () => {
      expect(langCodes).toHaveLength(Object.values(Lang).length);
    });

    it('should have correct short labels for each lang', () => {
      const labelMap = Object.fromEntries(
        langCodes.map((e) => [e.value, e.label]),
      );
      expect(labelMap[Lang.SV]).toBe('SV');
      expect(labelMap[Lang.EN]).toBe('EN');
      expect(labelMap[Lang.AR]).toBe('AR');
      expect(labelMap[Lang.FA]).toBe('FA');
      expect(labelMap[Lang.SO]).toBe('SO');
      expect(labelMap[Lang.BS]).toBe('BS');
      expect(labelMap[Lang.TR]).toBe('TR');
    });
  });
});
