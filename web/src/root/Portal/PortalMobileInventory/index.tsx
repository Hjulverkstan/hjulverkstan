import { PageContentProps } from '../index';
import { useVehiclesAggregatedQ } from '@data/vehicle/queries';

import * as DataTable from '@components/DataTable';
import { Mode } from '@components/DataForm';
import PortalContent from '../PortalContent';
import * as enums from '@data/vehicle/enums';

import ImageBox from '@components/ImageBox';
import MobileImageEditDialog from '@components/MobileImageEditDialog';
import React, { useState } from 'react';
import { useCreateImageM, useDeleteImageM } from '@data/image/mutations';

//

export default function MobileImageInventory({ mode }: PageContentProps) {
  const vehiclesQ = useVehiclesAggregatedQ();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState<string | null>(
    null,
  );
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const uploadImageM = useCreateImageM();
  const deleteImageM = useDeleteImageM();

  const handleImageClick = (
    id: string,
    imageURL: string,
    entityId: string,
    vehicleType: string,
  ) => {
    setSelectedVehicleId(id);
    setSelectedImage(imageURL);
    setSelectedEntityId(entityId);
    setSelectedVehicleType(vehicleType);
    setIsModalOpen(true);
  };

  const handleUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      uploadImageM.mutate(
        { file },
        {
          onSuccess: (imageURL) => {
            setSelectedImage(imageURL);
            setIsModalOpen(false);
          },
          onError: (error) => {
            console.error('Error uploading image:', error);
          },
        },
      );
    }
  };

  const handleDeleteImage = () => {
    if (selectedImage) {
      deleteImageM.mutate(
        { imageURL: selectedImage },
        {
          onSuccess: () => {
            setSelectedImage(null);
            setIsModalOpen(false);
          },
          onError: (error) => {
            console.error('Error deleting image:', error);
          },
        },
      );
    }
  };

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
         * Filters out the vehicles. Creates a copy of the data.
         * Sorts the array in descending order. Maps over the sorted array.
         * Renders the accepted vehicles in the correct order.
         * */}
        <div className="flex w-full flex-col">
          {vehiclesQ.data
            ?.slice()
            .filter((vehicle) => vehicle.regTag)
            .sort(
              (a, b) =>
                new Date(b.createdAt ?? 0).getTime() -
                new Date(a.createdAt ?? 0).getTime(),
            )
            .map(({ id, regTag, imageURL, vehicleType }) => (
              <div key={id} className="mr-2 flex w-full flex-col p-3 px-6 py-4">
                <div className="relative w-full">
                  <ImageBox
                    {...enums.find(vehicleType)}
                    imageURL={imageURL}
                    onClick={() =>
                      handleImageClick(id, imageURL, regTag, vehicleType)
                    }
                  ></ImageBox>
                </div>
                <div className="items-start justify-start">
                  <h3 className="text-2xl font-bold">{regTag}</h3>
                </div>

                {/* Ensures the modal only renders for the selected vehicle, so that other vehicles aren't affected. */}
                {selectedVehicleId === id && (
                  <MobileImageEditDialog
                    isOpen={isModalOpen}
                    onClose={() => {
                      setIsModalOpen(false);
                      setSelectedVehicleId(null);
                    }}
                    onEdit={handleUploadImage}
                    onDelete={handleDeleteImage}
                    entity={selectedVehicleType}
                    entityId={selectedEntityId}
                  />
                )}
              </div>
            ))}
        </div>
      </PortalContent>
    </DataTable.Provider>
  );
}
