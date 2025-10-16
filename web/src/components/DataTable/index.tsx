import type { Row } from '@hooks/useHeadlessTable';

export interface Column<R extends Row> {
  /** Column key */
  key: string;
  name: string;
  /** Override the default sort button header */
  renderHeaderFn?: () => JSX.Element | string;
  /** Render the cell */
  renderFn: (
    row: R,
    metaData: { x: number; y: number; disabled: boolean; selected: boolean },
  ) => JSX.Element | string | null | false | undefined;
}

//

export type { Row } from '@hooks/useHeadlessTable';
export { Root } from '@components/shadcn/Table';

export * from './DataTableProvider';
export * from './DataTableHeader';
export * from './DataTableSortHead';
export * from './DataTableBody';
export * from './DataTableBodySkeleton';
export * from './DataTableFilterClear';
export * from './DataTableFilterDate';
export * from './DataTableFilterSearch';
export * from './DataTableFilterPopover';
export * from './DataTableFilterMultiSelect';
export * from './DataTableFilterSlider';
