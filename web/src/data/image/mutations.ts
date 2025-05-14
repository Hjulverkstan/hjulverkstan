import { useMutation } from '@tanstack/react-query';

import * as api from './api';
import * as imageApi from '@data/image/api';
import * as vehicleApi from '@data/vehicle/api';
import { Vehicle } from '@data/vehicle/types';
import { invalidateQueries } from '@data/queries';

export const useUploadImageM = () =>
  useMutation({
    ...api.createUploadImage(),
  });

export const useDeleteImageM = () =>
  useMutation({
    ...api.createDeleteImage(),
  });

//

export const useDeleteAndSetVehicleImage = () => {
  const { mutationFn: deleteFn } = imageApi.createDeleteImage();
  const { mutationFn: editFn } = vehicleApi.createEditVehicle();

  return useMutation({
    mutationFn: async ({ imageURL, ...vehicle }: Vehicle) => {
      imageURL && (await deleteFn({ imageURL }));
      return editFn(vehicle);
    },
    onSuccess: () => {
      invalidateQueries([vehicleApi.createGetVehicles().queryKey]);
    },
  });
};

//

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
