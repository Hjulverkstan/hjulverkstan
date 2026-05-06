import { renderHook } from '@testing-library/react';
import { initVehicle, useVehicleZ } from './form';
import { useParams } from 'react-router-dom';
import { useVehiclesQ } from '@data/vehicle/queries';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StrollerType, VehicleType } from './types';

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}));

vi.mock('@data/vehicle/queries', () => ({
  useVehiclesQ: vi.fn(),
}));

describe('vehicle form utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useParams as any).mockReturnValue({ id: '123' });
    (useVehiclesQ as any).mockReturnValue({ data: [] });
  });

  describe('initVehicle', () => {
    it('should initialize with default values', () => {
      const result = initVehicle('10');
      expect(result.vehicleType).toBe(VehicleType.BIKE);
      expect(result.locationId).toBe('10');
      expect(result.isCustomerOwned).toBe(true);
    });

    it('should handle missing locationId', () => {
      const result = initVehicle();
      expect(result.locationId).toBeUndefined();
    });

    it('should initialize with empty ticketIds array', () => {
      expect(initVehicle().ticketIds).toEqual([]);
    });
  });

  describe('useVehicleZ', () => {
    it('should validate a valid customer-owned bike', () => {
      const { result } = renderHook(() => useVehicleZ());
      const schema = result.current;

      const validBike = {
        vehicleType: VehicleType.BIKE,
        locationId: '1',
        isCustomerOwned: true,
        regTag: 'TEST-1',
      };

      expect(schema.safeParse(validBike).success).toBe(true);
    });

    it('should require bike-specific fields if NOT customer-owned', () => {
      const { result } = renderHook(() => useVehicleZ());
      const schema = result.current;

      const invalidOrgBike = {
        vehicleType: VehicleType.BIKE,
        locationId: '1',
        isCustomerOwned: false,
        // Missing bikeType, size, brakeType, gearCount, regTag
      };

      const parseResult = schema.safeParse(invalidOrgBike);
      expect(parseResult.success).toBe(false);
      if (!parseResult.success) {
        const paths = parseResult.error.issues.map((i) => i.path[0]);
        expect(paths).toContain('regTag');
        expect(paths).toContain('bikeType');
        expect(paths).toContain('size');
        expect(paths).toContain('brakeType');
        expect(paths).toContain('gearCount');
      }
    });

    it('should validate a valid batch', () => {
      const { result } = renderHook(() => useVehicleZ());
      const schema = result.current;

      const validBatch = {
        vehicleType: VehicleType.BATCH,
        locationId: '1',
        batchCount: 5,
      };

      expect(schema.safeParse(validBatch).success).toBe(true);
    });

    it('should reject duplicate regTags', () => {
      (useVehiclesQ as any).mockReturnValue({
        data: [{ id: '456', regTag: 'DUPE' }],
      });
      (useParams as any).mockReturnValue({ id: '123' });

      const { result } = renderHook(() => useVehicleZ());
      const schema = result.current;

      const dupeBike = {
        vehicleType: VehicleType.BIKE,
        locationId: '1',
        isCustomerOwned: true,
        regTag: 'DUPE',
      };

      const parseResult = schema.safeParse(dupeBike);
      expect(parseResult.success).toBe(false);
      if (!parseResult.success) {
        expect(
          parseResult.error.issues.some(
            (i) => i.message === 'This Reg Tag is already in use.',
          ),
        ).toBe(true);
      }
    });

    it('should allow the same regTag if editing the same vehicle', () => {
      (useVehiclesQ as any).mockReturnValue({
        data: [{ id: '123', regTag: 'MY-TAG' }],
      });
      (useParams as any).mockReturnValue({ id: '123' });

      const { result } = renderHook(() => useVehicleZ());
      const schema = result.current;

      const sameBike = {
        vehicleType: VehicleType.BIKE,
        locationId: '1',
        isCustomerOwned: true,
        regTag: 'MY-TAG',
      };

      expect(schema.safeParse(sameBike).success).toBe(true);
    });

    it('should handle undefined data from useVehiclesQ without throwing', () => {
      (useVehiclesQ as any).mockReturnValue({ data: undefined });
      const { result } = renderHook(() => useVehicleZ());
      expect(result.current).toBeTruthy();
    });

    it('regTag duplicate check is case-insensitive', () => {
      (useVehiclesQ as any).mockReturnValue({
        data: [{ id: '456', regTag: 'DUPE' }],
      });
      (useParams as any).mockReturnValue({ id: '123' });
      const { result } = renderHook(() => useVehicleZ());
      const parseResult = result.current.safeParse({
        vehicleType: VehicleType.BIKE,
        locationId: '1',
        isCustomerOwned: true,
        regTag: 'dupe',
      });
      expect(parseResult.success).toBe(false);
    });

    it('gearCount below minimum should fail with correct message', () => {
      const { result } = renderHook(() => useVehicleZ());
      const parseResult = result.current.safeParse({
        vehicleType: VehicleType.BIKE,
        locationId: '1',
        isCustomerOwned: true,
        gearCount: 0,
      });
      expect(parseResult.success).toBe(false);
      if (!parseResult.success) {
        expect(
          parseResult.error.issues.some(
            (i) =>
              i.message === 'Minimum gear count is 1 (if no gears choose 1)',
          ),
        ).toBe(true);
      }
    });

    it('gearCount above maximum should fail with correct message', () => {
      const { result } = renderHook(() => useVehicleZ());
      const parseResult = result.current.safeParse({
        vehicleType: VehicleType.BIKE,
        locationId: '1',
        isCustomerOwned: true,
        gearCount: 34,
      });
      expect(parseResult.success).toBe(false);
      if (!parseResult.success) {
        expect(
          parseResult.error.issues.some(
            (i) => i.message === 'Maximum gear count is 33',
          ),
        ).toBe(true);
      }
    });

    it('gearCount at boundary values (1 and 33) should pass', () => {
      const { result } = renderHook(() => useVehicleZ());
      const schema = result.current;
      expect(
        schema.safeParse({
          vehicleType: VehicleType.BIKE,
          locationId: '1',
          isCustomerOwned: true,
          gearCount: 1,
        }).success,
      ).toBe(true);
      expect(
        schema.safeParse({
          vehicleType: VehicleType.BIKE,
          locationId: '1',
          isCustomerOwned: true,
          gearCount: 33,
        }).success,
      ).toBe(true);
    });

    it('should require strollerType for STROLLER', () => {
      const { result } = renderHook(() => useVehicleZ());
      const parseResult = result.current.safeParse({
        vehicleType: VehicleType.STROLLER,
        locationId: '1',
        isCustomerOwned: true,
      });
      expect(parseResult.success).toBe(false);
    });

    it('should validate a valid STROLLER with strollerType', () => {
      const { result } = renderHook(() => useVehicleZ());
      expect(
        result.current.safeParse({
          vehicleType: VehicleType.STROLLER,
          locationId: '1',
          isCustomerOwned: true,
          strollerType: StrollerType.SINGLE,
        }).success,
      ).toBe(true);
    });

    it('should have exact error messages for org bike missing all fields', () => {
      const { result } = renderHook(() => useVehicleZ());
      const parseResult = result.current.safeParse({
        vehicleType: VehicleType.BIKE,
        locationId: '1',
        isCustomerOwned: false,
      });
      expect(parseResult.success).toBe(false);
      if (!parseResult.success) {
        const issues = parseResult.error.issues;
        expect(issues.find((i) => i.path[0] === 'regTag')?.message).toBe(
          'Reg Tag is required',
        );
        expect(issues.find((i) => i.path[0] === 'bikeType')?.message).toBe(
          'Bike Type is required',
        );
        expect(issues.find((i) => i.path[0] === 'size')?.message).toBe(
          'Size is required',
        );
        expect(issues.find((i) => i.path[0] === 'brakeType')?.message).toBe(
          'Brake Type is required',
        );
        expect(issues.find((i) => i.path[0] === 'gearCount')?.message).toBe(
          'Gear Count is required',
        );
      }
    });

    it('org SCOOTER should only require regTag, not bike-specific fields', () => {
      const { result } = renderHook(() => useVehicleZ());
      const parseResult = result.current.safeParse({
        vehicleType: VehicleType.SCOOTER,
        locationId: '1',
        isCustomerOwned: false,
      });
      expect(parseResult.success).toBe(false);
      if (!parseResult.success) {
        const paths = parseResult.error.issues.map((i) => i.path[0]);
        expect(paths).toContain('regTag');
        expect(paths).not.toContain('bikeType');
        expect(paths).not.toContain('size');
        expect(paths).not.toContain('brakeType');
      }
    });

    it('BATCH should skip isCustomerOwned superRefine validation', () => {
      const { result } = renderHook(() => useVehicleZ());
      expect(
        result.current.safeParse({
          vehicleType: VehicleType.BATCH,
          locationId: '1',
          batchCount: 3,
        }).success,
      ).toBe(true);
    });
  });
});
