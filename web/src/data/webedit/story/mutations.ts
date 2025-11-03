import { useMutation } from '@tanstack/react-query';

import { invalidateQueries } from '../../queries';
import * as api from './api';
import { Global } from '@data/webedit/types';

export const useCreateStoryM = () =>
  useMutation({
    ...api.createCreateStory(),
    onSuccess: ({ id }, { lang }) =>
      invalidateQueries([
        api.createGetStories({ lang }).queryKey,
        api.createGetStory({ id, lang }).queryKey,
      ]),
  });

export const useEditStoryM = () =>
  useMutation({
    ...api.createEditStory(),
    onSuccess: ({ id }, { lang }) =>
      invalidateQueries([
        api.createGetStories({ lang }).queryKey,
        api.createGetStory({ id, lang }).queryKey,
      ]),
  });

export const useDeleteStoryM = () =>
  useMutation({
    ...api.createDeleteStory(),
    onSuccess: (_, { id, lang }) =>
      invalidateQueries([
        api.createGetStories({ lang }).queryKey,
        ...(lang != Global ? [api.createGetStory({ id, lang }).queryKey] : []),
      ]),
  });
