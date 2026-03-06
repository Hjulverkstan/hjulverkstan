import { createErrorHandler, endpoints, instance } from '../../api';
import { ListResponse } from '../../types';
import { Global, WebEditLang, WithWebEditLang } from '../types';

import { Shop } from './types';

// GET ALL

export type GetShopsRes = ListResponse<Shop>;
export type GetShopsParams = { lang: WebEditLang };

export const createGetShops = ({ lang }: GetShopsParams) => ({
  queryKey: [endpoints.webedit.shop, lang],
  queryFn: () =>
    instance
      .get<GetShopsRes>(endpoints.webedit.shop, {
        params: {
          lang: lang === Global ? undefined : lang,
        },
      })
      .then((res) => res.data.content)
      .catch(createErrorHandler(endpoints.webedit.shop)),
});

// GET

export type GetShopRes = Shop;
export type GetShopParams = WithWebEditLang<{ id: string }>;

export const createGetShop = ({ id, lang }: GetShopParams) => ({
  queryKey: [endpoints.webedit.shop, id, lang],
  queryFn: () =>
    instance
      .get<GetShopRes>(`${endpoints.webedit.shop}/${id}`, {
        params: {
          lang: lang === Global ? undefined : lang,
        },
      })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.shop)),
});

// CREATE

export type CreateShopRes = Shop;
export type CreateShopParams = WithWebEditLang<Omit<Shop, 'id'>>;

export const createCreateShop = () => ({
  mutationFn: ({ lang, ...body }: CreateShopParams) =>
    instance
      .post<CreateShopRes>(`${endpoints.webedit.shop}`, body, {
        params: {
          lang: lang === Global ? undefined : lang,
        },
      })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.shop)),
});

// EDIT

export type EditShopRes = Shop;
export type EditShopParams = WithWebEditLang<Shop>;

export const createEditShop = () => ({
  mutationFn: ({ id, lang, ...body }: EditShopParams) =>
    instance
      .put<EditShopRes>(`${endpoints.webedit.shop}/${id}`, body, {
        params: {
          lang: lang === Global ? undefined : lang,
        },
      })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.shop)),
});

// DELETE

export type DeleteShopParams = WithWebEditLang<{ id: string }>;

export const createDeleteShop = () => ({
  mutationFn: ({ id, lang }: DeleteShopParams) =>
    instance
      .delete(`${endpoints.webedit.shop}/${id}`, {
        params: {
          lang: lang === Global ? undefined : lang,
        },
      })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.shop)),
});
