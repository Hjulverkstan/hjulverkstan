import * as C from '@utils/common';

import { createErrorHandler, endpoints, instance } from '../../api';
import { ListResponse } from '../../types';

import { Text } from './types';
import {
  Global,
  Locale,
  LocaleAndGlobal,
  WithLocale,
} from '@data/webedit/types';

// GET ALL

export type GetTextsRes = ListResponse<Text>;
export type GetTextsParams = { locale: LocaleAndGlobal };

export const createGetTexts = ({ locale }: GetTextsParams) => ({
  queryKey: [endpoints.webedit.text, locale],
  queryFn: () =>
    instance
      .get<GetTextsRes>(endpoints.webedit.text, {
        params: {
          lang:
            locale === Global
              ? undefined
              : C.localeToLangCode(locale as Locale),
        },
      })
      .then((res) => res.data.content)
      .catch(createErrorHandler(endpoints.webedit.text)),
});

// GET

export type GetTextRes = Text;
export type GetTextParams = WithLocale<{ id: string }>;

export const createGetText = ({ id, locale }: GetTextParams) => ({
  queryKey: [endpoints.webedit.text, id, locale],
  queryFn: () =>
    instance
      .get<GetTextRes>(`${endpoints.webedit.text}/${id}`, {
        params: {
          lang:
            locale === Global
              ? undefined
              : C.localeToLangCode(locale as Locale),
        },
      })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.text)),
});

// EDIT

export type EditTextRes = Text;
export type EditTextParams = WithLocale<Text>;

export const createEditText = () => ({
  mutationFn: ({ id, locale, ...body }: EditTextParams) =>
    instance
      .put<EditTextRes>(`${endpoints.webedit.text}/${id}`, body, {
        params: {
          lang:
            locale === Global
              ? undefined
              : C.localeToLangCode(locale as Locale),
        },
      })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.text)),
});

// DELETE (only for lang, cannot delete entity itself...)

export type DeleteTextParams = WithLocale<{ id: string }>;

export const createDeleteText = () => ({
  mutationFn: ({ locale, id }: DeleteTextParams) =>
    instance
      .delete(`${endpoints.webedit.text}/${id}`, {
        params: {
          lang:
            locale === Global
              ? undefined
              : C.localeToLangCode(locale as Locale),
        },
      })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.text)),
});
