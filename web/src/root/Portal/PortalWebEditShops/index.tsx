import { useParams } from 'react-router-dom';

import { createShopZ, initShop } from '@data/webedit/shop/form';
import { useCreateShopM, useEditShopM } from '@data/webedit/shop/mutations';
import { useShopQ, useShopsQ } from '@data/webedit/shop/queries';
import { Shop } from '@data/webedit/shop/types';
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

import WebEditShopsActions from './WebEditShopsActions';
import WebEditShopsFields from './WebEditShopsFields';
import WebEditShopsFilters from './WebEditShopsFilters';
import useColumns from './useColumns';

//

export default function PortalWebEditShops({ mode }: PortalAppPageProps) {
  const lang = usePortalWebEditLang();
  const { id = '' } = useParams();

  const ShopsQ = useShopsQ({ lang });
  const ShopQ = useShopQ({ id, lang });
  const editShopM = useEditShopM();
  const createShopM = useCreateShopM();

  const columns = useColumns();

  return (
    <DataTable.Provider
      key="Shops"
      tableKey="Shops"
      disabled={mode && mode !== Mode.READ}
      data={ShopsQ.data}
    >
      <PortalToolbar dataLabel="Shop" disableCreate={lang !== Global}>
        <WebEditShopsFilters />
      </PortalToolbar>
      <PortalContent>
        <PortalTable
          actionsComponent={WebEditShopsActions}
          columns={columns}
          isLoading={ShopsQ.isLoading}
          error={ShopsQ.error}
          mode={mode}
        />
        {mode && (
          <DataForm.Provider
            mode={mode}
            isLoading={ShopQ.isLoading}
            data={ShopQ.data || initShop}
            zodSchema={createShopZ(lang)}
          >
            <PortalForm
              dataLabel="Shop"
              toToolbarName={({ name }: Shop) => name}
              error={ShopQ.error}
              isSubmitting={editShopM.isPending || createShopM.isPending}
              saveMutation={editShopM.mutateAsync}
              createMutation={createShopM.mutateAsync}
              transformBodyOnSubmit={(body) => ({ ...body, lang })}
            >
              <WebEditShopsFields />
            </PortalForm>
          </DataForm.Provider>
        )}
      </PortalContent>
    </DataTable.Provider>
  );
}
