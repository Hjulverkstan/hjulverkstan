import React, { useState } from 'react';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/shadcn/Dialog';
import { Button } from '@components/shadcn/Button';
import * as Select from '@components/shadcn/Select';
import { Vehicle, VehicleStatus } from '@data/vehicle/types';
import { useUpdateVehicleStatusM } from '@data/vehicle/mutations';
import { useToast } from '@components/shadcn/use-toast';
import { createErrorToast, createSuccessToast } from '../root/Portal/toast';

interface UpdateVehicleStatusesDialogProps {
  vehicles: Vehicle[];
}

export default function UpdateVehicleStatusesDialog({
  vehicles,
}: UpdateVehicleStatusesDialogProps) {
  const [vehicleStatuses, setVehicleStatuses] = useState<
    Record<string, VehicleStatus>
  >({});
  const updateVehicleStatusM = useUpdateVehicleStatusM();
  const { toast } = useToast();

  const handleConfirm = async () => {
    const vehiclesWithoutStatus = vehicles.filter(
      (vehicle) => !vehicleStatuses[vehicle.id],
    );
    if (vehiclesWithoutStatus.length > 0) {
      toast(
        createErrorToast({
          verbLabel: 'choose',
          dataLabel: 'status for all vehicles',
        }),
      );
      return;
    }

    try {
      await Promise.all(
        vehicles.map((vehicle) =>
          updateVehicleStatusM.mutateAsync({
            id: vehicle.id.toString(),
            vehicleStatus: vehicleStatuses[vehicle.id],
          }),
        ),
      );

      toast(
        createSuccessToast({
          verbLabel: 'update',
          dataLabel: 'vehicle statuses',
        }),
      );
    } catch (error) {
      console.error('Error during update of vehicle:', error);
      toast(
        createErrorToast({
          verbLabel: 'update',
          dataLabel: 'vehicle statuses',
        }),
      );
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Update Vehicle Statuses</DialogTitle>
        <DialogDescription>
          Please choose a new status for each vehicle associated with this
          ticket.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id}>
            <label>{vehicle.regTag || `Vehicle ${vehicle.id}`}</label>
            <Select.Root
              value={vehicleStatuses[vehicle.id] || ''}
              onValueChange={(value) =>
                setVehicleStatuses((prev) => ({
                  ...prev,
                  [vehicle.id]: value as VehicleStatus,
                }))
              }
            >
              <Select.Trigger className="w-full">
                <Select.Value placeholder="Choose status" />
              </Select.Trigger>
              <Select.Content>
                {Object.values(VehicleStatus).map((status) => (
                  <Select.Item key={status} value={status}>
                    {status
                      .toLowerCase()
                      .split('_')
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(' ')}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        ))}
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={handleConfirm} type="button">
            Confirm
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
