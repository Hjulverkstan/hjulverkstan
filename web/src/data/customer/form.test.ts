import { describe, expect, it } from 'vitest';
import { customerZ, initCustomer } from './form';
import { CustomerType } from './types';

describe('customer form utilities', () => {
  describe('initCustomer', () => {
    it('should default to CustomerType.PERSON', () => {
      expect(initCustomer.customerType).toBe(CustomerType.PERSON);
    });
  });

  describe('customerZ', () => {
    it('should validate a valid PERSON customer', () => {
      const valid = {
        customerType: CustomerType.PERSON,
        firstName: 'John',
        phoneNumber: '+46701234567',
      };
      expect(customerZ.safeParse(valid).success).toBe(true);
    });

    it('should validate a valid ORG customer', () => {
      const valid = {
        customerType: CustomerType.ORG,
        firstName: 'Contact',
        phoneNumber: '+46701234567',
        organizationName: 'Acme AB',
      };
      expect(customerZ.safeParse(valid).success).toBe(true);
    });

    it('should fail for ORG missing organizationName', () => {
      const invalid = {
        customerType: CustomerType.ORG,
        firstName: 'Contact',
        phoneNumber: '+46701234567',
      };
      expect(customerZ.safeParse(invalid).success).toBe(false);
    });

    it('should fail for non-empty invalid email', () => {
      const invalid = {
        customerType: CustomerType.PERSON,
        firstName: 'John',
        phoneNumber: '+46701234567',
        email: 'not-an-email',
      };
      const result = customerZ.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((i) => i.message === 'Email is not valid'),
        ).toBe(true);
      }
    });

    it('should fail for invalid phone number format', () => {
      const invalid = {
        customerType: CustomerType.PERSON,
        firstName: 'John',
        phoneNumber: '0701234567',
      };
      expect(customerZ.safeParse(invalid).success).toBe(false);
    });

    it('should fail for an invalid Swedish PIN', () => {
      const invalid = {
        customerType: CustomerType.PERSON,
        firstName: 'John',
        phoneNumber: '+46701234567',
        personalIdentityNumber: '19900101-0000',
      };
      expect(customerZ.safeParse(invalid).success).toBe(false);
    });

    it('should pass for a valid Swedish PIN', () => {
      const valid = {
        customerType: CustomerType.PERSON,
        firstName: 'John',
        phoneNumber: '+46701234567',
        personalIdentityNumber: '19811228-9874',
      };
      expect(customerZ.safeParse(valid).success).toBe(true);
    });
  });
});
