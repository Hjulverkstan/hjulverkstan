import { useNavigate, useParams } from 'react-router-dom';

import * as DataTable from '@components/DataTable';
import Error from '@components/Error';

export interface PortalTableProps
  extends Pick<DataTable.BodyProps, 'columns' | 'renderRowActionFn'> {
  isLoading: boolean;
  error?: string | null;
}

export default function PortalTable({
  isLoading,
  error,
  columns,
  renderRowActionFn,
}: PortalTableProps) {
  const navigate = useNavigate();
  const { id = '' } = useParams();
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
          <Error
            className="flex-grow"
            msg="There was an error fetching the data."
          />
        ) : (
          <div className="flex-grow" />
        )}
        <DataTable.Pagination />
      </div>
    </div>
  );
}
