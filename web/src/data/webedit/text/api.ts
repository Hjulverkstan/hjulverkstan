import { createErrorHandler, endpoints, instance } from '../../api';
import { ListResponse } from '../../types';

import { Text } from './types';
import { Lang, WithLang } from '@data/webedit/types';

// GET ALL

export type GetTextsRes = ListResponse<Text>;
export type GetTextsParams = { lang: Lang };

export const createGetTexts = ({ lang }: GetTextsParams) => ({
  queryKey: [endpoints.webedit.text, lang],
  queryFn: () =>
    instance
      .get<GetTextsRes>(endpoints.webedit.text, { params: { lang } })
      .then((res) => res.data.content)
      .catch(createErrorHandler(endpoints.webedit.text)),
});

// GET

export type GetTextRes = Text;
export type GetTextParams = WithLang<{ id: string }>;

export const createGetText = ({ id, lang }: GetTextParams) => ({
  queryKey: [endpoints.webedit.text, id, lang],
  queryFn: () =>
    instance
      .get<GetTextRes>(`${endpoints.webedit.text}/${id}`, { params: { lang } })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.text)),
});

// EDIT

export type EditTextRes = Text;
export type EditTextParams = WithLang<Text>;

export const createEditText = () => ({
  mutationFn: ({ id, lang, ...body }: EditTextParams) =>
    instance
      .put<EditTextRes>(`${endpoints.webedit.text}/${id}`, body, { params: { lang } })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.text)),
});

// DELETE (only for lang, cannot delete entity itself...)

export type DeleteTextParams = WithLang<{ id: string }>;

export const createDeleteText = () => ({
  mutationFn: ({ lang, id }: DeleteTextParams) =>
    instance
      .delete(`${endpoints.webedit.text}/${id}`, { params: { lang } })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.text)),
});
