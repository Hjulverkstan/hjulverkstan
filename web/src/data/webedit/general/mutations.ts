import { useMutation } from '@tanstack/react-query';
import { invalidateQueries } from '@data/queries';
import * as api from './api';

export const useEditGeneralContentM = () =>
  useMutation({
    ...api.createEditGeneralContent(),
    onSuccess: ({ id }) =>
      invalidateQueries([
        api.createGetGeneralContents().queryKey,
        api.createGetGeneralContent({ id }).queryKey,
      ]),
  });
