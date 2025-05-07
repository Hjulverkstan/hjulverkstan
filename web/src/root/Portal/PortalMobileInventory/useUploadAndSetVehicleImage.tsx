import * as imageApi from '@data/image/api';
import * as vehicleApi from '@data/vehicle/api';
import { useMutation } from '@tanstack/react-query';
import { Vehicle } from '@data/vehicle/types';
import { invalidateQueries } from '@data/queries';

export const useUploadAndSetVehicleImage = () => {
  const { mutationFn: uploadFn } = imageApi.createUploadImage();
  const { mutationFn: editFn } = vehicleApi.createEditVehicle();

  return useMutation({
    mutationFn: async ({ file, vehicle }: { file: File; vehicle: Vehicle }) => {
      const imageURL = await uploadFn({ file });
      return editFn({ ...vehicle, imageURL });
    },
    onSuccess: () => {
      invalidateQueries([vehicleApi.createGetVehicles().queryKey]);
    },
  });
};
