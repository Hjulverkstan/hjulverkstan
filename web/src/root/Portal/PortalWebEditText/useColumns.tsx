import { useMemo } from 'react';

import { Text } from '@data/webedit/text/types';
import * as enumsRaw from '@data/webedit/text/enums';
import * as DataTable from '@components/DataTable';
import IconLabel from '@components/IconLabel';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import { findEnum } from '@utils/enums';
import { Global } from '@data/webedit/types';

import { usePortalWebEditLocale } from '../PortalWebEditLocale';
import { PortalWebEditLocalisedSortHead } from '../PortalWebEditLocalisedSortHead';

//

export default function useColumns() {
  const enums = useTranslateRawEnums(enumsRaw);
  const locale = usePortalWebEditLocale();

  return useMemo(
    () =>
      [
        {
          key: 'name',
          name: 'Name',
          renderFn: ({ key }) => (
            <IconLabel label={findEnum(enums, key).label} />
          ),
        },

        ...(locale != Global
          ? ([
              {
                key: 'value',
                name: 'Value',
                renderFn: ({ value }) => (
                  <span className="text-muted-foreground text-elipsis">
                    {value}
                  </span>
                ),
                renderHeaderFn: () => (
                  <PortalWebEditLocalisedSortHead
                    colKey="value"
                    label="Value"
                  />
                ),
              },
            ] as Array<DataTable.Column<Text>>)
          : []),
      ] as Array<DataTable.Column<Text>>,
    [locale],
  );
}
