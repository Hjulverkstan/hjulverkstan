import { ComponentType, ReactNode, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { SearchX } from 'lucide-react';

import * as U from '@utils';
import * as DataTable from '@components/DataTable';
import { useDataTable } from '@components/DataTable';
import Message from '@components/Message';
import Error from '@components/Error';
import Spinner from '@components/Spinner';
import { StandardError } from '@data/api';
import { IconButton } from '@components/shadcn/Button';
import useKeyPress from '@hooks/useKeyPress';
import { Mode } from '@components/DataForm';

export interface PortalTableActionsProps<Row> {
  row: Row;
  disabled: boolean;
  x: number;
  y: number;
}

export interface PortalTableProps
  extends Pick<DataTable.BodyProps, 'columns' | 'renderRowActionFn'> {
  isLoading: boolean;
  error?: StandardError | null;
  mode?: Mode;
  actionsComponent: ComponentType<PortalTableActionsProps<any>>;
}

export default function PortalTable({
  isLoading,
  error,
  columns,
  mode,
  actionsComponent: Actions,
}: PortalTableProps) {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const {
    page,
    pageCount,
    rawData,
    filteredData,
    isFiltered,
    pageSize,
    setPage,
  } = useDataTable();

  const noFilterResults =
    !!rawData?.length && isFiltered && !filteredData?.length;

  useEffect(() => {
    if (id && rawData.length > 0) {
      const selectedIndex = filteredData.findIndex((item) => item.id === id);
      if (selectedIndex !== -1) {
        const correctPage = Math.floor(selectedIndex / pageSize);
        setPage(correctPage);
      }
    }
  }, [id, filteredData, pageSize, setPage]);

  const canNavigateWithArrrows = mode === undefined || mode === Mode.READ;
  const selectedIndex = filteredData.findIndex((item) => item.id === id);

  useKeyPress('ArrowDown', () => {
    if (!canNavigateWithArrrows) return;

    const nextIndex = selectedIndex + 1;
    if (nextIndex < filteredData.length) {
      const nextId = filteredData[nextIndex].id;
      navigate(mode ? `../${nextId}` : `./${nextId}`);
    }
  });

  useKeyPress('ArrowUp', () => {
    if (!canNavigateWithArrrows) return;

    const nextIndex = selectedIndex - 1;
    if (nextIndex >= 0) {
      const nextId = filteredData[nextIndex].id;
      navigate(mode ? `../${nextId}` : `./${nextId}`);
    }
  });

  return (
    <div className="flex min-w-0 flex-grow flex-col">
      <div className="flex flex-grow flex-col overflow-auto">
        <DataTable.Root
          divClassName={U.cn(!error && !noFilterResults && 'flex-grow')}
        >
          <DataTable.Header columns={columns} />
          {isLoading ? (
            <DataTable.BodySkeleton columns={columns} />
          ) : !error && !noFilterResults ? (
            <DataTable.Body
              columns={columns}
              renderRowActionFn={(row, metadata) => (
                <Actions row={row} {...metadata} />
              )}
              selected={id}
              setSelected={(nextId) => navigate(id ? '../' + nextId : nextId)}
            />
          ) : null}
        </DataTable.Root>
        {noFilterResults && (
          <Message
            className="flex-grow"
            icon={SearchX}
            message="The filters applied do not give any matches. Reset or remove those filters that contradict each other."
          />
        )}
        {error && <Error className="flex-grow" error={error} />}
      </div>
      <Pagination>
        <div className="flex items-center gap-1">
          <div
            className="text-muted-foreground items-center pl-2 text-sm
              font-normal"
          >
            Page {page + 1} of {pageCount} -{' '}
            {filteredData.length < pageSize ? (
              <>Showing {filteredData.length} of </>
            ) : (
              <>Showing {pageSize} of </>
            )}
            {isFiltered ? (
              <>
                {filteredData.length} filtered items ({rawData.length} total)
              </>
            ) : (
              <>{rawData.length} items.</>
            )}
          </div>
          <Spinner visible={isLoading} />
        </div>
      </Pagination>
    </div>
  );
}

//

export function Pagination({ children }: { children: ReactNode }) {
  const { disabled, page, pageCount, setPage } = useDataTable();

  return (
    <div
      className="border-accent/80 flex h-11 items-center justify-between
        border-t p-2"
    >
      {children}
      <div className="flex items-center">
        <IconButton
          variant="ghost"
          onClick={() => setPage(0)}
          disabled={disabled || page === 0}
          icon={DoubleArrowLeftIcon}
          tooltip="First page"
        />
        <IconButton
          variant="ghost"
          onClick={() => setPage(page - 1)}
          disabled={disabled || page === 0}
          icon={ChevronLeftIcon}
          tooltip="Previous page"
        />
        <IconButton
          variant="ghost"
          onClick={() => setPage(page + 1)}
          disabled={disabled || page >= pageCount - 1}
          icon={ChevronRightIcon}
          tooltip="Next page"
        />
        <IconButton
          variant="ghost"
          onClick={() => setPage(pageCount - 1)}
          disabled={disabled || page >= pageCount - 1}
          icon={DoubleArrowRightIcon}
          tooltip="Last page"
        />
      </div>
    </div>
  );
}
