import React, { useRef, useState } from 'react';

import { useVehiclesAggregatedQ } from '@data/vehicle/queries';
import * as DataTable from '@components/DataTable';
import { Mode } from '@components/DataForm';
import { Vehicle } from '@data/vehicle/types';
import { Button, IconButton } from '@components/shadcn/Button';
import Spinner from '@components/Spinner';
import * as Drawer from '@components/shadcn/Drawer';
import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';
import { useDialogManager } from '@components/DialogManager';
import { useToast } from '@components/shadcn/use-toast';
import {
  useDeleteAndSetVehicleImage,
  useUploadAndSetVehicleImage,
} from '@data/image/mutations';

import { PageContentProps } from '../index';
import { createErrorToast, createSuccessToast } from '../toast';
import { MobileInventoryVehicleCard } from './MobileInventoryVehicleCard';

//

const MobileInventoryRow = ({ vehicle }: { vehicle: Vehicle }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { openDialog } = useDialogManager();
  const { toast } = useToast();

  const uploadM = useUploadAndSetVehicleImage();
  const deleteM = useDeleteAndSetVehicleImage();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      uploadM
        .mutateAsync({ file, vehicle })
        .then(() => {
          toast(
            createSuccessToast({
              verbLabel: 'upload',
              dataLabel: 'image',
            }),
          );
        })
        .catch((err: any) => {
          console.error(err);
          toast(
            createErrorToast({
              verbLabel: 'upload',
              dataLabel: 'image',
            }),
          );
        })
        .finally(() => setIsDrawerOpen(false));
    }
  };

  const dispatchDelete = () =>
    vehicle.imageURL &&
    deleteM
      .mutateAsync(vehicle)
      .then(() => {
        toast(
          createSuccessToast({
            verbLabel: 'delete',
            dataLabel: 'image',
          }),
        );
      })
      .catch((err: any) => {
        console.error(err);
        toast(
          createErrorToast({
            verbLabel: 'delete',
            dataLabel: 'image',
          }),
        );
      })
      .finally(() => setIsDrawerOpen(false));

  const handleDelete = () =>
    openDialog(
      <ConfirmDeleteDialog onDelete={dispatchDelete} entity="image" />,
    );

  return (
    <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <Drawer.Trigger asChild>
        <MobileInventoryVehicleCard vehicle={vehicle} />
      </Drawer.Trigger>
      <Drawer.Content>
        <div className="mt-auto flex flex-col gap-2 p-2">
          <Drawer.Footer>
            <input
              ref={fileInputRef}
              type="file"
              id={'file-upload-imageURL'}
              className="hidden"
              onChange={handleUpload}
            />
            <IconButton
              onClick={() => fileInputRef.current?.click()}
              variant="contrast"
              icon={deleteM.isPending ? Spinner : undefined}
              text="Upload image"
            />

            {vehicle.imageURL && (
              <IconButton
                onClick={handleDelete}
                variant="red"
                icon={deleteM.isPending ? Spinner : undefined}
                text="Delete image"
              />
            )}

            <Drawer.Close asChild>
              <Button
                variant="outline"
                className="w-full"
                disabled={uploadM.isPending}
              >
                Cancel
              </Button>
            </Drawer.Close>
          </Drawer.Footer>
        </div>
      </Drawer.Content>
    </Drawer.Root>
  );
};

export default function PortalMobileInventory({ mode }: PageContentProps) {
  const vehiclesQ = useVehiclesAggregatedQ();

  return (
    <DataTable.Provider
      key="vehicleImages"
      tableKey="vehicles"
      disabled={mode && mode !== Mode.READ}
      data={vehiclesQ.data}
    >
      <div className="flex w-full flex-col gap-12 px-3 py-6">
        {vehiclesQ.data
          ?.sort((a, b) => Number(b.id) - Number(a.id))
          .map((vehicle) => (
            <MobileInventoryRow key={vehicle.id} vehicle={vehicle} />
          ))}
      </div>
    </DataTable.Provider>
  );
}
