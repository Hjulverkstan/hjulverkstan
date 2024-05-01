import { useMutation } from 'react-query';

import { invalidateQueries } from '../queries';
import * as api from './api';

export const useCreateVehicleM = () =>
  useMutation({
    ...api.createCreateVehicle(),
    onSuccess: ({ id }) =>
      invalidateQueries([
        api.createGetVehicles().queryKey,
        api.createGetVehicle({ id }).queryKey,
      ]),
  });

export const useEditVehicleM = () =>
  useMutation({
    ...api.createEditVehicle(),
    onSuccess: ({ id }) =>
      invalidateQueries([
        api.createGetVehicles().queryKey,
        api.createGetVehicle({ id }).queryKey,
      ]),
  });

export const useDeleteVehicleM = () =>
  useMutation({
    ...api.createDeleteVehicle(),
    onSuccess: () => invalidateQueries([api.createGetVehicles().queryKey]),
  });
