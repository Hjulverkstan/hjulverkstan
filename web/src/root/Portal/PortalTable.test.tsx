import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import PortalTable from './PortalTable';
import { useDataTable } from '@components/DataTable';
import useKeyPress from '@hooks/useKeyPress';
import { useNavigate, useParams } from 'react-router-dom';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
}));
vi.mock('@components/DataTable', () => ({
  useDataTable: vi.fn(),
  Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Header: () => null,
  Body: () => null,
  BodySkeleton: () => null,
}));
vi.mock('@hooks/useKeyPress', () => ({ default: vi.fn() }));
vi.mock('@components/DataForm', () => ({
  Mode: { READ: 'READ', EDIT: 'EDIT', CREATE: 'CREATE' },
}));
vi.mock('@components/Message', () => ({
  default: ({ message }: { message: string }) => (
    <div role="alert">{message}</div>
  ),
}));
vi.mock('@components/Error', () => ({ default: () => null }));
vi.mock('@components/Spinner', () => ({ default: () => null }));
vi.mock('@components/shadcn/Button', () => ({
  IconButton: ({
    onClick,
    disabled,
    tooltip,
  }: {
    onClick?: () => void;
    disabled?: boolean;
    tooltip?: string;
  }) => (
    <button onClick={onClick} disabled={disabled} aria-label={tooltip}>
      {tooltip}
    </button>
  ),
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const navigateMock = vi.fn();
const setPageMock = vi.fn();

const defaultTableState = {
  page: 1,
  pageCount: 3,
  rawData: [{ id: 'item-1' }, { id: 'item-2' }, { id: 'item-3' }],
  filteredData: [{ id: 'item-1' }, { id: 'item-2' }, { id: 'item-3' }],
  isFiltered: false,
  pageSize: 10,
  setPage: setPageMock,
  disabled: false,
};

const renderTable = (
  props: Partial<React.ComponentProps<typeof PortalTable>> = {},
) =>
  render(
    <PortalTable
      isLoading={false}
      columns={[]}
      actionsComponent={() => null}
      {...props}
    />,
  );

const getKeyCallback = (key: string) =>
  vi.mocked(useKeyPress).mock.calls.find(([k]) => k === key)?.[1] as
    | (() => void)
    | undefined;

beforeEach(() => {
  navigateMock.mockClear();
  setPageMock.mockClear();
  vi.mocked(useKeyPress).mockClear();

  vi.mocked(useNavigate).mockReturnValue(navigateMock);
  vi.mocked(useParams).mockReturnValue({ id: '' });
  vi.mocked(useDataTable).mockReturnValue(defaultTableState as any);
});

// ─── noFilterResults condition ────────────────────────────────────────────────

describe('noFilterResults', () => {
  it('shows the no-results message when rawData is non-empty, isFiltered is true, and filteredData is empty', () => {
    // Arrange
    vi.mocked(useDataTable).mockReturnValue({
      ...defaultTableState,
      rawData: [{ id: 'item-1' }],
      isFiltered: true,
      filteredData: [],
    } as any);

    // Act
    renderTable();

    // Assert
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('does not show the message when rawData is empty', () => {
    // Arrange
    vi.mocked(useDataTable).mockReturnValue({
      ...defaultTableState,
      rawData: [],
      isFiltered: true,
      filteredData: [],
    } as any);

    // Act
    renderTable();

    // Assert
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('does not show the message when filteredData has items', () => {
    // Arrange
    vi.mocked(useDataTable).mockReturnValue({
      ...defaultTableState,
      rawData: [{ id: 'item-1' }],
      isFiltered: true,
      filteredData: [{ id: 'item-1' }],
    } as any);

    // Act
    renderTable();

    // Assert
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

// ─── Page correction (useEffect) ──────────────────────────────────────────────

describe('Page correction useEffect', () => {
  it('calls setPage with Math.floor(selectedIndex / pageSize) when id matches a filtered item', () => {
    // Arrange — item-5 is at index 5, pageSize 3 → correct page = floor(5/3) = 1
    vi.mocked(useParams).mockReturnValue({ id: 'item-5' });
    vi.mocked(useDataTable).mockReturnValue({
      ...defaultTableState,
      rawData: [{ id: 'any' }],
      filteredData: [
        { id: 'item-0' },
        { id: 'item-1' },
        { id: 'item-2' },
        { id: 'item-3' },
        { id: 'item-4' },
        { id: 'item-5' },
      ],
      pageSize: 3,
      setPage: setPageMock,
    } as any);

    // Act
    renderTable();

    // Assert
    expect(setPageMock).toHaveBeenCalledWith(1);
  });
});

// ─── Arrow Down navigation ─────────────────────────────────────────────────────

describe('ArrowDown navigation', () => {
  it('navigates to the next item when not at the last item (mode undefined → "./" path)', () => {
    // Arrange
    vi.mocked(useParams).mockReturnValue({ id: 'item-1' });
    vi.mocked(useDataTable).mockReturnValue({
      ...defaultTableState,
      filteredData: [{ id: 'item-1' }, { id: 'item-2' }, { id: 'item-3' }],
    } as any);
    renderTable();

    // Act
    getKeyCallback('ArrowDown')!();

    // Assert
    expect(navigateMock).toHaveBeenCalledWith('./item-2');
  });

  it('does not navigate when already at the last item', () => {
    // Arrange
    vi.mocked(useParams).mockReturnValue({ id: 'item-3' });
    vi.mocked(useDataTable).mockReturnValue({
      ...defaultTableState,
      filteredData: [{ id: 'item-1' }, { id: 'item-2' }, { id: 'item-3' }],
    } as any);
    renderTable();

    // Act
    getKeyCallback('ArrowDown')!();

    // Assert
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('does not navigate when mode is EDIT', () => {
    // Arrange
    vi.mocked(useParams).mockReturnValue({ id: 'item-1' });
    vi.mocked(useDataTable).mockReturnValue({
      ...defaultTableState,
      filteredData: [{ id: 'item-1' }, { id: 'item-2' }],
    } as any);
    renderTable({ mode: 'EDIT' as any });

    // Act
    getKeyCallback('ArrowDown')!();

    // Assert
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('uses "../nextId" path when mode is set to READ', () => {
    // Arrange
    vi.mocked(useParams).mockReturnValue({ id: 'item-1' });
    vi.mocked(useDataTable).mockReturnValue({
      ...defaultTableState,
      filteredData: [{ id: 'item-1' }, { id: 'item-2' }],
    } as any);
    renderTable({ mode: 'READ' as any });

    // Act
    getKeyCallback('ArrowDown')!();

    // Assert
    expect(navigateMock).toHaveBeenCalledWith('../item-2');
  });
});

// ─── Arrow Up navigation ───────────────────────────────────────────────────────

describe('ArrowUp navigation', () => {
  it('navigates to the previous item when not at the first item (mode undefined → "./" path)', () => {
    // Arrange
    vi.mocked(useParams).mockReturnValue({ id: 'item-2' });
    vi.mocked(useDataTable).mockReturnValue({
      ...defaultTableState,
      filteredData: [{ id: 'item-1' }, { id: 'item-2' }, { id: 'item-3' }],
    } as any);
    renderTable();

    // Act
    getKeyCallback('ArrowUp')!();

    // Assert
    expect(navigateMock).toHaveBeenCalledWith('./item-1');
  });

  it('does not navigate when already at the first item', () => {
    // Arrange
    vi.mocked(useParams).mockReturnValue({ id: 'item-1' });
    vi.mocked(useDataTable).mockReturnValue({
      ...defaultTableState,
      filteredData: [{ id: 'item-1' }, { id: 'item-2' }, { id: 'item-3' }],
    } as any);
    renderTable();

    // Act
    getKeyCallback('ArrowUp')!();

    // Assert
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('uses "../prevId" path when mode is set to READ', () => {
    // Arrange
    vi.mocked(useParams).mockReturnValue({ id: 'item-2' });
    vi.mocked(useDataTable).mockReturnValue({
      ...defaultTableState,
      filteredData: [{ id: 'item-1' }, { id: 'item-2' }],
    } as any);
    renderTable({ mode: 'READ' as any });

    // Act
    getKeyCallback('ArrowUp')!();

    // Assert
    expect(navigateMock).toHaveBeenCalledWith('../item-1');
  });
});

// ─── Pagination buttons ────────────────────────────────────────────────────────

describe('Pagination buttons', () => {
  it('First and Previous page buttons are disabled when on page 0', () => {
    // Arrange
    vi.mocked(useDataTable).mockReturnValue({
      ...defaultTableState,
      page: 0,
      pageCount: 3,
      disabled: false,
    } as any);

    // Act
    renderTable();

    // Assert
    expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Previous page' }),
    ).toBeDisabled();
  });

  it('Next and Last page buttons are disabled when on the last page', () => {
    // Arrange
    vi.mocked(useDataTable).mockReturnValue({
      ...defaultTableState,
      page: 2,
      pageCount: 3,
      disabled: false,
    } as any);

    // Act
    renderTable();

    // Assert
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Last page' })).toBeDisabled();
  });
});
