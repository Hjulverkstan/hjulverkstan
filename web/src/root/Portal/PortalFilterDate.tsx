import React, { useState } from 'react';
import * as DataTable from '@components/DataTable';

export interface PortalFilterDateProps {
  label: React.ReactNode;
  filterOptions: { label: string; dataKeyFrom: string; dataKeyTo?: string }[];
  withoutCmdk?: boolean;
  hideIcon?: boolean;
}

export const PortalFilterDate = ({
  label,
  filterOptions,
  withoutCmdk = true,
  hideIcon = true,
}: PortalFilterDateProps) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('');

  const handleFilterSelection = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedFilter(event.target.value);
  };

  const selectedOption = filterOptions.find(
    (option) => option.label === selectedFilter,
  );

  return (
    <DataTable.FilterPopover
      label={label}
      withoutCmdk={withoutCmdk}
      hideIcon={hideIcon}
    >
      <select
        value={selectedFilter}
        onChange={handleFilterSelection}
        className="w-full"
      >
        {filterOptions.map((option) => (
          <option key={option.label} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
      {selectedOption && (
        <div className="mt-4">
          <DataTable.FilterDate
            dataKeyFrom={selectedOption.dataKeyFrom}
            dataKeyTo={selectedOption.dataKeyTo || selectedOption.dataKeyFrom}
            filterKey={selectedOption.label}
            label={label}
            withoutCmdk={withoutCmdk}
            hideIcon={hideIcon}
          />
        </div>
      )}
    </DataTable.FilterPopover>
  );
};
