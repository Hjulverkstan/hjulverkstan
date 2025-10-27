import * as C from '@utils/common';

import { createErrorHandler, endpoints, instance } from '../../api';
import { ListResponse } from '../../types';
import { Global, LocaleAndGlobal, WithLocale } from '../types';

import { Story } from './types';

// GET ALL

export type GetStoriesRes = ListResponse<Story>;
export type GetStoriesParams = { locale: LocaleAndGlobal };

export const createGetStories = ({ locale }: GetStoriesParams) => ({
  queryKey: [endpoints.webedit.story, locale],
  queryFn: () =>
    instance
      .get<GetStoriesRes>(endpoints.webedit.story, {
        params: {
          lang: locale === Global ? undefined : C.localeToLangCode(locale),
        },
      })
      .then((res) => res.data.content)
      .catch(createErrorHandler(endpoints.webedit.story)),
});

// GET

export type GetStoryRes = Story;
export type GetStoryParams = WithLocale<{ id: string }>;

export const createGetStory = ({ id, locale }: GetStoryParams) => ({
  queryKey: [endpoints.webedit.story, id, locale],
  queryFn: () =>
    instance
      .get<GetStoryRes>(`${endpoints.webedit.story}/${id}`, {
        params: {
          lang: locale === Global ? undefined : C.localeToLangCode(locale),
        },
      })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.story)),
});

// CREATE

export type CreateStoryRes = Story;
export type CreateStoryParams = WithLocale<Omit<Story, 'id'>>;

export const createCreateStory = () => ({
  mutationFn: ({ locale, ...body }: CreateStoryParams) =>
    instance
      .post<CreateStoryRes>(`${endpoints.webedit.story}`, body, {
        params: {
          lang: locale === Global ? undefined : C.localeToLangCode(locale),
        },
      })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.story)),
});

// EDIT

export type EditStoryRes = Story;
export type EditStoryParams = WithLocale<Story>;

export const createEditStory = () => ({
  mutationFn: ({ id, locale, ...body }: EditStoryParams) =>
    instance
      .put<EditStoryRes>(`${endpoints.webedit.story}/${id}`, body, {
        params: {
          lang: locale === Global ? undefined : C.localeToLangCode(locale),
        },
      })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.story)),
});

// DELETE

export type DeleteStoryParams = WithLocale<{ id: string }>;

export const createDeleteStory = () => ({
  mutationFn: ({ id, locale }: DeleteStoryParams) =>
    instance
      .delete(`${endpoints.webedit.story}/${id}`, {
        params: {
          lang: locale === Global ? undefined : C.localeToLangCode(locale),
        },
      })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.story)),
});
