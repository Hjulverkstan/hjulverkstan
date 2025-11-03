import { createErrorHandler, endpoints, instance } from '../../api';
import { ListResponse } from '../../types';
import { Global, WebEditLang, WithWebEditLang } from '../types';

import { Story } from './types';

// GET ALL

export type GetStoriesRes = ListResponse<Story>;
export type GetStoriesParams = { lang: WebEditLang };

export const createGetStories = ({ lang }: GetStoriesParams) => ({
  queryKey: [endpoints.webedit.story, lang],
  queryFn: () =>
    instance
      .get<GetStoriesRes>(endpoints.webedit.story, {
        params: {
          lang: lang === Global ? undefined : lang,
        },
      })
      .then((res) => res.data.content)
      .catch(createErrorHandler(endpoints.webedit.story)),
});

// GET

export type GetStoryRes = Story;
export type GetStoryParams = WithWebEditLang<{ id: string }>;

export const createGetStory = ({ id, lang }: GetStoryParams) => ({
  queryKey: [endpoints.webedit.story, id, lang],
  queryFn: () =>
    instance
      .get<GetStoryRes>(`${endpoints.webedit.story}/${id}`, {
        params: {
          lang: lang === Global ? undefined : lang,
        },
      })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.story)),
});

// CREATE

export type CreateStoryRes = Story;
export type CreateStoryParams = WithWebEditLang<Omit<Story, 'id'>>;

export const createCreateStory = () => ({
  mutationFn: ({ lang, ...body }: CreateStoryParams) =>
    instance
      .post<CreateStoryRes>(`${endpoints.webedit.story}`, body, {
        params: {
          lang: lang === Global ? undefined : lang,
        },
      })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.story)),
});

// EDIT

export type EditStoryRes = Story;
export type EditStoryParams = WithWebEditLang<Story>;

export const createEditStory = () => ({
  mutationFn: ({ id, lang, ...body }: EditStoryParams) =>
    instance
      .put<EditStoryRes>(`${endpoints.webedit.story}/${id}`, body, {
        params: {
          lang: lang === Global ? undefined : lang,
        },
      })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.story)),
});

// DELETE

export type DeleteStoryParams = WithWebEditLang<{ id: string }>;

export const createDeleteStory = () => ({
  mutationFn: ({ id, lang }: DeleteStoryParams) =>
    instance
      .delete(`${endpoints.webedit.story}/${id}`, {
        params: {
          lang: lang === Global ? undefined : lang,
        },
      })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.story)),
});
