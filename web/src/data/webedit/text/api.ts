import { createErrorHandler, endpoints, instance } from '../../api';
import { ListResponse } from '../../types';

import { Text } from './types';
import { Global, WebEditLang, WithWebEditLang } from '@data/webedit/types';

// GET ALL

export type GetTextsRes = ListResponse<Text>;
export type GetTextsParams = { lang: WebEditLang };

export const createGetTexts = ({ lang }: GetTextsParams) => ({
  queryKey: [endpoints.webedit.text, lang],
  queryFn: () =>
    instance
      .get<GetTextsRes>(endpoints.webedit.text, {
        params: {
          lang: lang === Global ? undefined : lang,
        },
      })
      .then((res) => res.data.content)
      .catch(createErrorHandler(endpoints.webedit.text)),
});

// GET

export type GetTextRes = Text;
export type GetTextParams = WithWebEditLang<{ id: string }>;

export const createGetText = ({ id, lang }: GetTextParams) => ({
  queryKey: [endpoints.webedit.text, id, lang],
  queryFn: () =>
    instance
      .get<GetTextRes>(`${endpoints.webedit.text}/${id}`, {
        params: {
          lang: lang === Global ? undefined : lang,
        },
      })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.text)),
});

// EDIT

export type EditTextRes = Text;
export type EditTextParams = WithWebEditLang<Text>;

export const createEditText = () => ({
  mutationFn: ({ id, lang, ...body }: EditTextParams) =>
    instance
      .put<EditTextRes>(`${endpoints.webedit.text}/${id}`, body, {
        params: {
          lang: lang === Global ? undefined : lang,
        },
      })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.text)),
});

// DELETE (only for lang, cannot delete entity itself...)

export type DeleteTextParams = WithWebEditLang<{ id: string }>;

export const createDeleteText = () => ({
  mutationFn: ({ lang, id }: DeleteTextParams) =>
    instance
      .delete(`${endpoints.webedit.text}/${id}`, {
        params: {
          lang: lang === Global ? undefined : lang,
        },
      })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.text)),
});
