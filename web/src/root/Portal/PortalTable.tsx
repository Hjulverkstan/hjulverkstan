import { useNavigate, useParams } from 'react-router-dom';

import * as DataTable from '@components/DataTable';
import { useDataTable } from '@components/DataTable';
import Error from '@components/Error';
import Spinner from '@components/Spinner';
import { ErrorRes } from '@api';

export interface PortalTableProps
  extends Pick<DataTable.BodyProps, 'columns' | 'renderRowActionFn'> {
  isLoading: boolean;
  error?: ErrorRes | null;
}

export default function PortalTable({
  isLoading,
  error,
  columns,
  renderRowActionFn,
}: PortalTableProps) {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const { page, pageCount } = useDataTable();

  return (
    <div className="flex flex-grow flex-col rounded-md border">
      <div className="flex flex-grow flex-col overflow-hidden rounded-md">
        <DataTable.Root className="h-full">
          <DataTable.Header columns={columns} />
          {isLoading ? (
            <DataTable.BodySkeleton columns={columns} />
          ) : !error ? (
            <DataTable.Body
              columns={columns}
              renderRowActionFn={renderRowActionFn}
              selected={id}
              setSelected={(nextId) => navigate(id ? '../' + nextId : nextId)}
            />
          ) : null}
        </DataTable.Root>
        {error ? (
          <Error className="flex-grow" error={error} />
        ) : (
          <div className="flex-grow" />
        )}
        <DataTable.Pagination>
          <div className="flex items-center gap-1">
            <div
              className="items-center pl-2 text-sm font-normal
                text-muted-foreground"
            >
              Page {page + 1} of {pageCount}
            </div>
            <Spinner visible={isLoading} />
          </div>
        </DataTable.Pagination>
      </div>
    </div>
  );
}
