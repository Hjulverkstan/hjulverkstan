import React, { useState } from 'react';
import * as DataTable from '@components/DataTable';
import { Root, Trigger, Content, Item, Value } from '@components/shadcn/Select'; // Importera nödvändiga Select-komponenter
import { CalendarIcon } from 'lucide-react';

export interface PortalFilterDateProps {
  fields: { label: string; dataKeyFrom: string; dataKeyTo?: string }[];
  filterKey: string;
  label?: React.ReactNode;
}

export const PortalFilterDate = ({
  fields,
  filterKey,
  label,
}: PortalFilterDateProps) => {
  const [selectedField, setSelectedField] = useState(fields[0]);

  return (
    <DataTable.FilterPopover
      label={label || <CalendarIcon className="h-4 w-4" />}
    >
      <Root
        value={selectedField.dataKeyFrom}
        onValueChange={(value) => {
          const field = fields.find((field) => field.dataKeyFrom === value);
          setSelectedField(field || fields[0]);
        }}
      >
        <Trigger>
          <Value placeholder="Select a field">{selectedField.label}</Value>
        </Trigger>
        <Content>
          {fields.map((field) => (
            <Item key={field.dataKeyFrom} value={field.dataKeyFrom}>
              {field.label}
            </Item>
          ))}
        </Content>
      </Root>

      <DataTable.FilterDate
        dataKeyFrom={selectedField.dataKeyFrom}
        dataKeyTo={selectedField.dataKeyTo || selectedField.dataKeyFrom}
        filterKey={filterKey}
        label="Filter by date"
      />
    </DataTable.FilterPopover>
  );
};
