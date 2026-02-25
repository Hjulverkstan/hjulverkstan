import { createErrorHandler, endpoints, instance } from '../../api';
import { ListResponse } from '../../types';
import { Lang, WithLang } from '../types';

import { Shop } from './types';

// GET ALL

export type GetShopsRes = ListResponse<Shop>;
export type GetShopsParams = { lang: Lang };

export const createGetShops = ({ lang }: GetShopsParams) => ({
  queryKey: [endpoints.webedit.shop, lang],
  queryFn: () =>
    instance
      .get<GetShopsRes>(endpoints.webedit.shop, { params: { lang } })
      .then((res) => res.data.content)
      .catch(createErrorHandler(endpoints.webedit.shop)),
});

// GET

export type GetShopRes = Shop;
export type GetShopParams = WithLang<{ id: string }>;

export const createGetShop = ({ id, lang }: GetShopParams) => ({
  queryKey: [endpoints.webedit.shop, id, lang],
  queryFn: () =>
    instance
      .get<GetShopRes>(`${endpoints.webedit.shop}/${id}`, { params: { lang } })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.shop)),
});

// CREATE

export type CreateShopRes = Shop;
export type CreateShopParams = WithLang<Omit<Shop, 'id'>>;

export const createCreateShop = () => ({
  mutationFn: ({ lang, ...body }: CreateShopParams) =>
    instance
      .post<CreateShopRes>(`${endpoints.webedit.shop}`, body, { params: { lang } })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.shop)),
});

// EDIT

export type EditShopRes = Shop;
export type EditShopParams = WithLang<Shop>;

export const createEditShop = () => ({
  mutationFn: ({ id, lang, ...body }: EditShopParams) =>
    instance
      .put<EditShopRes>(`${endpoints.webedit.shop}/${id}`, body, { params: { lang } })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.shop)),
});

// DELETE

export type DeleteShopParams = WithLang<{ id: string }>;

export const createDeleteShop = () => ({
  mutationFn: ({ id, lang }: DeleteShopParams) =>
    instance
      .delete(`${endpoints.webedit.shop}/${id}`, { params: { lang } })
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.shop)),
});
