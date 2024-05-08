import { useParams } from 'react-router-dom';

import { initLocation, locationZ } from '@data/location/form';
import { useCreateLocationM, useEditLocationM } from '@data/location/mutations';
import { useLocationQ, useLocationsQ } from '@data/location/queries';

import * as DataForm from '@components/DataForm';
import { Mode } from '@components/DataForm';
import * as DataTable from '@components/DataTable';

import { PageContentProps } from '..';
import PortalContent from '../PortalContent';
import PortalForm from '../PortalForm';
import PortalTable from '../PortalTable';
import PortalToolbar from '../PortalToolbar';

import ShopLocationsActions from './AdminLocationsActions';
import ShopLocationsFields from './AdminLocationsFields';
import ShopLocationsFilters from './AdminLocationsFilters';
import useColumns from './useColumns';

//

export default function PortalShopLocations({ mode }: PageContentProps) {
  const { id = '' } = useParams();

  const locationsQ = useLocationsQ();
  const locationQ = useLocationQ({ id });
  const createLocationM = useCreateLocationM();
  const editLocationM = useEditLocationM();

  const columns = useColumns();

  return (
    <DataTable.Provider
      key="locations"
      tableKey="locations"
      disabled={mode && mode !== Mode.READ}
      data={locationsQ.data}
    >
      <PortalToolbar dataLabel="location">
        <ShopLocationsFilters />
      </PortalToolbar>
      <PortalContent>
        <PortalTable
          actionsComponent={ShopLocationsActions}
          columns={columns}
          isLoading={locationsQ.isLoading}
          error={locationsQ.error}
        />
        {mode && (
          <DataForm.Provider
            mode={mode}
            isLoading={locationQ.isLoading}
            data={locationQ.data}
            zodSchema={locationZ}
            initCreateBody={initLocation}
          >
            <PortalForm
              dataLabel="Location"
              error={locationQ.error}
              isSubmitting={
                createLocationM.isLoading || editLocationM.isLoading
              }
              saveMutation={editLocationM.mutateAsync}
              createMutation={createLocationM.mutateAsync}
            >
              <ShopLocationsFields />
            </PortalForm>
          </DataForm.Provider>
        )}
      </PortalContent>
    </DataTable.Provider>
  );
}
