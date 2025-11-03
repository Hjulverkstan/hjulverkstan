import { useParams } from 'react-router-dom';

import { createTextZ } from '@data/webedit/text/form';
import { useEditTextM } from '@data/webedit/text/mutations';
import { useTextQ, useTextsQ } from '@data/webedit/text/queries';
import { Text } from '@data/webedit/text/types';
import * as DataForm from '@components/DataForm';
import { Mode } from '@components/DataForm';
import * as DataTable from '@components/DataTable';
import * as enumsRaw from '@data/webedit/text/enums';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import { findEnum } from '@utils/enums';

import { PortalAppPageProps } from '..';
import PortalContent from '../PortalContent';
import PortalForm from '../PortalForm';
import PortalTable from '../PortalTable';
import PortalToolbar from '../PortalToolbar';
import { usePortalWebEditLang } from '../PortalWebEditLang';

import WebEditTextActions from './WebEditTextActions';
import WebEditTextFields from './WebEditTextFields';
import WebEditTextFilters from './WebEditTextFilters';
import useColumns from './useColumns';
import { Global } from '@data/webedit/types';

//

export default function PortalWebEditTexts({ mode }: PortalAppPageProps) {
  const enums = useTranslateRawEnums(enumsRaw);
  const lang = usePortalWebEditLang();
  const { id = '' } = useParams();

  const TextsQ = useTextsQ({ lang });
  const TextQ = useTextQ({ id, lang });
  const editTextM = useEditTextM();

  const columns = useColumns();

  return (
    <DataTable.Provider
      key="Texts"
      tableKey="Texts"
      disabled={mode && mode !== Mode.READ}
      data={TextsQ.data}
    >
      <PortalToolbar dataLabel="Text" hideCreate>
        <WebEditTextFilters />
      </PortalToolbar>
      <PortalContent>
        <PortalTable
          actionsComponent={WebEditTextActions}
          columns={columns}
          isLoading={TextsQ.isLoading}
          error={TextsQ.error}
          mode={mode}
        />
        {mode && (
          <DataForm.Provider
            mode={mode}
            isLoading={TextQ.isLoading}
            data={TextQ.data}
            zodSchema={createTextZ(lang)}
          >
            <PortalForm
              dataLabel="Text"
              toToolbarName={({ key }: Text) =>
                key && findEnum(enums, key).label
              }
              error={TextQ.error}
              isSubmitting={editTextM.isPending}
              saveMutation={editTextM.mutateAsync}
              disableEdit={
                lang == Global && 'Edit only available for translations'
              }
              transformBodyOnSubmit={(body) => ({ ...body, lang })}
            >
              <WebEditTextFields />
            </PortalForm>
          </DataForm.Provider>
        )}
      </PortalContent>
    </DataTable.Provider>
  );
}
