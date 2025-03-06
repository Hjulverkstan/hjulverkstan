import { useMutation } from '@tanstack/react-query';

import { invalidateQueries } from '../queries';
import * as api from './api';

export const useUploadImageM = () =>
  useMutation({
    ...api.createUploadImage(),
    onSuccess: (imageURL: string) => invalidateQueries([[imageURL]]),
  });

export const useDeleteImageM = () =>
  useMutation({
    ...api.createDeleteImage(),
    onSuccess: (imageURL: string) => invalidateQueries([[imageURL]]),
  });
