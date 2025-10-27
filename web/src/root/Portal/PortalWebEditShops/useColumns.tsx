import { useMemo } from 'react';

import * as DataTable from '@components/DataTable';
import IconLabel from '@components/IconLabel';
import { Shop } from '@data/webedit/shop/types';
import { Global } from '@data/webedit/types';
import { usePortalWebEditLang } from '../PortalWebEditLang';
import { PortalWebEditTranslationSortHead } from '../PortalWebEditTranslationSortHead';
import { TiptapContentAsText } from '@components/TiptapContentAsText';

//

export default function useColumns() {
  const lang = usePortalWebEditLang();

  return useMemo(
    () =>
      [
        {
          key: 'name',
          name: 'Name',
          renderFn: ({ name }) => <IconLabel label={name} />,
        },

        {
          key: 'address',
          name: 'Address',
          renderFn: ({ address }) => <IconLabel label={address} />,
        },

        ...(lang != Global
          ? ([
              {
                key: 'bodyText',
                name: 'Body text',
                renderFn: ({ bodyText }) => (
                  <span className="text-muted-foreground">
                    <TiptapContentAsText content={bodyText} max={60} />
                  </span>
                ),
                renderHeaderFn: () => (
                  <PortalWebEditTranslationSortHead
                    colKey="bodyText"
                    label="Body Text"
                  />
                ),
              },
            ] as Array<DataTable.Column<Shop>>)
          : []),

        {
          key: 'latitude',
          name: 'Latitude',
          renderFn: ({ latitude }) => <IconLabel label={latitude} />,
        },
        {
          key: 'longitude',
          name: 'Longitude',
          renderFn: ({ latitude }) => <IconLabel label={latitude} />,
        },
      ] as Array<DataTable.Column<Shop>>,
    [lang],
  );
}
