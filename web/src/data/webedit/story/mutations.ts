import { useMutation } from '@tanstack/react-query';

import { invalidateQueries } from '../../queries';
import * as api from './api';
import { Global } from '@data/webedit/types';

export const useCreateStoryM = () =>
  useMutation({
    ...api.createCreateStory(),
    onSuccess: ({ id }, { locale }) =>
      invalidateQueries([
        api.createGetStories({ locale }).queryKey,
        api.createGetStory({ id, locale }).queryKey,
      ]),
  });

export const useEditStoryM = () =>
  useMutation({
    ...api.createEditStory(),
    onSuccess: ({ id }, { locale }) =>
      invalidateQueries([
        api.createGetStories({ locale }).queryKey,
        api.createGetStory({ id, locale }).queryKey,
      ]),
  });

export const useDeleteStoryM = () =>
  useMutation({
    ...api.createDeleteStory(),
    onSuccess: (_, { id, locale }) =>
      invalidateQueries([
        api.createGetStories({ locale }).queryKey,
        ...(locale != Global
          ? [api.createGetStory({ id, locale }).queryKey]
          : []),
      ]),
  });
