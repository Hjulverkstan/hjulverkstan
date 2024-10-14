import { useMutation } from '@tanstack/react-query';

import * as api from './api';
import { invalidateQueries } from '@data/queries';

export const useCreateGeneralContentM = () =>
  useMutation({
    ...api.createCreateGeneralContent(),
    onSuccess: ({ id }) =>
      invalidateQueries([
        api.createGetGeneralContent().queryKey,
        api.createGetGeneralContentItem({ id }).queryKey,
      ]),
  });

export const useEditGeneralContentM = () =>
  useMutation({
    ...api.createEditGeneralContent(),
    onSuccess: ({ id }) =>
      invalidateQueries([
        api.createGetGeneralContent().queryKey,
        api.createGetGeneralContentItem({ id }).queryKey,
      ]),
  });

export const useDeleteGeneralContentM = () =>
  useMutation({
    ...api.createDeleteGeneralContent(),
    onSuccess: () =>
      invalidateQueries([api.createGetGeneralContent().queryKey]),
  });
