import IconLabel from '@components/IconLabel';
import { Languages } from 'lucide-react';
import * as DataTable from '@components/DataTable';

export interface PortalWebEditLocalisedSortHeadProps {
  colKey: string;
  label: string;
}

export const PortalWebEditTranslationSortHead = ({
  colKey,
  label,
}: PortalWebEditLocalisedSortHeadProps) => (
  <DataTable.SortHead
    colKey={colKey}
    className="hover:bg-purple-fill text-purple-foreground
      hover:text-purple-foreground!"
  >
    <IconLabel
      className="text-purple-foreground"
      icon={Languages}
      label={label}
    />
  </DataTable.SortHead>
);
