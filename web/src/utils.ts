import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const clamp = (min: number, max: number, val: number) =>
  Math.max(Math.min(max, val), min);

export const toSortFnByProp = (prop: string) => (a: any, b: any) => {
  const isType = (type: any) =>
    (typeof a[prop] as string) === type && (typeof b[prop] as string) === type;

  if (isType('number')) return a[prop] - b[prop];
  if (isType('string')) return a[prop].localeCompare(b[prop]);
  if (isType('boolean')) return a[prop] === b[prop] ? 0 : b[prop] ? -1 : 1;
  else return String(a[prop]).localeCompare(String(b[prop]));
};

export const toArrayValueCountMap = (array: string[]) =>
  array.reduce(
    (acc: Record<string, number>, el) => ({ ...acc, [el]: (acc[el] || 0) + 1 }),
    {},
  );

export const omitKey = (obj: Record<string, any>, keyToRemove: string) =>
  Object.fromEntries(
    Object.entries(obj).filter(([key, _]) => key !== keyToRemove),
  );

export const underscoreToCamelCase = (str: string) =>
  str
    .split('_')
    .map(
      ([head, ...tail], i) =>
        (i === 0 ? head : head.toUpperCase()) + tail.join('').toLowerCase(),
    )
    .join('');

export const toCamelCaseObj = (obj: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [underscoreToCamelCase(key), val]),
  );
