import { useParams } from 'react-router-dom';

import { PortalLangSelect, usePortalLang } from '../PortalLang';
import PortalToolbar from '../PortalToolbar';
import PortalContent from '../PortalContent';
import PortalTable from '../PortalTable';
import PortalForm from '../PortalForm';

import { PageContentProps } from '..';
import useColumns from './useColumns';

import { useShopsQ, useShopQ } from '@data/webedit/shop/queries';
import { useEditShopM, useCreateShopM } from '@data/webedit/shop/mutations';
import * as DataTable from '@components/DataTable';
import * as DataForm from '@components/DataForm';
import WebEditShopActions from '../PortalWebEditShops/WebEditShopActions';
import WebEditShopFilters from '../PortalWebEditShops/WebEditShopFilters';
import WebEditShopFields from '../PortalWebEditShops/WebEditShopFields';
import { initShop, shopZ } from '@data/webedit/shop/form';
import { Mode } from '@components/DataForm';

export default function PortalWebEditShops({ mode }: PageContentProps) {
  const { id = '' } = useParams();
  const { selectedLang } = usePortalLang();

  // Queries
  const shopsQ = useShopsQ({ lang: selectedLang });
  const shopQ = useShopQ({ id, lang: selectedLang });

  // Mutations
  const editShopM = useEditShopM();
  const createShopM = useCreateShopM();

  // Columns
  const columns = useColumns();

  return (
    <DataTable.Provider
      key="shops"
      tableKey="shops"
      disabled={mode && mode !== Mode.READ}
      data={shopsQ.data}
    >
      <PortalToolbar dataLabel="shop">
        <WebEditShopFilters />
        <PortalLangSelect entity="shop" className="ml-auto" />
      </PortalToolbar>
      <PortalContent>
        <PortalTable
          actionsComponent={WebEditShopActions}
          columns={columns}
          isLoading={shopsQ.isLoading}
          error={shopsQ.error}
          data={shopsQ.data}
          mode={mode}
        />

        {mode && (
          <DataForm.Provider
            mode={mode}
            isLoading={shopQ.isLoading}
            data={shopQ.data}
            zodSchema={shopZ}
            initCreateBody={initShop}
          >
            <PortalForm
              dataLabel="Shop"
              error={shopQ.error}
              saveMutation={editShopM.mutateAsync}
              createMutation={createShopM.mutateAsync}
              isSubmitting={editShopM.isLoading || createShopM.isLoading}
              toToolbarName={(body) =>
                body && body.id ? `Shop: ${body.name}` : ''
              }
            >
              <WebEditShopFields />
            </PortalForm>
          </DataForm.Provider>
        )}
      </PortalContent>
    </DataTable.Provider>
  );
}
