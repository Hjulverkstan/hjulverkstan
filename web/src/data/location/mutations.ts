import { useMutation } from 'react-query';
import { invalidateQueries } from '../queries';
import * as api from './api';

export const useCreateLocationM = () =>
  useMutation({
    ...api.createCreateLocation(),
    onSuccess: ({ id }) =>
      invalidateQueries([
        api.createGetLocations().queryKey,
        api.createGetLocation({ id }).queryKey,
      ]),
  });

export const useEditLocationM = () =>
  useMutation({
    ...api.createEditLocation(),
    onSuccess: ({ id }) =>
      invalidateQueries([
        api.createGetLocations().queryKey,
        api.createGetLocation({ id }).queryKey,
      ]),
  });

export const useDeleteLocationM = () =>
  useMutation({
    ...api.createDeleteLocation(),
    onSuccess: () => invalidateQueries([api.createGetLocations().queryKey]),
  });
