import { PageContentProps } from '..';
import PortalForm from '../PortalForm';
import WebEditGeneralContentFields from './WebEditGeneralContentFields';
import {
  generalContentSchema,
  initGeneralContent,
} from '@data/webedit/general/form';
import { Mode } from '@components/DataForm';
import WebEditGeneralContentFilters from './WebEditGeneralContentFilters';
import { PortalLangSelect, usePortalLang } from '../PortalLang';
import PortalToolbar from '../PortalToolbar';
import PortalContent from '../PortalContent';
import PortalTable from '../PortalTable';
import WebEditGeneralContentActions from './WebEditGeneralContentActions';
import useColumns from './useColumns';
import { useParams } from 'react-router-dom';
import {
  useGeneralContentQ,
  useGeneralContentsQ,
} from '@data/webedit/general/queries';
import { useEditGeneralContentM } from '@data/webedit/general/mutations';
import * as DataForm from '@components/DataForm';
import * as DataTable from '@components/DataTable';

export default function PortalWebEditGeneralContents({
  mode,
}: PageContentProps) {
  const { id = '' } = useParams();
  const { selectedLang } = usePortalLang();

  // Queries
  const generalContentsQ = useGeneralContentsQ({ lang: selectedLang });
  const generalContentQ = useGeneralContentQ({ id, lang: selectedLang });

  const editGeneralContentM = useEditGeneralContentM();

  const columns = useColumns();

  return (
    <DataTable.Provider
      key="generalContents"
      tableKey="generalContents"
      disabled={mode && mode !== Mode.READ}
      data={generalContentsQ.data}
    >
      <PortalToolbar dataLabel="generalContent">
        <WebEditGeneralContentFilters />
        <PortalLangSelect entity="shop" className="ml-auto" />
      </PortalToolbar>

      <PortalContent>
        <PortalTable
          columns={columns}
          isLoading={generalContentsQ.isLoading}
          error={generalContentsQ.error}
          actionsComponent={WebEditGeneralContentActions}
          data={generalContentsQ.data}
          mode={mode}
        />

        {mode && (
          <DataForm.Provider
            mode={mode}
            isLoading={generalContentQ.isLoading}
            data={generalContentQ.data}
            zodSchema={generalContentSchema}
            initCreateBody={initGeneralContent}
          >
            <PortalForm
              dataLabel="generalContent"
              error={generalContentQ.error}
              saveMutation={editGeneralContentM.mutateAsync}
              isSubmitting={editGeneralContentM.isLoading}
              toToolbarName={(body) =>
                body && body.id ? `General Content: ${body.name}` : ''
              }
            >
              <WebEditGeneralContentFields />
            </PortalForm>
          </DataForm.Provider>
        )}
      </PortalContent>
    </DataTable.Provider>
  );
}
