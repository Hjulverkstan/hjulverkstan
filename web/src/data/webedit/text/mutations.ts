import { useMutation } from '@tanstack/react-query';

import { Global } from '@data/webedit/types';

import { invalidateQueries } from '../../queries';
import * as api from './api';

export const useEditTextM = () =>
  useMutation({
    ...api.createEditText(),
    onSuccess: ({ id }, { locale }) =>
      invalidateQueries([
        api.createGetTexts({ locale }).queryKey,
        api.createGetText({ id, locale }).queryKey,
      ]),
  });

export const useDeleteTextM = () =>
  useMutation({
    ...api.createDeleteText(),
    onSuccess: (_, { id, locale }) =>
      invalidateQueries([
        api.createGetTexts({ locale }).queryKey,
        ...(locale != Global
          ? [api.createGetText({ id, locale }).queryKey]
          : []),
      ]),
  });
