import { PageContentProps } from '../index';
import { useVehicleQ, useVehiclesAggregatedQ } from '@data/vehicle/queries';

import * as DataTable from '@components/DataTable';
import * as DataForm from '@components/DataForm';
import { Mode } from '@components/DataForm';
import PortalContent from '../PortalContent';
import * as enums from '@data/vehicle/enums';

import React from 'react';
import { initVehicle, useVehicleZ } from '@data/vehicle/form';
import { useLocationsQ } from '@data/location/queries';
import { useParams } from 'react-router-dom';
import { Vehicle } from '@data/vehicle/types';
import PortalForm from '../PortalForm';
import { useCreateVehicleM, useEditVehicleM } from '@data/vehicle/mutations';
import { useDeleteImageM } from '@data/image/mutations';

//

export default function MobileImageInventory({ mode }: PageContentProps) {
  const { id = '' } = useParams();

  const vehiclesQ = useVehiclesAggregatedQ();
  const vehicleQ = useVehicleQ({ id });
  const locationsQ = useLocationsQ(); // <Fields /> doesn't handle error/loading
  const createVehicleM = useCreateVehicleM();
  const editVehicleM = useEditVehicleM();
  const deleteImageM = useDeleteImageM();
  const vehicleZ = useVehicleZ();

  // key for DataTable.Provider might have to be changed from vehicleImage, research more on Monday.
  return (
    <DataTable.Provider
      key="vehicleImages"
      tableKey="vehicles"
      disabled={mode && mode !== Mode.READ}
      data={vehiclesQ.data}
    >
      <PortalContent>
        {/*
         * Filters out the vehicles.
         * Sorts the array in descending order. Maps over the sorted array.
         * Renders the accepted vehicles in the correct order.
         * */}
        <div className="flex w-full flex-col">
          {vehiclesQ.data
            ?.filter((vehicle) => vehicle.regTag)
            .sort(
              (a, b) =>
                new Date(b.createdAt ?? 0).getTime() -
                new Date(a.createdAt ?? 0).getTime(),
            )
            .map((vehicle) => (
              // Image and RegTag container
              <div
                key={vehicle.id}
                className="mr-2 flex h-full w-full flex-col p-3 px-4 py-2"
              >
                {/* 16:9 aspect ratio container */}
                <div className="relative aspect-video">
                  <div
                    className="relative h-full w-full items-center
                      justify-center rounded-xl bg-white shadow-lg"
                  >
                    <DataForm.Provider
                      mode={Mode.EDIT} // originally just mode
                      isLoading={vehicleQ.isLoading || locationsQ.isLoading}
                      data={vehicle}
                      zodSchema={vehicleZ}
                      initCreateBody={initVehicle}
                    >
                      <PortalForm
                        dataLabel="Vehicle"
                        toToolbarName={(body: Vehicle) =>
                          (body.regTag &&
                            `${enums.find(body.vehicleType).label} ${body.regTag}`) ||
                          (body.id &&
                            `${enums.find(body.vehicleType).label} #${body.id}`)
                        }
                        error={vehicleQ.error || locationsQ.error}
                        isSubmitting={
                          createVehicleM.isPending || editVehicleM.isPending
                        }
                        saveMutation={({ tempDeleteImageURL, ...body }) =>
                          tempDeleteImageURL
                            ? deleteImageM
                                .mutateAsync({ imageURL: tempDeleteImageURL })
                                .then(() => editVehicleM.mutateAsync(body))
                            : editVehicleM.mutateAsync(body)
                        }
                        createMutation={createVehicleM.mutateAsync}
                      >
                        <DataForm.MobileImage
                          label="Mobile Image"
                          dataKey="imageURL"
                          icon={enums.find(vehicle.vehicleType).icon}
                        />
                      </PortalForm>
                    </DataForm.Provider>
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-2xl font-bold">{vehicle.regTag}</h3>
                </div>
              </div>
            ))}
        </div>
      </PortalContent>
    </DataTable.Provider>
  );
}
