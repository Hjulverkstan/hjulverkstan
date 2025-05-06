import PortalForm from '../PortalForm';
import WebEditGeneralContentFields from './WebEditGeneralContentFields';
import {
  generalContentZ,
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
import { PageContentProps } from '../index';

export default function PortalWebEditGeneralContents({
  mode,
}: PageContentProps) {
  const { id = '' } = useParams();
  const { selectedLang } = usePortalLang();

  const generalContentsQ = useGeneralContentsQ();
  const generalContentQ = useGeneralContentQ({ id });
  const editGeneralContentM = useEditGeneralContentM();
  const columns = useColumns();

  return (
    <DataTable.Provider
      key="generalContents"
      tableKey="generalContents"
      disabled={mode && mode !== Mode.READ}
      data={generalContentsQ.data}
    >
      <PortalToolbar dataLabel="generalContent" hideCreateButton={true}>
        <WebEditGeneralContentFilters />
        <PortalLangSelect entity="generalcontent" className="ml-auto" />
      </PortalToolbar>
      <PortalContent>
        <PortalTable
          actionsComponent={WebEditGeneralContentActions}
          columns={columns}
          isLoading={generalContentsQ.isLoading}
          error={generalContentsQ.error}
          data={generalContentsQ.data}
          mode={mode}
        />
        {mode && (
          <DataForm.Provider
            mode={mode}
            isLoading={generalContentQ.isLoading}
            data={
              generalContentQ.data ? { ...generalContentQ.data } : undefined
            }
            zodSchema={generalContentZ}
            initCreateBody={{ ...initGeneralContent }}
          >
            <PortalForm
              dataLabel="generalContent"
              error={generalContentQ.error}
              saveMutation={(data) =>
                editGeneralContentM.mutateAsync({ ...data, lang: selectedLang })
              }
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
