import { useMemo } from 'react';
import { GeneralContent } from '@data/webedit/general/types';
import * as DataTable from '@components/DataTable';
import IconLabel from '@components/IconLabel';

export default function useColumns() {
  return useMemo(
    () =>
      [
        {
          key: 'name',
          name: 'Name',
          renderFn: ({ name }) => <IconLabel label={name} />,
        },
        {
          key: 'key',
          name: 'Key',
          renderFn: ({ key }) => <IconLabel label={key} />,
        },
        {
          key: 'value',
          name: 'Value',
          renderFn: ({ value }) => <IconLabel label={value} />,
        },
        {
          key: 'description',
          name: 'Description',
          renderFn: ({ description }) => <IconLabel label={description} />,
        },
      ] as Array<DataTable.Column<GeneralContent>>,
    [],
  );
}
