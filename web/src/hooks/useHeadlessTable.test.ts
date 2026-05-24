import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useHeadlessTable from '@hooks/useHeadlessTable';

// ─── Test data ────────────────────────────────────────────────────────────────

type TestRow = { id: string; name: string; age: number };

const makeRows = (): TestRow[] => [
  { id: '1', name: 'Alice', age: 30 },
  { id: '2', name: 'Bob', age: 25 },
  { id: '3', name: 'Charlie', age: 35 },
  { id: '4', name: 'Dave', age: 28 },
  { id: '5', name: 'Eve', age: 22 },
];

const setup = (overrides: Record<string, any> = {}) =>
  renderHook(() =>
    useHeadlessTable<TestRow>({
      key: 'test',
      data: makeRows(),
      initPageSize: 3,
      ...overrides,
    }),
  );

beforeEach(() => {
  localStorage.clear();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('useHeadlessTable', () => {
  describe('Pagination', () => {
    it('paginatedData contains only the first initPageSize rows on initial render', () => {
      // Arrange & Act
      const { result } = setup();

      // Assert
      expect(result.current.paginatedData).toHaveLength(3);
      expect(result.current.paginatedData.map((r) => r.id)).toEqual([
        '1',
        '2',
        '3',
      ]);
    });

    it('setPage advances to the correct page and returns the correct slice', () => {
      // Arrange
      const { result } = setup();

      // Act
      act(() => result.current.setPage(1));

      // Assert — 5 rows, pageSize 3 → page 1 has rows 4 and 5
      expect(result.current.paginatedData).toHaveLength(2);
      expect(result.current.paginatedData.map((r) => r.id)).toEqual(['4', '5']);
    });

    it('setPage clamps to 0 when given a negative value', () => {
      // Arrange
      const { result } = setup();

      // Act
      act(() => result.current.setPage(-99));

      // Assert
      expect(result.current.page).toBe(0);
    });

    it('setPage clamps to the last valid page when given an out-of-bounds value', () => {
      // Arrange
      const { result } = setup();

      // Act
      act(() => result.current.setPage(999));

      // Assert — ceil(5/3) = 2 pages → last valid index is 1
      expect(result.current.page).toBe(1);
    });

    it('pageCount equals Math.ceil(filteredData.length / pageSize)', () => {
      // Arrange & Act
      const { result } = setup();

      // Assert — ceil(5/3) = 2
      expect(result.current.pageCount).toBe(2);
    });

    it('auto-resets page to 0 when data shrinks and the current page no longer exists', () => {
      // Arrange — navigate to page 1 with 5 rows
      let data = makeRows();
      const { result, rerender } = renderHook(() =>
        useHeadlessTable<TestRow>({ key: 'test', data, initPageSize: 3 }),
      );
      act(() => result.current.setPage(1));
      expect(result.current.page).toBe(1);

      // Act — shrink to 2 rows so only page 0 is valid
      act(() => {
        data = makeRows().slice(0, 2);
        rerender();
      });

      // Assert
      expect(result.current.page).toBe(0);
    });

    it('setPageSize updates paginatedData length and recalculates pageCount', () => {
      // Arrange
      const { result } = setup();

      // Act
      act(() => result.current.setPageSize(2));

      // Assert — ceil(5/2) = 3 pages; first page has 2 rows
      expect(result.current.paginatedData).toHaveLength(2);
      expect(result.current.pageCount).toBe(Math.ceil(5 / 2));
    });

    it('auto-reset targets the new last valid page when it is greater than 0', () => {
      // Arrange — 9 rows gives 3 pages (0, 1, 2) with pageSize 3
      const nineRows: TestRow[] = Array.from({ length: 9 }, (_, i) => ({
        id: String(i + 1),
        name: `Row${i + 1}`,
        age: 20 + i,
      }));

      let data = nineRows;
      const { result, rerender } = renderHook(() =>
        useHeadlessTable<TestRow>({ key: 'test', data, initPageSize: 3 }),
      );

      act(() => result.current.setPage(2));
      expect(result.current.page).toBe(2);

      // Act — shrink to 5 rows → pageCount = ceil(5/3) = 2, last valid page = 1
      act(() => {
        data = nineRows.slice(0, 5);
        rerender();
      });

      // Assert — resets to 1, not 0
      expect(result.current.page).toBe(1);
    });

    it('page does not reset when the current page remains valid after a rerender', () => {
      // Arrange
      const data = makeRows();
      const { result, rerender } = renderHook(() =>
        useHeadlessTable<TestRow>({ key: 'test', data, initPageSize: 3 }),
      );

      act(() => result.current.setPage(1));
      expect(result.current.page).toBe(1);

      // Act — rerender with unchanged data
      act(() => rerender());

      // Assert — page 1 is still valid, no spurious reset
      expect(result.current.page).toBe(1);
    });
  });

  describe('Sorting', () => {
    it('toggleColSort on a new column starts at ascending (dir=1)', () => {
      // Arrange
      const { result } = setup();

      // Act
      act(() => result.current.toggleColSort('name'));

      // Assert
      expect(result.current.sortState).toEqual({ key: 'name', dir: 1 });
    });

    it('toggleColSort on the same column a second time switches to descending (dir=-1)', () => {
      // Arrange
      const { result } = setup();

      // Act
      act(() => result.current.toggleColSort('name'));
      act(() => result.current.toggleColSort('name'));

      // Assert
      expect(result.current.sortState).toEqual({ key: 'name', dir: -1 });
    });

    it('toggleColSort on the same column a third time clears sort (dir=0) and restores original order', () => {
      // Arrange
      const { result } = setup();

      // Act
      act(() => result.current.toggleColSort('name'));
      act(() => result.current.toggleColSort('name'));
      act(() => result.current.toggleColSort('name'));

      // Assert
      expect(result.current.sortState).toEqual({ key: 'name', dir: 0 });
      expect(result.current.sortedData.map((r) => r.id)).toEqual([
        '1',
        '2',
        '3',
        '4',
        '5',
      ]);
    });

    it('sortedData rows are in ascending alphabetical order when dir=1', () => {
      // Arrange
      const { result } = setup();

      // Act
      act(() => result.current.toggleColSort('name'));

      // Assert
      const names = result.current.sortedData.map((r) => r.name);
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    });

    it('sortedData rows are in descending alphabetical order when dir=-1', () => {
      // Arrange
      const { result } = setup();

      // Act
      act(() => result.current.toggleColSort('name'));
      act(() => result.current.toggleColSort('name'));

      // Assert
      const names = result.current.sortedData.map((r) => r.name);
      expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
    });

    it('uses a custom sortFnMap function when provided for the column', () => {
      // Arrange — custom fn sorts age descending, which differs from the default ascending sort
      const { result } = renderHook(() =>
        useHeadlessTable<TestRow>({
          key: 'test',
          data: makeRows(),
          initPageSize: 5,
          sortFnMap: { age: (a: TestRow, b: TestRow) => b.age - a.age },
        }),
      );

      // Act — dir=1 multiplies the custom descending fn by 1 → still descending
      act(() => result.current.toggleColSort('age'));

      // Assert — custom fn gives [35,30,28,25,22]; default toSortFnByProp would give [22,25,28,30,35]
      expect(result.current.sortedData.map((r) => r.age)).toEqual([
        35, 30, 28, 25, 22,
      ]);
    });
  });

  describe('Filtering', () => {
    it('setFilterFn with a predicate narrows filteredData to matching rows only', () => {
      // Arrange
      const { result } = setup();

      // Act
      act(() =>
        result.current.setFilterFn(
          'name',
          (row: TestRow) => row.name === 'Alice',
        ),
      );

      // Assert
      expect(result.current.filteredData).toHaveLength(1);
      expect(result.current.filteredData[0].name).toBe('Alice');
    });

    it('setFilterFn with false removes the filter and restores all rows', () => {
      // Arrange
      const { result } = setup();
      act(() =>
        result.current.setFilterFn(
          'name',
          (row: TestRow) => row.name === 'Alice',
        ),
      );
      expect(result.current.filteredData).toHaveLength(1);

      // Act
      act(() => result.current.setFilterFn('name', false));

      // Assert
      expect(result.current.filteredData).toHaveLength(5);
    });

    it('multiple active filters are ANDed — a row must pass all of them', () => {
      // Arrange
      const { result } = setup();

      // Act — age > 25 AND name starts with A or C
      act(() =>
        result.current.setFilterFn('age', (row: TestRow) => row.age > 25),
      );
      act(() =>
        result.current.setFilterFn(
          'name',
          (row: TestRow) => row.name[0] === 'A' || row.name[0] === 'C',
        ),
      );

      // Assert — only Alice (30) and Charlie (35) pass both predicates
      expect(result.current.filteredData).toHaveLength(2);
      expect(result.current.filteredData.map((r) => r.name)).toEqual(
        expect.arrayContaining(['Alice', 'Charlie']),
      );
    });

    it('isFiltered is true when any filter is active and false when none are', () => {
      // Arrange
      const { result } = setup();
      expect(result.current.isFiltered).toBe(false);

      // Act
      act(() =>
        result.current.setFilterFn(
          'name',
          (row: TestRow) => row.name === 'Alice',
        ),
      );

      // Assert
      expect(result.current.isFiltered).toBe(true);
    });

    it('a filter keyed to a hidden column is not applied to filteredData', () => {
      // Arrange — filter that only allows Alice
      const { result } = setup();
      act(() =>
        result.current.setFilterFn(
          'name',
          (row: TestRow) => row.name === 'Alice',
        ),
      );
      expect(result.current.filteredData).toHaveLength(1);

      // Act — hiding the column disables its filter
      act(() => result.current.toggleColHidden('name'));

      // Assert — all rows visible again
      expect(result.current.filteredData).toHaveLength(5);
    });

    it('setFilterFn with false on an unregistered key is a no-op on filteredData', () => {
      // Arrange
      const { result } = setup();

      // Act — key was never registered, so this is a no-op
      act(() => result.current.setFilterFn('nonexistent', false));

      // Assert
      expect(result.current.filteredData).toHaveLength(5);
    });

    it('filterFnMap exposes all currently registered filter functions', () => {
      // Arrange
      const { result } = setup();

      // Act
      act(() =>
        result.current.setFilterFn(
          'name',
          (row: TestRow) => row.name === 'Alice',
        ),
      );
      act(() =>
        result.current.setFilterFn('age', (row: TestRow) => row.age > 25),
      );

      // Assert
      expect(Object.keys(result.current.filterFnMap)).toHaveLength(2);
      expect(result.current.filterFnMap).toHaveProperty('name');
      expect(result.current.filterFnMap).toHaveProperty('age');
    });
  });

  describe('Hidden columns', () => {
    it('toggleColHidden adds a column key to hiddenCols when not already hidden', () => {
      // Arrange
      const { result } = setup();

      // Act
      act(() => result.current.toggleColHidden('name'));

      // Assert
      expect(result.current.hiddenCols).toContain('name');
    });

    it('toggleColHidden removes a column key from hiddenCols when already hidden', () => {
      // Arrange
      const { result } = setup();
      act(() => result.current.toggleColHidden('name'));

      // Act
      act(() => result.current.toggleColHidden('name'));

      // Assert
      expect(result.current.hiddenCols).not.toContain('name');
    });

    it('initHiddenCols pre-hides the specified columns before any toggles', () => {
      // Arrange & Act
      const { result } = setup({ initHiddenCols: ['age'] });

      // Assert
      expect(result.current.hiddenCols).toContain('age');
      expect(result.current.hiddenCols).not.toContain('name');
    });
  });

  describe('Clear all filters pub/sub', () => {
    it('clearAllFilters calls every subscribed callback', () => {
      // Arrange
      const { result } = setup();
      const cb1 = vi.fn();
      const cb2 = vi.fn();
      result.current.subscribeToClearAllFilters(cb1);
      result.current.subscribeToClearAllFilters(cb2);

      // Act
      act(() => result.current.clearAllFilters());

      // Assert
      expect(cb1).toHaveBeenCalledTimes(1);
      expect(cb2).toHaveBeenCalledTimes(1);
    });

    it('the unsubscribe function returned by subscribeToClearAllFilters prevents the callback from firing', () => {
      // Arrange
      const { result } = setup();
      const cb = vi.fn();
      const unsubscribe = result.current.subscribeToClearAllFilters(cb);

      // Act
      unsubscribe();
      act(() => result.current.clearAllFilters());

      // Assert
      expect(cb).not.toHaveBeenCalled();
    });
  });

  describe('Return values', () => {
    it('rawData always returns the original input array reference regardless of filters and sort', () => {
      // Arrange
      const data = makeRows();
      const { result } = renderHook(() =>
        useHeadlessTable<TestRow>({ key: 'test', data, initPageSize: 3 }),
      );

      // Act — apply filter and sort
      act(() =>
        result.current.setFilterFn(
          'name',
          (row: TestRow) => row.name === 'Alice',
        ),
      );
      act(() => result.current.toggleColSort('name'));

      // Assert — rawData is unchanged and is the same reference
      expect(result.current.rawData).toBe(data);
    });
  });
});
