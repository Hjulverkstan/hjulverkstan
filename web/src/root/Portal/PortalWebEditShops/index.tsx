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

  const shopsQ = useShopsQ();
  const shopQ = useShopQ({ id });

  const editShopM = useEditShopM();
  const createShopM = useCreateShopM();

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
            data={
              shopQ.data
                ? {
                    ...shopQ.data,
                    'openHours.mon': shopQ.data.openHours.mon,
                    'openHours.tue': shopQ.data.openHours.tue,
                    'openHours.wed': shopQ.data.openHours.wed,
                    'openHours.thu': shopQ.data.openHours.thu,
                    'openHours.fri': shopQ.data.openHours.fri,
                    'openHours.sat': shopQ.data.openHours.sat,
                    'openHours.sun': shopQ.data.openHours.sun,
                  }
                : undefined
            }
            zodSchema={shopZ}
            initCreateBody={initShop}
          >
            <PortalForm
              dataLabel="Shop"
              error={shopQ.error}
              saveMutation={(data) =>
                editShopM.mutateAsync({ ...data, lang: selectedLang })
              }
              createMutation={(data) =>
                createShopM.mutateAsync({ ...data, lang: selectedLang })
              }
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
