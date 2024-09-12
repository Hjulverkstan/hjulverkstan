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

import AdminLocationsActions from './AdminLocationsActions';
import AdminLocationsFields from './AdminLocationsFields';
import AdminLocationsFilters from './AdminLocationsFilters';
import useColumns from './useColumns';
import { Location } from '@data/location/types';

//

export default function PortalAdminLocations({ mode }: PageContentProps) {
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
        <AdminLocationsFilters />
      </PortalToolbar>
      <PortalContent>
        <PortalTable
          actionsComponent={AdminLocationsActions}
          columns={columns}
          isLoading={locationsQ.isLoading}
          error={locationsQ.error}
          mode={mode}
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
              toToolbarName={(body: Location) => body.name}
              error={locationQ.error}
              isSubmitting={
                createLocationM.isLoading || editLocationM.isLoading
              }
              saveMutation={editLocationM.mutateAsync}
              createMutation={createLocationM.mutateAsync}
            >
              <AdminLocationsFields />
            </PortalForm>
          </DataForm.Provider>
        )}
      </PortalContent>
    </DataTable.Provider>
  );
}
