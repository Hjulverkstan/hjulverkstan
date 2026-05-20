import { describe, expect, it } from 'vitest';
import { employeeZ, initEmployee } from './form';

describe('employee form utilities', () => {
  describe('initEmployee', () => {
    it('should be an empty object', () => {
      expect(initEmployee).toEqual({});
    });
  });

  describe('employeeZ', () => {
    it('should validate a valid employee', () => {
      const valid = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+46701234567',
        email: 'john@example.com',
      };
      expect(employeeZ.safeParse(valid).success).toBe(true);
    });

    it('should fail when firstName is missing', () => {
      const invalid = {
        lastName: 'Doe',
        phoneNumber: '+46701234567',
        email: 'john@example.com',
      };
      expect(employeeZ.safeParse(invalid).success).toBe(false);
    });

    it('should fail for an invalid email', () => {
      const invalid = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+46701234567',
        email: 'not-an-email',
      };
      const result = employeeZ.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some(
            (i) => i.message === 'The email is not a valid email address',
          ),
        ).toBe(true);
      }
    });

    it('should fail for an invalid Swedish PIN when provided', () => {
      const invalid = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+46701234567',
        email: 'john@example.com',
        personalIdentityNumber: '19900101-0000',
      };
      expect(employeeZ.safeParse(invalid).success).toBe(false);
    });

    it('should pass for a valid Swedish PIN when provided', () => {
      const valid = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+46701234567',
        email: 'john@example.com',
        personalIdentityNumber: '19811228-9874',
      };
      expect(employeeZ.safeParse(valid).success).toBe(true);
    });
  });
});
