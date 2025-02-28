import {
  createErrorHandler,
  endpoints,
  instance,
  parseResponseData,
} from '@data/api';
import { Shop } from './types';
import { Language } from '@data/webedit/language';

export interface GetShopsRes {
  shops: Shop[];
}

export const createGetShops = (lang: string) => ({
  queryKey: ['shops', lang],
  queryFn: () =>
    instance
      .get<GetShopsRes>(endpoints.webedit.shop, { params: { lang } })
      .then(
        (res) =>
          (res.data as unknown as Shop[])
            .map(parseResponseData)
            .reverse() as Shop[],
      )
      .catch(createErrorHandler(endpoints.webedit.shop)),
});

export type GetShopRes = Shop;

export interface GetShopParams {
  id: string;
}

export const createGetShop = ({
  id,
  lang,
}: GetShopParams & { id: string; lang: string }) => ({
  queryKey: ['shop', id, lang],
  queryFn: () =>
    instance
      .get<GetShopRes>(`${endpoints.webedit.shop}/${id}`, { params: { lang } })
      .then((res) => parseResponseData(res.data) as Shop)
      .catch(createErrorHandler(endpoints.webedit.shop)),
});

// MUTATIONS

const transformBody = (formData: Record<string, any> & { lang: Language }) => ({
  lang: formData.lang,
  shop: {
    name: formData.name,
    address: formData.address,
    latitude: formData.latitude,
    longitude: formData.longitude,
    imageURL: formData.imageURL,
    openHours: {
      mon: formData['openHours.mon'],
      tue: formData['openHours.tue'],
      wed: formData['openHours.wed'],
      thu: formData['openHours.thu'],
      fri: formData['openHours.fri'],
      sat: formData['openHours.sat'],
      sun: formData['openHours.sun'],
    },
    hasTemporaryHours: formData.hasTemporaryHours,
    locationId: formData.locationId,
    bodyText: formData.bodyText,
  },
});

export type CreateShopRes = Shop;

export const createCreateShop = () => ({
  mutationFn: (body: Shop & { lang: Language }) =>
    instance
      .post<CreateShopRes>(endpoints.webedit.shop, transformBody(body))
      .then((res) => parseResponseData(res.data) as Shop)
      .catch(createErrorHandler(endpoints.webedit.shop)),
});

export type EditShopRes = Shop;
export type EditShopParams = Shop;

export const createEditShop = () => ({
  mutationFn: (body: EditShopParams & { lang: string }) =>
    instance
      .put<EditShopRes>(
        `${endpoints.webedit.shop}/${body.id}`,
        transformBody(body),
      )
      .then((res) => parseResponseData(res.data) as Shop)
      .catch(createErrorHandler(endpoints.webedit.shop)),
});

export const createDeleteShop = () => ({
  mutationFn: (id: string) =>
    instance
      .delete<GetShopRes>(`${endpoints.webedit.shop}/${id}`)
      .then((res) => parseResponseData(res.data) as Shop)
      .catch(createErrorHandler(endpoints.webedit.shop)),
});
