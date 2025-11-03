import { ReactNode } from 'react';
import { PlusIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import * as DataTable from '@components/DataTable';
import { IconButton } from '@components/shadcn/Button';

export interface PortalToolbarProps {
  children: ReactNode;
  rightChildren?: ReactNode;
  dataLabel: string;
  hideCreate?: boolean;
  disableCreate?: boolean;
}

export default function PortalToolbar({
  disableCreate,
  hideCreate,
  children,
  rightChildren,
  dataLabel,
}: PortalToolbarProps) {
  const { id } = useParams();
  const { disabled } = DataTable.useDataTable();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between pb-4">
      <div className="flex flex-1 items-center space-x-2">
        {children}
        <DataTable.FilterClear />
      </div>
      <div className="flex flex-1 items-center justify-end space-x-2">
        <div>{rightChildren}</div>
        {!hideCreate && (
          <IconButton
            className="ml-2"
            variant="outline"
            disabled={disabled || disableCreate}
            onClick={() => navigate(id ? '../create' : 'create')}
            text={`Add ${dataLabel}`}
            icon={PlusIcon}
          />
        )}
      </div>
    </div>
  );
}
