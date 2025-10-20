import { useDataTable, Column, Row } from './';

import * as C from '@utils/common';
import * as Table from '@components/shadcn/Table';

export interface BodyProps {
  columns: Array<Column<any>>;
  selected?: string;
  setSelected?: (colId: string) => void;
  /** Provide content for the fixed right column */
  renderRowActionFn?: (
    row: Record<string, any>,
    metaData: { disabled: boolean; x: number; y: number; selected: boolean },
  ) => JSX.Element;
}

export const Body = ({
  columns,
  renderRowActionFn,
  selected = '',
  setSelected = () => {},
}: BodyProps) => {
  const { disabled, paginatedData, hiddenCols } = useDataTable();

  const visibleColumns = columns.filter(({ key }) => !hiddenCols.includes(key));

  const renderRow = (row: Row, y: number) => {
    const isSelected = row.id === selected;

    return (
      <Table.Row
        disabled={disabled}
        onClick={(e) =>
          !disabled &&
          (e.target as HTMLElement).tagName !== 'A' &&
          setSelected(row.id)
        }
        key={row.id}
        className="pl-4"
        isSelected={isSelected}
      >
        {visibleColumns.map(({ key, renderFn }, x) => (
          <Table.Cell
            key={key}
            className={C.cn(x === 0 && 'pl-4', disabled && 'opacity-50')}
          >
            {renderFn(row, { disabled, x, y, selected: isSelected })}
          </Table.Cell>
        ))}
        {renderRowActionFn && (
          <Table.Cell className="z20 sticky right-0 w-10 px-2">
            {renderRowActionFn(row, {
              disabled,
              y,
              selected: isSelected,
              x: visibleColumns.length,
            })}
          </Table.Cell>
        )}
      </Table.Row>
    );
  };

  return <Table.Body>{paginatedData.map(renderRow)}</Table.Body>;
};

Body.displayName = 'DataTableBody';
