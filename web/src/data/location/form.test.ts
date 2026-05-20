import { describe, expect, it } from 'vitest';
import { initLocation, locationZ } from './form';
import { LocationType } from './types';

describe('location form utilities', () => {
  describe('initLocation', () => {
    it('should initialize with an empty vehicleIds array', () => {
      expect(initLocation.vehicleIds).toEqual([]);
    });
  });

  describe('locationZ', () => {
    it('should validate a valid SHOP location', () => {
      const valid = {
        locationType: LocationType.SHOP,
        name: 'Main Street Shop',
        address: '1 Main St',
      };
      expect(locationZ.safeParse(valid).success).toBe(true);
    });

    it('should validate a valid STORAGE location', () => {
      const valid = {
        locationType: LocationType.STORAGE,
        name: 'North Warehouse',
        address: '5 Industrial Rd',
      };
      expect(locationZ.safeParse(valid).success).toBe(true);
    });

    it('should fail when name is missing', () => {
      const invalid = {
        locationType: LocationType.SHOP,
        address: '1 Main St',
      };
      expect(locationZ.safeParse(invalid).success).toBe(false);
    });

    it('should fail when address is missing', () => {
      const invalid = {
        locationType: LocationType.SHOP,
        name: 'A Shop',
      };
      expect(locationZ.safeParse(invalid).success).toBe(false);
    });
  });
});
