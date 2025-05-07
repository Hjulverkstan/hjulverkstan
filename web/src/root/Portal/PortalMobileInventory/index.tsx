import { PageContentProps } from '../index';
import { useVehiclesAggregatedQ } from '@data/vehicle/queries';
import * as DataTable from '@components/DataTable';
import { Mode } from '@components/DataForm';
import PortalContent from '../PortalContent';
import * as enums from '@data/vehicle/enums';
import React, { useRef } from 'react';
import { ImageEditProvider } from './ImageEditContext';
import { ImageCard } from './ImageCard';
import { useUploadAndSetVehicleImage } from './useUploadAndSetVehicleImage';
import { useDeleteAndSetVehicleImage } from './useDeleteAndSetVehicleImage';
import { Vehicle } from '@data/vehicle/types';
import { Button } from '@components/shadcn/Button';
import Spinner from '@components/Spinner';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@components/shadcn/Drawer';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@components/shadcn/Dialog';

//

export default function MobileImageInventory({ mode }: PageContentProps) {
  const vehiclesQ = useVehiclesAggregatedQ();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: mutateUploadImage, isPending: isUploading } =
    useUploadAndSetVehicleImage();
  const { mutate: mutateDeleteImage, isPending: isDeleting } =
    useDeleteAndSetVehicleImage();

  const handleUpload =
    (vehicle: Vehicle) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      mutateUploadImage({ file, vehicle });
    };

  const handleDelete = (vehicle: Vehicle) => () => {
    const imageURL = vehicle.imageURL;
    if (!imageURL) return;

    mutateDeleteImage({ imageURL, vehicle });
  };

  return (
    <ImageEditProvider>
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
              ?.sort((a, b) => Number(b.id) - Number(a.id))
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
                      <Drawer>
                        <DrawerTrigger asChild>
                          <ImageCard
                            imageURL={vehicle.imageURL}
                            onClick={() => {}}
                            icon={enums.find(vehicle.vehicleType).icon}
                          />
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>
                              Manage Image for{' '}
                              {vehicle.regTag || `#${vehicle.id}`}
                            </DrawerTitle>
                            <DrawerDescription></DrawerDescription>
                          </DrawerHeader>
                          <div className="mt-auto flex flex-col gap-2 p-2">
                            <DrawerFooter>
                              <input
                                ref={fileInputRef}
                                type="file"
                                id={'file-upload-imageURL'}
                                className="hidden"
                                onChange={handleUpload(vehicle)}
                              />
                              <Button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="w-full"
                              >
                                {isUploading ? (
                                  <Spinner
                                    className="h-5 w-5 flex-shrink-0 "
                                    visible
                                  />
                                ) : (
                                  'Upload'
                                )}
                              </Button>

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    disabled={isUploading}
                                    className="w-full"
                                  >
                                    Delete
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogTitle></DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete this image?
                                  </DialogDescription>
                                  <div className="flex justify-end gap-2 pt-4">
                                    <DialogClose asChild>
                                      <Button variant="outline">Close</Button>
                                    </DialogClose>
                                    <DialogTrigger
                                      asChild
                                      onClick={handleDelete(vehicle)}
                                    >
                                      <Button variant="destructive">
                                        {isDeleting ? (
                                          <Spinner
                                            className="h-5 w-5 flex-shrink-0 "
                                            visible
                                          />
                                        ) : (
                                          'Delete'
                                        )}
                                      </Button>
                                    </DialogTrigger>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              <DrawerClose asChild>
                                <Button
                                  variant="outline"
                                  className="w-full"
                                  disabled={isUploading}
                                >
                                  Cancel
                                </Button>
                              </DrawerClose>
                            </DrawerFooter>
                          </div>
                        </DrawerContent>
                      </Drawer>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-2xl font-bold">
                      {vehicle.regTag || `#${vehicle.id}`}
                    </h3>
                  </div>
                </div>
              ))}
          </div>
        </PortalContent>
      </DataTable.Provider>
    </ImageEditProvider>
  );
}
