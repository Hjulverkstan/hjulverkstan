import { QueryKey, useMutation } from 'react-query';

import * as api from '@api';
import { queryClient } from '@root';

const queryKeyToString = (queryKey: QueryKey) =>
  typeof queryKey === 'string'
    ? queryKey
    : queryKey.map((el) => JSON.stringify(el)).join();

const invalidateQueries = (queryKeys: string[][]) => {
  queryClient
    .invalidateQueries({
      predicate: ({ queryKey = '' }) =>
        queryKeys.some((matchQueryKey) =>
          queryKeyToString(queryKey).startsWith(
            queryKeyToString(matchQueryKey),
          ),
        ),
    })
    .catch((err) => {
      throw Error('invalidateQueries failed, error: ' + err);
    });
};

export const useCreateVehicle = () =>
  useMutation({
    ...api.createVehicle(),
    onSuccess: ({ id }) =>
      invalidateQueries([
        api.getVehicles().queryKey,
        api.getVehicle({ id }).queryKey,
      ]),
  });

export const useEditVehicle = () =>
  useMutation({
    ...api.editVehicle(),
    onSuccess: ({ id }) =>
      invalidateQueries([
        api.getVehicles().queryKey,
        api.getVehicle({ id }).queryKey,
      ]),
  });

export const useDeleteVehicle = () =>
  useMutation({
    ...api.deleteVehicle(),
    onSuccess: () => invalidateQueries([api.getVehicles().queryKey]),
  });
