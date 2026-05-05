import { describe, expect, it } from 'vitest';
import { isShopOpen } from './utils';

// Jan 1, 2024 = Monday (getDay() === 1); Jan 7, 2024 = Sunday (getDay() === 0)
const openHours = { mon: '08:00-17:00', sat: '10:00-14:00' };

describe('isShopOpen', () => {
  it('returns true when current time is within opening hours', () => {
    const date = new Date(2024, 0, 1, 12, 0); // Monday 12:00
    expect(isShopOpen(openHours, date)).toBe(true);
  });

  it('returns false when current time is before opening hours', () => {
    const date = new Date(2024, 0, 1, 7, 59); // Monday 07:59
    expect(isShopOpen(openHours, date)).toBe(false);
  });

  it('returns false when current time is after opening hours', () => {
    const date = new Date(2024, 0, 1, 17, 1); // Monday 17:01
    expect(isShopOpen(openHours, date)).toBe(false);
  });

  it('returns false when no hours defined for that day', () => {
    const date = new Date(2024, 0, 7, 12, 0); // Sunday — no openHours entry
    expect(isShopOpen(openHours, date)).toBe(false);
  });

  it('returns false for null openHours', () => {
    const date = new Date(2024, 0, 1, 12, 0); // Monday 12:00
    expect(isShopOpen(null, date)).toBe(false);
  });
});
