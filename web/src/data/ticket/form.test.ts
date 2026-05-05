import { describe, expect, it } from 'vitest';
import { initTicket, ticketZ } from './form';
import { TicketType } from './types';

describe('ticket form utilities', () => {
  describe('initTicket', () => {
    it('should default to REPAIR type with empty vehicleIds and no locationId', () => {
      const result = initTicket();
      expect(result.ticketType).toBe(TicketType.REPAIR);
      expect(result.vehicleIds).toEqual([]);
      expect(result.locationId).toBeUndefined();
    });

    it('should set locationId as string and vehicleIds when provided', () => {
      const result = initTicket('loc1', ['v1', 'v2']);
      expect(result.locationId).toBe('loc1');
      expect(result.vehicleIds).toEqual(['v1', 'v2']);
    });

    it('should convert a numeric locationId to string', () => {
      const result = initTicket(42);
      expect(result.locationId).toBe('42');
    });
  });

  describe('ticketZ', () => {
    const base = {
      vehicleIds: ['v1'],
      employeeId: 'e1',
      customerId: 'c1',
    };

    it('should validate a valid REPAIR ticket', () => {
      const valid = {
        ...base,
        ticketType: TicketType.REPAIR,
        repairDescription: 'Fix brakes',
      };
      expect(ticketZ.safeParse(valid).success).toBe(true);
    });

    it('should validate a valid RENT ticket', () => {
      const valid = {
        ...base,
        ticketType: TicketType.RENT,
        startDate: '2026-05-01',
        endDate: '2026-05-10',
      };
      expect(ticketZ.safeParse(valid).success).toBe(true);
    });

    it('should validate a valid DONATE ticket', () => {
      const valid = { ...base, ticketType: TicketType.DONATE };
      expect(ticketZ.safeParse(valid).success).toBe(true);
    });

    it('should fail for REPAIR ticket missing repairDescription', () => {
      const invalid = { ...base, ticketType: TicketType.REPAIR };
      expect(ticketZ.safeParse(invalid).success).toBe(false);
    });

    it('should fail for RENT ticket missing startDate', () => {
      const invalid = {
        ...base,
        ticketType: TicketType.RENT,
        endDate: '2026-05-10',
      };
      expect(ticketZ.safeParse(invalid).success).toBe(false);
    });

    it('should fail when vehicleIds is empty', () => {
      const invalid = {
        ticketType: TicketType.REPAIR,
        vehicleIds: [],
        employeeId: 'e1',
        customerId: 'c1',
        repairDescription: 'Fix',
      };
      const result = ticketZ.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some(
            (i) => i.message === 'At least one vehicle is required',
          ),
        ).toBe(true);
      }
    });
  });
});
