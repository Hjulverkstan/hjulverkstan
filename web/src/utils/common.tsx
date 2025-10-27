import { AxiosInstance } from 'axios';
import { ClassValue, clsx } from 'clsx';
import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//

export const clamp = (min: number, max: number, val: number) =>
  Math.max(Math.min(max, val), min);

//

export const capitalize = ([head, ...tail]: string) =>
  head.toUpperCase() + tail.join('').toLowerCase();

//

export const toSortFnByProp = (prop: string) => (a: any, b: any) => {
  const isType = (type: any) =>
    (typeof a[prop] as string) === type && (typeof b[prop] as string) === type;

  if (isType('number')) return a[prop] - b[prop];
  if (isType('string')) return a[prop].localeCompare(b[prop]);
  if (isType('boolean')) return a[prop] === b[prop] ? 0 : b[prop] ? -1 : 1;
  else return String(a[prop]).localeCompare(String(b[prop]));
};

//

export const toArrayValueCountMap = (array: string[]) =>
  array.reduce(
    (acc: Record<string, number>, el) => ({ ...acc, [el]: (acc[el] || 0) + 1 }),
    {},
  );

//

export const occurencesOfElInArray = <El,>(el: El, xs: El[]) =>
  xs.reduce((count, x) => count + (x === el ? 1 : 0), 0);

//

export const omitKeys = (keys: string[], obj: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(obj).filter(([key, _]) => !keys.includes(key)),
  );

export const pickKeys = (keys: string[], obj: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(obj).filter(([key, _]) => keys.includes(key)),
  );

//

export const shallowEq = (
  a?: Record<string, any> | any[],
  b?: Record<string, any> | any[],
): boolean => {
  if (a === b) return true;

  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a === null ||
    b === null
  ) {
    return false;
  }

  // Handle arrays

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }

  // Handle objects

  if (Object.keys(a).length !== Object.keys(b).length) return false;

  for (const key of Object.keys(a))
    if ((a as Record<string, any>)[key] !== (b as Record<string, any>)[key])
      return false;

  return true;
};

//

type AnyFunction<A extends any[], R> = (...args: A) => R;

export function memoizeFn<F extends AnyFunction<any[], any>>(fn: F): F {
  const cache: Record<string, any> = {};
  return function (
    this: ThisParameterType<F>,
    ...args: Parameters<F>
  ): ReturnType<F> {
    const key = JSON.stringify(args);

    if (key in cache) return cache[key];

    const result = fn(...args);
    cache[key] = result;
    return result;
  } as F;
}

//

export const toUpdatedArray = (
  arr: string[],
  { remove = [] as any[] | any, add = [] as any[] | any },
) =>
  remove.length === 0 && add.length === 0
    ? // If nothing to remove or add keep the same memory reference of the array
      arr
    : arr
        .filter((el) =>
          Array.isArray(remove) ? !remove.includes(el) : el !== remove,
        )
        .concat(add);

export function uniq<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * useAxiosCookieJar add interceptors to resend cookies from responses
 * in requests. We use this on server side as there is no browser to store the
 * cookies for us. Returns function to clear interceptors...
 */

export const useAxiosCookieJar = (instance: AxiosInstance) => {
  let cookies: any;

  const resInterceptorId = instance.interceptors.response.use(
    (res) => {
      cookies = res.headers['set-cookie']
        ?.map((cookie) => cookie.split(';')[0])
        .join('; ');

      return res;
    },
    (err) => Promise.reject(err),
  );

  const reqInterceptorId = instance.interceptors.request.use((config) => {
    config.headers.Cookie = cookies;
    return config;
  });

  return () => {
    instance.interceptors.response.eject(resInterceptorId);
    instance.interceptors.request.eject(reqInterceptorId);
  };
};

/**
 * This is a React higher-order-component. It is used to trigger destroy and
 * remount of a component by having its `key` prop mapped to by a `toKey`
 * function
 *
 * @param toKey This is the function that will set the value of the `key` props.
 * @param Comp What ever component you wish to lobotomize.
 */

export const withLobotomizer =
  <Props,>(toKey: (props: Props) => string, Comp: FC<Props>): FC<Props> =>
  (props) => <Comp key={toKey(props)} {...props} />;

//

export const formatDays = (dayCount?: number) =>
  dayCount === 0
    ? 'today'
    : dayCount === 1
      ? '1 day ago'
      : dayCount && dayCount > 1
        ? `${dayCount} days ago}`
        : undefined;

export function matchDateWithoutTimestamp(
  search: string,
  dateStr?: string,
): boolean {
  if (!dateStr) return false;
  const formattedDate = dateStr.split('T')[0];
  return formattedDate.toLowerCase().includes(search.toLowerCase());
}

//

export const truncate = (text: string, maxLength: number): string =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

//

export const setByPath = <T extends object, V>(
  obj: T,
  path: string | string[],
  value: V,
): T => {
  const keys = Array.isArray(path) ? [...path] : path.split('.');
  if (keys.length === 0) return obj;

  const [head, ...tail] = keys as string[];
  const curr: any = (obj as any) ?? {};

  return {
    ...curr,
    [head]: tail.length ? setByPath(curr[head] ?? {}, tail, value) : value,
  } as T;
};

export const getByPath = <T = any,>(
  obj: unknown,
  path: string | string[],
): T | undefined =>
  (Array.isArray(path) ? path : path.split('.')).reduce(
    (acc, key) =>
      acc != null && typeof acc === 'object' ? (acc as any)[key] : undefined,
    obj,
  ) as T | undefined;
