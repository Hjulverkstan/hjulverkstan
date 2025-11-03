import { useMemo } from 'react';

import * as DataTable from '@components/DataTable';
import IconLabel from '@components/IconLabel';
import { Story } from '@data/webedit/story/types';
import { Global } from '@data/webedit/types';
import { TiptapContentAsText } from '@components/TiptapContentAsText';

import { usePortalWebEditLang } from '../PortalWebEditLang';
import { PortalWebEditTranslationSortHead } from '../PortalWebEditTranslationSortHead';

//

export default function useColumns() {
  const lang = usePortalWebEditLang();

  return useMemo(
    () =>
      [
        {
          key: 'title',
          name: 'Title',
          renderFn: ({ title }) => <IconLabel label={title} />,
        },

        {
          key: 'slug',
          name: 'Slug',
          renderFn: ({ slug }) => <IconLabel label={slug} />,
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
            ] as Array<DataTable.Column<Story>>)
          : []),
      ] as Array<DataTable.Column<Story>>,
    [lang],
  );
}
