import { useParams } from 'react-router-dom';

import {
  useCreateGeneralContentM,
  useEditGeneralContentM,
} from '@data/webedit/general/mutations';
import {
  useGeneralContentQ,
  useGeneralContentsQ,
} from '@data/webedit/general/queries';

import * as DataForm from '@components/DataForm';
import { Mode } from '@components/DataForm';
import * as DataTable from '@components/DataTable';

import { PageContentProps } from '..';
import PortalContent from '../PortalContent';
import PortalForm from '../PortalForm';
import PortalTable from '../PortalTable';
import PortalToolbar from '../PortalToolbar';

import useColumns from './useColumns';
import { GeneralContent } from '@data/webedit/general/types';
import WebEditGeneralContentsFields from './WebEditGeneralContentFields';
import WebEditGeneralContentFilters from './WebEditGeneralContentFilters';

//

export default function PortalWebEditGeneralContents({
  mode,
}: PageContentProps) {
  const { id = '' } = useParams();

  const generalContentsQ = useGeneralContentsQ();
  const generalContentQ = useGeneralContentQ({ id });
  const creategeneralContentM = useCreateGeneralContentM();
  const editgeneralContentM = useEditGeneralContentM();

  const columns = useColumns();

  //Hook
  // const {
  //   data: count,
  //   isLoading: isCountLoading,
  //   error: countError,
  // } = useWebEditCountQ();

  return (
    <DataTable.Provider
      key="generalContents"
      tableKey="generalContents"
      disabled={mode && mode !== Mode.READ}
      data={generalContentsQ.data}
    >
      <PortalToolbar dataLabel="generalContent">
        <WebEditGeneralContentFilters />
      </PortalToolbar>
      <PortalContent>
        <PortalTable
          actionsComponent={null}
          columns={columns}
          isLoading={generalContentsQ.isLoading}
          error={generalContentsQ.error}
          mode={mode}
        />
        {mode && (
          <DataForm.Provider
            mode={mode}
            isLoading={generalContentQ.isLoading}
            data={generalContentQ.data}
          >
            <PortalForm
              toToolbarName={(body: GeneralContent) =>
                body.id && `${body.name} ${body.value}`
              }
              dataLabel="generalContent"
              error={generalContentQ.error}
              isSubmitting={
                creategeneralContentM.isLoading || editgeneralContentM.isLoading
              }
              saveMutation={editgeneralContentM.mutateAsync}
              createMutation={creategeneralContentM.mutateAsync}
            >
              <WebEditGeneralContentsFields />
            </PortalForm>
          </DataForm.Provider>
        )}
      </PortalContent>
    </DataTable.Provider>
  );
}
