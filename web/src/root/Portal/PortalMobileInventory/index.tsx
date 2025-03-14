import { PageContentProps } from '../index';
import { useVehiclesAggregatedQ } from '@data/vehicle/queries';
import * as DataTable from '@components/DataTable';
import { Mode } from '@components/DataForm';
import PortalContent from '../PortalContent';
import * as enums from '@data/vehicle/enums';
import React from 'react';
import { ImageBox } from '@components/ImageBox';
import { useEditVehicleM } from '@data/vehicle/mutations';

//

export default function MobileImageInventory({ mode }: PageContentProps) {
  const vehiclesQ = useVehiclesAggregatedQ();
  const editVehicleM = useEditVehicleM();

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
         * Sorts the array in descending order using IDs. Maps over the sorted array.
         * Renders the accepted vehicles in the correct order.
         * */}
        <div className="flex w-full flex-col">
          {vehiclesQ.data
            ?.filter((vehicle) => vehicle.regTag)
            .sort((a, b) => b.id.localeCompare(a.id))
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
                    <ImageBox
                      dataKey="imageURL"
                      value={vehicle.imageURL}
                      onChange={(newValue: string | null) => {
                        // If the new value is different, update the vehicle on the backend.
                        if (newValue !== vehicle.imageURL) {
                          return editVehicleM.mutateAsync({
                            ...vehicle,
                            imageURL: newValue,
                          });
                        }
                        return Promise.resolve();
                      }}
                      onBackendUpdate={(updatedFields) => {
                        return editVehicleM.mutateAsync({
                          ...vehicle,
                          ...updatedFields,
                        });
                      }}
                      icon={enums.find(vehicle.vehicleType).icon}
                    />
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
