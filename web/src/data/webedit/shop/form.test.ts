import { describe, expect, it } from 'vitest';
import { createShopZ, initShop } from './form';

describe('shop form utilities', () => {
  describe('initShop', () => {
    it('should initialize with hasTemporaryHours true and empty openHours', () => {
      expect(initShop.hasTemporaryHours).toBe(true);
      expect(initShop.openHours).toEqual({});
    });
  });

  describe('createShopZ', () => {
    const schema = createShopZ();

    it('should validate when hasTemporaryHours is true without openHours', () => {
      const valid = {
        locationId: 1,
        latitude: 59.3,
        longitude: 18.0,
        hasTemporaryHours: true,
      };
      expect(schema.safeParse(valid).success).toBe(true);
    });

    it('should validate when hasTemporaryHours is false and openHours has content', () => {
      const valid = {
        locationId: 1,
        latitude: 59.3,
        longitude: 18.0,
        hasTemporaryHours: false,
        openHours: { mon: '8:00-17:00' },
      };
      expect(schema.safeParse(valid).success).toBe(true);
    });

    it('should fail when hasTemporaryHours is false and openHours is empty', () => {
      const invalid = {
        locationId: 1,
        latitude: 59.3,
        longitude: 18.0,
        hasTemporaryHours: false,
        openHours: {},
      };
      const result = schema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some(
            (i) =>
              i.message ===
              'You must provide opening hours or enable Temporary Hours.',
          ),
        ).toBe(true);
      }
    });

    it('should fail when time format is invalid', () => {
      const invalid = {
        locationId: 1,
        latitude: 59.3,
        longitude: 18.0,
        hasTemporaryHours: false,
        openHours: { mon: 'invalid' },
      };
      const result = schema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some(
            (i) => i.message === 'Format must be H:MM (e.g. 8:00 or 17:00)',
          ),
        ).toBe(true);
      }
    });
  });
});
