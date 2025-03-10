import { useMutation } from '@tanstack/react-query';

import * as api from './api';

export const useUploadImageM = () =>
  useMutation({
    ...api.createUploadImage(),
  });

export const useDeleteImageM = () =>
  useMutation({
    ...api.createDeleteImage(),
  });
