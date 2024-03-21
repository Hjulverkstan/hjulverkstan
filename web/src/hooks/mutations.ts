import { QueryKey, useMutation } from 'react-query';

import * as api from '@api';
import { Vehicle } from '@api';
import { queryClient } from '@root';

const queryKeyToString = (queryKey: QueryKey) =>
  typeof queryKey === 'string'
    ? queryKey
    : queryKey.map((el) => JSON.stringify(el)).join();

const invalidateQueries = async (queryKeys: string[][]) =>
  await queryClient.invalidateQueries({
    predicate: ({ queryKey = '' }) =>
      queryKeys.some((matchQueryKey) =>
        queryKeyToString(queryKey).startsWith(queryKeyToString(matchQueryKey)),
      ),
  });

export const useCreateVehicle = () =>
  useMutation({
    ...api.createVehicle(),
    onSuccess: async ({ id }) =>
      await invalidateQueries([
        api.getVehicles().queryKey,
        api.getVehicle({ id }).queryKey,
      ]),
  });

export const useEditVehicle = () =>
  useMutation({
    ...api.editVehicle(),
    onSuccess: async ({ id }) =>
      await invalidateQueries([
        api.getVehicles().queryKey,
        api.getVehicle({ id }).queryKey,
      ]),
  });

export const useDeleteVehicle = (
  onSuccess?: (data: Vehicle) => void,
  onError?: (error: unknown) => void,
) =>
  // define or not define type(s to useMutation? <Vehicle, Error, string>))
  useMutation({
    ...api.deleteVehicle(),
    onSuccess: async (data) => {
      await invalidateQueries([api.getVehicles().queryKey]);
      onSuccess?.(data);
    },
    onError,
  });
