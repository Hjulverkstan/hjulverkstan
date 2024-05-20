import { AxiosInstance } from 'axios';
import { ClassValue, clsx } from 'clsx';
import localeCodes from 'locale-codes';
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
  a?: Record<string, any>,
  b?: Record<string, any>,
): boolean => {
  if (a === b) return true;

  if (typeof a !== 'object' || typeof b !== 'object') return false;

  if (Object.keys(a).length !== Object.keys(b).length) return false;

  for (const key of Object.keys(a)) if (a[key] !== b[key]) return false;

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
  { remove = [] as string[] | string, add = [] as string[] | string },
) =>
  !remove.length && !add.length
    ? // If nothing to remove or add keep the same memory reference of the array
      arr
    : arr.filter((el) => !remove.includes(el)).concat(add);

export function uniq<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

//

export const langCodeToLocale = (langCode: string) => {
  const locale = localeCodes.all.find(
    (entry) => entry['iso639-2']?.toLowerCase() === langCode.toLowerCase(),
  )?.['iso639-1'];

  if (!locale) throw Error(`Could not convert lang ${langCode} to locale`);

  return locale;
};

export const localeToLangCode = (locale: string) => {
  const langCode = localeCodes.all.find(
    (entry) => entry?.['iso639-1']?.toLowerCase() === locale.toLowerCase(),
  )?.['iso639-2'];

  if (!langCode) throw Error(`Could not convert locale ${locale} to langCode`);

  return langCode;
};

//

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
