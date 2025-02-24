import {
  createErrorHandler,
  endpoints,
  instance,
  parseResponseData,
} from '@data/api';
import { Shop } from './types';

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

const transformBody = ({
  name,
  address,
  latitude,
  longitude,
  imageUrl,
  openHours,
  hasTemporaryHours,
  locationId,
  bodyText,
  lang,
}: Partial<Shop> & { lang: string }) => {
  const defaultOpenHours = {
    mon: '',
    tue: '',
    wed: '',
    thu: '',
    fri: '',
    sat: '',
    sun: '',
  };

  const normalizedOpenHours =
    openHours && Object.values(openHours).some((day) => day.trim() !== '')
      ? openHours
      : defaultOpenHours;

  const payload = {
    lang,
    shop: {
      name,
      address,
      latitude,
      longitude,
      imageUrl,
      openHours: normalizedOpenHours,
      hasTemporaryHours,
      locationId,
      bodyText,
    },
  };

  console.log('[DEBUG] transformBody payload:', payload);
  return payload;
};

export type CreateShopRes = Shop;

export const createCreateShop = () => ({
  mutationFn: (body: CreateShopRes & { lang: string }) =>
    instance
      .post<CreateShopRes>(endpoints.webedit.shop, transformBody(body))
      .then((res) => {
        return parseResponseData(res.data) as Shop;
      })
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
