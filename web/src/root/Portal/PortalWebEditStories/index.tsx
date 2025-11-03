import { useParams } from 'react-router-dom';

import { createStoryZ } from '@data/webedit/story/form';
import { useCreateStoryM, useEditStoryM } from '@data/webedit/story/mutations';
import { useStoriesQ, useStoryQ } from '@data/webedit/story/queries';
import { Story } from '@data/webedit/story/types';
import * as DataForm from '@components/DataForm';
import { Mode } from '@components/DataForm';
import * as DataTable from '@components/DataTable';
import { Global } from '@data/webedit/types';

import { PortalAppPageProps } from '..';
import PortalContent from '../PortalContent';
import PortalForm from '../PortalForm';
import PortalTable from '../PortalTable';
import PortalToolbar from '../PortalToolbar';
import { usePortalWebEditLang } from '../PortalWebEditLang';

import WebEditStoriesActions from './WebEditStoriesActions';
import WebEditStoriesFields from './WebEditStoriesFields';
import WebEditStoriesFilters from './WebEditStoriesFilters';
import useColumns from './useColumns';

//

export default function PortalWebEditStories({ mode }: PortalAppPageProps) {
  const lang = usePortalWebEditLang();
  const { id = '' } = useParams();

  const storiesQ = useStoriesQ({ lang });
  const storyQ = useStoryQ({ id, lang });
  const editStoryM = useEditStoryM();
  const createStoryM = useCreateStoryM();

  const columns = useColumns();

  return (
    <DataTable.Provider
      key="Stories"
      tableKey="Stories"
      disabled={mode && mode !== Mode.READ}
      data={storiesQ.data}
    >
      <PortalToolbar dataLabel="Story" disableCreate={lang !== Global}>
        <WebEditStoriesFilters />
      </PortalToolbar>
      <PortalContent>
        <PortalTable
          actionsComponent={WebEditStoriesActions}
          columns={columns}
          isLoading={storiesQ.isLoading}
          error={storiesQ.error}
          mode={mode}
        />
        {mode && (
          <DataForm.Provider
            mode={mode}
            isLoading={storyQ.isLoading}
            data={storyQ.data}
            zodSchema={createStoryZ(lang)}
          >
            <PortalForm
              dataLabel="Story"
              toToolbarName={({ title }: Story) => title}
              error={storyQ.error}
              isSubmitting={editStoryM.isPending || createStoryM.isPending}
              saveMutation={editStoryM.mutateAsync}
              createMutation={createStoryM.mutateAsync}
              transformBodyOnSubmit={(body) => ({ ...body, lang })}
            >
              <WebEditStoriesFields />
            </PortalForm>
          </DataForm.Provider>
        )}
      </PortalContent>
    </DataTable.Provider>
  );
}
