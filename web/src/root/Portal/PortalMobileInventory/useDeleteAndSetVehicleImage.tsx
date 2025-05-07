import * as imageApi from '@data/image/api';
import * as vehicleApi from '@data/vehicle/api';
import { useMutation } from '@tanstack/react-query';
import { Vehicle } from '@data/vehicle/types';
import { invalidateQueries } from '@data/queries';

export const useDeleteAndSetVehicleImage = () => {
  const { mutationFn: deleteFn } = imageApi.createDeleteImage();
  const { mutationFn: editFn } = vehicleApi.createEditVehicle();

  return useMutation({
    mutationFn: async ({
      imageURL,
      vehicle,
    }: {
      imageURL: string;
      vehicle: Vehicle;
    }) => {
      imageURL = await deleteFn({ imageURL });
      return editFn({ ...vehicle, imageURL });
    },
    onSuccess: () => {
      invalidateQueries([vehicleApi.createGetVehicles().queryKey]);
    },
  });
};
