import { useEffect } from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  cn,
  clamp,
  capitalize,
  toSortFnByProp,
  toArrayValueCountMap,
  occurencesOfElInArray,
  omitKeys,
  pickKeys,
  shallowEq,
  memoizeFn,
  toUpdatedArray,
  uniq,
  formatDays,
  matchDateWithoutTimestamp,
  truncate,
  setByPath,
  getByPath,
  useAxiosCookieJar,
  withLobotomizer,
} from '@utils/common';

// ─── cn ───────────────────────────────────────────────────────────────────────

describe('cn', () => {
  it('merges class names and resolves Tailwind conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});

// ─── clamp ────────────────────────────────────────────────────────────────────

describe('clamp', () => {
  it('returns min when value is below min', () => {
    expect(clamp(5, 10, 2)).toBe(5);
  });

  it('returns max when value is above max', () => {
    expect(clamp(5, 10, 15)).toBe(10);
  });

  it('returns value when within range', () => {
    expect(clamp(5, 10, 7)).toBe(7);
  });

  it('returns min when value equals min (inclusive lower bound)', () => {
    expect(clamp(5, 10, 5)).toBe(5);
  });

  it('returns max when value equals max (inclusive upper bound)', () => {
    expect(clamp(5, 10, 10)).toBe(10);
  });
});

// ─── capitalize ───────────────────────────────────────────────────────────────

describe('capitalize', () => {
  it('uppercases the first character and lowercases the rest', () => {
    expect(capitalize('hELLO')).toBe('Hello');
  });

  it('handles a single-character string', () => {
    expect(capitalize('a')).toBe('A');
  });

  it('returns an empty string for empty input', () => {
    expect(capitalize('')).toBe('');
  });
});

// ─── toSortFnByProp ───────────────────────────────────────────────────────────

describe('toSortFnByProp', () => {
  it('sorts numbers in ascending order', () => {
    // Arrange — multi-digit values ensure string sort order differs from numeric
    const items = [{ n: 10 }, { n: 2 }, { n: 1 }];

    // Act
    const sorted = [...items].sort(toSortFnByProp('n'));

    // Assert
    expect(sorted.map((i) => i.n)).toEqual([1, 2, 10]);
  });

  it('sorts strings by locale in ascending order', () => {
    // Arrange
    const items = [{ s: 'banana' }, { s: 'apple' }, { s: 'cherry' }];

    // Act
    const sorted = [...items].sort(toSortFnByProp('s'));

    // Assert
    expect(sorted.map((i) => i.s)).toEqual(['apple', 'banana', 'cherry']);
  });

  it('sorts booleans with true before false', () => {
    // Arrange
    const items = [{ b: true }, { b: false }, { b: true }];

    // Act
    const sorted = [...items].sort(toSortFnByProp('b'));

    // Assert
    expect(sorted.map((i) => i.b)).toEqual([false, true, true]);
  });

  it('returns 0 when comparing two equal boolean values', () => {
    expect(toSortFnByProp('b')({ b: true }, { b: true })).toBe(0);
  });

  it('falls back to string coercion for non-string non-number non-boolean types', () => {
    // Arrange — 'null' < 'undefined' lexicographically, so nulls sort first
    const items = [{ v: null }, { v: undefined }, { v: null }];

    // Act
    const sorted = [...items].sort(toSortFnByProp('v'));

    // Assert
    expect(sorted.map((i) => i.v)).toEqual([null, null, undefined]);
  });

  it('falls back to string coercion when a and b have mixed types', () => {
    // Arrange — number vs string skips the typed branches; '1' < 'a' lexicographically
    const items = [{ v: 'a' as any }, { v: 1 }];

    // Act
    const sorted = [...items].sort(toSortFnByProp('v'));

    // Assert
    expect(sorted.map((i) => i.v)).toEqual([1, 'a']);
  });
});

// ─── toArrayValueCountMap ─────────────────────────────────────────────────────

describe('toArrayValueCountMap', () => {
  it('returns an empty object for an empty array', () => {
    expect(toArrayValueCountMap([])).toEqual({});
  });

  it('counts each unique value correctly', () => {
    expect(toArrayValueCountMap(['a', 'b', 'c'])).toEqual({
      a: 1,
      b: 1,
      c: 1,
    });
  });

  it('increments the count for duplicate values', () => {
    expect(toArrayValueCountMap(['a', 'b', 'a', 'a'])).toEqual({ a: 3, b: 1 });
  });
});

// ─── occurencesOfElInArray ────────────────────────────────────────────────────

describe('occurencesOfElInArray', () => {
  it('returns 0 when the element is absent', () => {
    expect(occurencesOfElInArray('x', ['a', 'b', 'c'])).toBe(0);
  });

  it('returns the correct count when the element appears multiple times', () => {
    expect(occurencesOfElInArray('a', ['a', 'b', 'a', 'c', 'a'])).toBe(3);
  });
});

// ─── omitKeys / pickKeys ──────────────────────────────────────────────────────

describe('omitKeys', () => {
  it('removes only the specified keys', () => {
    expect(omitKeys(['b', 'c'], { a: 1, b: 2, c: 3 })).toEqual({ a: 1 });
  });

  it('returns all entries when the keys list is empty', () => {
    expect(omitKeys([], { a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
  });
});

describe('pickKeys', () => {
  it('keeps only the specified keys', () => {
    expect(pickKeys(['a', 'c'], { a: 1, b: 2, c: 3 })).toEqual({ a: 1, c: 3 });
  });

  it('returns an empty object when no keys match', () => {
    expect(pickKeys(['x', 'y'], { a: 1, b: 2 })).toEqual({});
  });
});

// ─── shallowEq ────────────────────────────────────────────────────────────────

describe('shallowEq', () => {
  it('returns true for the same object reference', () => {
    const obj = { a: 1 };
    expect(shallowEq(obj, obj)).toBe(true);
  });

  it('returns false when comparing a non-object with an object', () => {
    expect(shallowEq(undefined, { a: 1 })).toBe(false);
  });

  it('returns false when either side is null', () => {
    expect(shallowEq(null as any, { a: 1 })).toBe(false);
    expect(shallowEq({ a: 1 }, null as any)).toBe(false);
  });

  it('returns true for two null references', () => {
    expect(shallowEq(null as any, null as any)).toBe(true);
  });

  it('returns false when b is a non-object primitive', () => {
    expect(shallowEq({ a: 1 }, 42 as any)).toBe(false);
    expect(shallowEq({} as any, 42 as any)).toBe(false);
  });

  describe('Arrays', () => {
    it('returns true for arrays with the same length and identical elements', () => {
      expect(shallowEq([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    it('returns false for arrays with different lengths', () => {
      expect(shallowEq([1, 2], [1, 2, 3])).toBe(false);
    });

    it('returns false for arrays with the same length but different elements', () => {
      expect(shallowEq([1, 2, 3], [1, 2, 4])).toBe(false);
    });
  });

  describe('Objects', () => {
    it('returns true for objects with the same keys and values', () => {
      expect(shallowEq({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    });

    it('returns false for objects with a different number of keys', () => {
      expect(shallowEq({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

    it('returns false for objects with the same keys but different values', () => {
      expect(shallowEq({ a: 1, b: 2 }, { a: 1, b: 99 })).toBe(false);
    });
  });
});

// ─── memoizeFn ────────────────────────────────────────────────────────────────

describe('memoizeFn', () => {
  it('returns the correct result', () => {
    // Arrange
    const add = memoizeFn((a: number, b: number) => a + b);

    // Act & Assert
    expect(add(2, 3)).toBe(5);
  });

  it('does not re-invoke the function on repeated calls with the same args', () => {
    // Arrange
    const fn = vi.fn((x: number) => x * 2);
    const memoized = memoizeFn(fn);

    // Act
    memoized(4);
    memoized(4);

    // Assert
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('uses separate cache entries for different arguments', () => {
    // Arrange
    const fn = vi.fn((x: number) => x * 2);
    const memoized = memoizeFn(fn);

    // Act
    memoized(2);
    memoized(3);

    // Assert
    expect(fn).toHaveBeenCalledTimes(2);
    expect(memoized(2)).toBe(4);
    expect(memoized(3)).toBe(6);
  });
});

// ─── toUpdatedArray ───────────────────────────────────────────────────────────

describe('toUpdatedArray', () => {
  it('returns the same array reference when both remove and add are empty', () => {
    // Arrange
    const arr = ['a', 'b', 'c'];

    // Act
    const result = toUpdatedArray(arr, { remove: [], add: [] });

    // Assert
    expect(result).toBe(arr);
  });

  it('removes specified elements', () => {
    expect(toUpdatedArray(['a', 'b', 'c'], { remove: ['b'] })).toEqual([
      'a',
      'c',
    ]);
  });

  it('removes a scalar element when remove is not an array', () => {
    expect(toUpdatedArray(['a', 'b', 'c'], { remove: 'b' as any })).toEqual([
      'a',
      'c',
    ]);
  });

  it('adds specified elements', () => {
    expect(toUpdatedArray(['a', 'b'], { add: ['c'] })).toEqual(['a', 'b', 'c']);
  });

  it('removes and adds elements in one call', () => {
    expect(
      toUpdatedArray(['a', 'b', 'c'], { remove: ['b'], add: ['d'] }),
    ).toEqual(['a', 'c', 'd']);
  });
});

// ─── uniq ─────────────────────────────────────────────────────────────────────

describe('uniq', () => {
  it('returns an empty array for empty input', () => {
    expect(uniq([])).toEqual([]);
  });

  it('removes duplicate values', () => {
    expect(uniq([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
  });

  it('preserves the order of first occurrences', () => {
    expect(uniq(['b', 'a', 'b', 'c', 'a'])).toEqual(['b', 'a', 'c']);
  });
});

// ─── formatDays ───────────────────────────────────────────────────────────────

describe('formatDays', () => {
  it('returns "today" for 0', () => {
    expect(formatDays(0)).toBe('today');
  });

  it('returns "1 day ago" for 1', () => {
    expect(formatDays(1)).toBe('1 day ago');
  });

  it('returns "N days ago" for values greater than 1', () => {
    expect(formatDays(5)).toBe('5 days ago');
  });

  it('returns undefined for undefined', () => {
    expect(formatDays(undefined)).toBeUndefined();
  });

  it('returns undefined for a negative number', () => {
    expect(formatDays(-1)).toBeUndefined();
  });
});

// ─── matchDateWithoutTimestamp ────────────────────────────────────────────────

describe('matchDateWithoutTimestamp', () => {
  it('returns true when the search string matches the date portion', () => {
    expect(matchDateWithoutTimestamp('2024-01', '2024-01-15T10:30:00')).toBe(
      true,
    );
  });

  it('returns false when the search string does not match', () => {
    expect(matchDateWithoutTimestamp('2025', '2024-01-15T10:30:00')).toBe(
      false,
    );
  });

  it('returns false when dateStr is undefined', () => {
    expect(matchDateWithoutTimestamp('2024', undefined)).toBe(false);
  });
});

// ─── truncate ─────────────────────────────────────────────────────────────────

describe('truncate', () => {
  // Note: maxLength controls the slice length, not the total output length.
  // When truncation occurs, the "..." suffix is appended, so the final string
  // can exceed maxLength by 3 characters.

  it('returns the string unchanged when within maxLength', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('returns the string unchanged when length equals maxLength', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });

  it('appends "..." when the string exceeds maxLength', () => {
    expect(truncate('hello world', 5)).toBe('hello...');
  });
});

// ─── setByPath / getByPath ────────────────────────────────────────────────────

describe('setByPath', () => {
  it('sets a top-level key', () => {
    expect(setByPath({ a: 1 }, 'a', 99)).toEqual({ a: 99 });
  });

  it('sets a deeply nested key', () => {
    expect(setByPath({ a: { b: { c: 1 } } }, 'a.b.c', 42)).toEqual({
      a: { b: { c: 42 } },
    });
  });

  it('accepts path as an array of keys', () => {
    expect(setByPath({}, ['a', 'b'], 'val')).toEqual({ a: { b: 'val' } });
  });

  it('returns obj unchanged when path is an empty array', () => {
    expect(setByPath({ a: 1 }, [], 'x')).toEqual({ a: 1 });
  });

  it('preserves existing keys when setting a new one', () => {
    expect(setByPath({ a: 1, b: 2 }, 'c', 3)).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('creates missing intermediate objects along the path', () => {
    expect(setByPath({}, 'a.b.c', 1)).toEqual({ a: { b: { c: 1 } } });
  });
});

describe('getByPath', () => {
  it('retrieves a top-level value', () => {
    expect(getByPath({ a: 1 }, 'a')).toBe(1);
  });

  it('retrieves a deeply nested value', () => {
    expect(getByPath({ a: { b: { c: 42 } } }, 'a.b.c')).toBe(42);
  });

  it('returns undefined for a missing path', () => {
    expect(getByPath({ a: 1 }, 'a.b.c')).toBeUndefined();
  });

  it('accepts path as an array of keys', () => {
    expect(getByPath({ x: { y: 'found' } }, ['x', 'y'])).toBe('found');
  });

  it('returns undefined when obj is null', () => {
    expect(getByPath(null, 'a.b')).toBeUndefined();
  });

  it('returns undefined when obj is undefined', () => {
    expect(getByPath(undefined, 'a')).toBeUndefined();
  });

  it('returns undefined when the path traverses past a primitive value', () => {
    expect(getByPath({ a: 'leaf' }, 'a.b')).toBeUndefined();
  });
});

// ─── useAxiosCookieJar ────────────────────────────────────────────────────────

describe('useAxiosCookieJar', () => {
  const makeMockAxios = () => {
    const handlers: { res?: any; req?: any } = {};
    const instance = {
      interceptors: {
        response: {
          use: vi.fn((fn: any) => {
            handlers.res = fn;
            return 'res-id';
          }),
          eject: vi.fn(),
        },
        request: {
          use: vi.fn((fn: any) => {
            handlers.req = fn;
            return 'req-id';
          }),
          eject: vi.fn(),
        },
      },
    };
    return { instance: instance as any, handlers };
  };

  it('registers a response and request interceptor on the axios instance', () => {
    // Arrange
    const { instance } = makeMockAxios();

    // Act
    useAxiosCookieJar(instance);

    // Assert
    expect(instance.interceptors.response.use).toHaveBeenCalledOnce();
    expect(instance.interceptors.request.use).toHaveBeenCalledOnce();
  });

  it('captures set-cookie name/value pairs and forwards them as Cookie on the next request', () => {
    // Arrange
    const { instance, handlers } = makeMockAxios();
    useAxiosCookieJar(instance);

    // Act — simulate a response with set-cookie, then a follow-up request
    handlers.res({
      headers: {
        'set-cookie': ['session=abc; HttpOnly; Path=/', 'tracking=xyz; Secure'],
      },
    });
    const updatedConfig = handlers.req({ headers: {} as any });

    // Assert — attributes past the first ";" are stripped
    expect(updatedConfig.headers.Cookie).toBe('session=abc; tracking=xyz');
  });

  it('returns a cleanup function that ejects both interceptors by id', () => {
    // Arrange
    const { instance } = makeMockAxios();
    const cleanup = useAxiosCookieJar(instance);

    // Act
    cleanup();

    // Assert
    expect(instance.interceptors.response.eject).toHaveBeenCalledWith('res-id');
    expect(instance.interceptors.request.eject).toHaveBeenCalledWith('req-id');
  });
});

// ─── withLobotomizer ──────────────────────────────────────────────────────────

describe('withLobotomizer', () => {
  it('remounts the wrapped component when toKey returns a different value', () => {
    // Arrange — track mount count via a useEffect that only fires on mount
    let mountCount = 0;
    const Inner = ({ value }: { value: string }) => {
      useEffect(() => {
        mountCount++;
      }, []);
      return <div>{value}</div>;
    };
    const Wrapped = withLobotomizer<{ value: string }>(
      (props) => props.value,
      Inner,
    );

    // Act
    const { rerender } = render(<Wrapped value="a" />);
    const initialCount = mountCount;

    rerender(<Wrapped value="a" />);
    const sameKeyCount = mountCount;

    rerender(<Wrapped value="b" />);
    const newKeyCount = mountCount;

    // Assert
    expect(initialCount).toBe(1);
    expect(sameKeyCount).toBe(1);
    expect(newKeyCount).toBe(2);
  });

  it('forwards all props through to the wrapped component', () => {
    // Arrange
    const Inner = ({ value }: { value: string }) => (
      <div data-testid="content">{value}</div>
    );
    const Wrapped = withLobotomizer<{ value: string }>((p) => p.value, Inner);

    // Act
    const { getByTestId } = render(<Wrapped value="hello" />);

    // Assert
    expect(getByTestId('content').textContent).toBe('hello');
  });
});
