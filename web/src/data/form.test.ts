import { describe, expect, it } from 'vitest';
import {
  isReq,
  isValidSwedishPIN,
  phoneNumberZ,
  reqString,
  swedishPIN,
  withErrMsg,
} from './form';

describe('form utilities', () => {
  describe('zod helpers', () => {
    it('withErrMsg should return an errorMap', () => {
      const msg = 'Test Error';
      const result = withErrMsg(msg);
      expect(result.errorMap({ message: 'original' } as any)).toEqual({
        message: msg,
      });
    });

    it('isReq should return correct error message', () => {
      const label = 'Name';
      const result = isReq(label);
      expect(result.errorMap({} as any).message).toBe('Name is required.');
    });

    it('reqString should validate required string', () => {
      const schema = reqString('Email');
      expect(schema.safeParse('test@example.com').success).toBe(true);

      const failure = schema.safeParse('');
      expect(failure.success).toBe(false);

      if (!failure.success) {
        expect(failure.error.issues[0].message).toBe('Email is required.');
      }
    });
  });

  describe('isValidSwedishPIN', () => {
    it('should return true for valid 12-digit PINs', () => {
      // Example valid PIN: 19900101-9804 (Hypothetical, but let's check Luhn)
      // YYMMDDXXXX -> 900101980
      // 9*2=18(9), 0, 0, 1, 0, 1, 9*2=18(9), 8, 0
      // 9+0+0+1+0+1+9+8+0 = 28
      // (10 - (28%10))%10 = 2. So 19900101-9802 should be valid.
      expect(isValidSwedishPIN('19900101-9802')).toBe(true);
      expect(isValidSwedishPIN('199001019802')).toBe(true);

      // Real valid PIN example (generated/verified): 19811228-9874
      // 811228987
      // 8*2=16(7), 1, 1*2=2, 2, 2*2=4, 8, 9*2=18(9), 8, 7*2=14(5)
      // 7+1+2+2+4+8+9+8+5 = 46
      // (10 - (46%10))%10 = 4. Valid.
      expect(isValidSwedishPIN('19811228-9874')).toBe(true);
    });

    it('should return false for invalid PINs', () => {
      expect(isValidSwedishPIN('19811228-9875')).toBe(false); // Wrong control digit
      expect(isValidSwedishPIN('811228-9874')).toBe(false); // Wrong length (10 instead of 12)
      expect(isValidSwedishPIN('abc')).toBe(false);
    });
  });

  describe('swedishPIN schema', () => {
    it('should accept valid format and valid checksum', () => {
      expect(swedishPIN.safeParse('19811228-9874').success).toBe(true);
      expect(swedishPIN.safeParse(undefined).success).toBe(true); // Optional
    });

    it('should reject invalid format', () => {
      const failure = swedishPIN.safeParse('198112289874'); // Missing hyphen
      expect(failure.success).toBe(false);
      if (!failure.success) {
        expect(failure.error.issues[0].message).toBe(
          'Personal identification number must be in the format YYYYMMDD-XXXX',
        );
      }
    });

    it('should reject invalid checksum', () => {
      const failure = swedishPIN.safeParse('19811228-9875');
      expect(failure.success).toBe(false);
      if (!failure.success) {
        expect(failure.error.issues[0].message).toBe(
          'Invalid personal identification number',
        );
      }
    });
  });

  describe('phoneNumberZ schema', () => {
    it('should accept valid Swedish phone numbers', () => {
      expect(phoneNumberZ.safeParse('+46701234567').success).toBe(true);
    });

    it('should reject invalid formats', () => {
      expect(phoneNumberZ.safeParse('0701234567').success).toBe(false);
      expect(phoneNumberZ.safeParse('+4670123456').success).toBe(false); // Too short
      expect(phoneNumberZ.safeParse('+467012345678').success).toBe(false); // Too long
      expect(phoneNumberZ.safeParse(undefined).success).toBe(false); // Required
    });
  });
});
