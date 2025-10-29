import * as C from '@utils/common';

import { createErrorHandler, endpoints, instance } from '../../api';
import { ListResponse } from '../../types';
import { Global, Locale, LocaleAndGlobal, WithLocale } from '../types';

import { Shop } from './types';

// GET ALL

export type GetShopsRes = ListResponse<Shop>;
export type GetShopsParams = { locale: LocaleAndGlobal };

export const createGetShops = ({ locale }: GetShopsParams) => ({
  queryKey: [endpoints.webedit.shop, locale],
  queryFn: () =>
    instance
      .get<GetShopsRes>(endpoints.webedit.shop, {
        params: {
          lang:
            locale === Global
              ? undefined
              : C.localeToLangCode(locale as Locale),
        },
      })
      .then((res) => res.data.content)
      .catch(createErrorHandler(endpoints.webedit.shop)),
});

// GET

export type GetShopRes = Shop;
export type GetShopParams = WithLocale<{ id: string }>;

export const createGetShop = ({ id, locale }: GetShopParams) => ({
  queryKey: [endpoints.webedit.shop, id, locale],
  queryFn: () =>
    instance
      .get<GetShopRes>(`${endpoints.webedit.shop}/${id}`, {
        params: {
          lang:
            locale === Global
              ? undefined
              : C.localeToLangCode(locale as Locale),
        },
      })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.shop)),
});

// CREATE

export type CreateShopRes = Shop;
export type CreateShopParams = WithLocale<Omit<Shop, 'id'>>;

export const createCreateShop = () => ({
  mutationFn: ({ locale, ...body }: CreateShopParams) =>
    instance
      .post<CreateShopRes>(`${endpoints.webedit.shop}`, body, {
        params: {
          lang: locale === Global ? undefined : C.localeToLangCode(locale),
        },
      })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.shop)),
});

// EDIT

export type EditShopRes = Shop;
export type EditShopParams = WithLocale<Shop>;

export const createEditShop = () => ({
  mutationFn: ({ id, locale, ...body }: EditShopParams) =>
    instance
      .put<EditShopRes>(`${endpoints.webedit.shop}/${id}`, body, {
        params: {
          lang:
            locale === Global
              ? undefined
              : C.localeToLangCode(locale as Locale),
        },
      })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.shop)),
});

// DELETE

export type DeleteShopParams = WithLocale<{ id: string }>;

export const createDeleteShop = () => ({
  mutationFn: ({ locale, id }: DeleteShopParams) =>
    instance
      .delete(`${endpoints.webedit.shop}/${id}`, {
        params: {
          lang:
            locale === Global
              ? undefined
              : C.localeToLangCode(locale as Locale),
        },
      })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.shop)),
});
