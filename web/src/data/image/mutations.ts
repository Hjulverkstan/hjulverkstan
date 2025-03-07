import { useMutation } from '@tanstack/react-query';

import { invalidateQueries } from '../queries';
import * as api from './api';

export const useCreateImageM = () =>
  useMutation({
    ...api.createCreateImage(),
    onSuccess: (imageURL) =>
      invalidateQueries([api.createGetImage(imageURL).queryKey]),
  });

export const useDeleteImageM = () =>
  useMutation({
    ...api.createDeleteImage(),
    onSuccess: (imageURL) =>
      invalidateQueries([api.createGetImage(imageURL).queryKey]),
  });
