import React, { useCallback } from 'react';
import { CalendarIcon } from 'lucide-react';

import * as DataTable from '@components/DataTable';
import * as Select from '@components/shadcn/Select';
import usePersistentState from '@hooks/usePersistentState';
import usePortalSlugs from '@hooks/useSlugs';

export interface PortalFilterDateProps {
  filterOptions: {
    label: string;
    dataKeyFrom: string;
    dataKeyTo?: string;
  }[];
  shouldClearPersistedState?: boolean;
}

export const PortalFilterDate = ({
  filterOptions,
  shouldClearPersistedState,
}: PortalFilterDateProps) => {
  const { appSlug, pageSlug } = usePortalSlugs();
  const [selectedFilter, setSelectedFilter] = usePersistentState<string>(
    `${appSlug}-${pageSlug}-portalFilterDateSelect`,
    (fromStore) => (shouldClearPersistedState ? '' : (fromStore ?? '')),
  );

  const selectedOption = filterOptions.find(
    (option) => option.label === selectedFilter,
  );

  const onClear = useCallback(() => setSelectedFilter(''), []);

  return (
    <DataTable.FilterPopover
      label={<CalendarIcon className="h-4 w-4" />}
      withoutCmdk={true}
      hideIcon={true}
    >
      <div className="w-full p-1">
        <Select.Root value={selectedFilter} onValueChange={setSelectedFilter}>
          <Select.Trigger>
            <Select.Value placeholder="Select column..." />
          </Select.Trigger>
          <Select.Content>
            {filterOptions.map((option) => (
              <Select.Item key={option.label} value={option.label}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        <DataTable.FilterDate
          disabled={!selectedOption}
          dataKeyFrom={selectedOption?.dataKeyFrom}
          dataKeyTo={selectedOption?.dataKeyTo || selectedOption?.dataKeyFrom}
          filterKey="portal"
          shouldClearPersistedState={shouldClearPersistedState}
          onClear={onClear}
        />
      </div>
    </DataTable.FilterPopover>
  );
};
