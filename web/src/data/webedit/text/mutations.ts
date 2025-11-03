import { useMutation } from '@tanstack/react-query';

import { Global } from '@data/webedit/types';

import { invalidateQueries } from '../../queries';
import * as api from './api';

export const useEditTextM = () =>
  useMutation({
    ...api.createEditText(),
    onSuccess: ({ id }, { lang }) =>
      invalidateQueries([
        api.createGetTexts({ lang }).queryKey,
        api.createGetText({ id, lang }).queryKey,
      ]),
  });

export const useDeleteTextM = () =>
  useMutation({
    ...api.createDeleteText(),
    onSuccess: (_, { id, lang }) =>
      invalidateQueries([
        api.createGetTexts({ lang }).queryKey,
        ...(lang != Global ? [api.createGetText({ id, lang }).queryKey] : []),
      ]),
  });
