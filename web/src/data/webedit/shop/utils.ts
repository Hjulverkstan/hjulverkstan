import { OpenHours } from '@data/webedit/shop/types';

const dayKeys: (keyof OpenHours)[] = [
  'sun',
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
];

export function isShopOpen(
  openHoursData: OpenHours | null | undefined,
  date: Date,
): boolean {
  const hours = openHoursData?.[dayKeys[date.getDay()]];
  if (!hours) return false;

  const match = hours.match(/^(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})$/);
  if (!match) {
    console.warn(`Invalid format for ${dayKeys[date.getDay()]}: ${hours}`);
    return false;
  }

  const [_, oh, om, ch, cm] = match.map(Number);
  if ([oh, om, ch, cm].some(isNaN)) return false;

  const now = date.getHours() * 60 + date.getMinutes();
  const open = oh * 60 + om;
  const close = ch * 60 + cm;

  return close < open ? now >= open || now < close : now >= open && now < close;
}
