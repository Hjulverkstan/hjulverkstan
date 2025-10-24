import { useParams } from 'react-router-dom';

import * as enumsRaw from '@data/vehicle/enums';
import { useLocationsQ } from '@data/location/queries';
import { initVehicle, useVehicleZ } from '@data/vehicle/form';
import { useCreateVehicleM, useEditVehicleM } from '@data/vehicle/mutations';
import { useVehicleQ, useVehiclesAggregatedQ } from '@data/vehicle/queries';
import { useDeleteImageM } from '@data/image/mutations';

import * as DataTable from '@components/DataTable';
import * as DataForm from '@components/DataForm';
import { Mode } from '@components/DataForm';

import PortalContent from '../PortalContent';
import PortalForm from '../PortalForm';
import PortalTable from '../PortalTable';
import PortalToolbar from '../PortalToolbar';
import { PortalAppPageProps } from '..';

import ShopInventoryActions from './ShopInventoryActions';
import ShopInventoryFilters from './ShopInventoryFilters';
import ShopInventoryFields from './ShopInventoryFields';
import useColumns from './useColumns';
import { Vehicle } from '@data/vehicle/types';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import { findEnum } from '@utils/enums';

//

export default function PortalShopInventory({ mode }: PortalAppPageProps) {
  const { id = '' } = useParams();

  const enums = useTranslateRawEnums(enumsRaw);

  const vehiclesQ = useVehiclesAggregatedQ();
  const vehicleQ = useVehicleQ({ id });
  const createVehicleM = useCreateVehicleM();
  const editVehicleM = useEditVehicleM();
  const locationsQ = useLocationsQ(); // <Fields /> doesn't handle error/loading
  const deleteImageM = useDeleteImageM();

  const columns = useColumns();
  const vehicleZ = useVehicleZ();

  return (
    <DataTable.Provider
      key="vehicles"
      tableKey="vehicles"
      disabled={mode && mode !== Mode.READ}
      data={vehiclesQ.data}
    >
      <PortalToolbar dataLabel="vehicle">
        <ShopInventoryFilters />
      </PortalToolbar>
      <PortalContent>
        <PortalTable
          actionsComponent={ShopInventoryActions}
          columns={columns}
          isLoading={vehiclesQ.isLoading || locationsQ.isLoading}
          error={vehiclesQ.error || locationsQ.error}
          mode={mode}
        />
        {mode && (
          <DataForm.Provider
            mode={mode}
            isLoading={vehicleQ.isLoading || locationsQ.isLoading}
            data={vehicleQ.data}
            zodSchema={vehicleZ}
            initCreateBody={initVehicle}
          >
            <PortalForm
              dataLabel="Vehicle"
              toToolbarName={(body: Vehicle) =>
                (body.regTag &&
                  `${findEnum(enums, body.vehicleType).label} ${body.regTag}`) ||
                (body.id &&
                  `${findEnum(enums, body.vehicleType).label} #${body.id}`)
              }
              error={vehicleQ.error || locationsQ.error}
              isSubmitting={createVehicleM.isPending || editVehicleM.isPending}
              saveMutation={({ tempDeleteImageURL, ...body }) =>
                tempDeleteImageURL
                  ? deleteImageM
                      .mutateAsync({ imageURL: tempDeleteImageURL })
                      .then(() => editVehicleM.mutateAsync(body))
                  : editVehicleM.mutateAsync(body)
              }
              createMutation={createVehicleM.mutateAsync}
            >
              <ShopInventoryFields />
            </PortalForm>
          </DataForm.Provider>
        )}
      </PortalContent>
    </DataTable.Provider>
  );
}
