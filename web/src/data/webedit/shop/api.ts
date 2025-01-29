import { instance } from '@data/api';

export const getShops = async (lang: string) => {
  console.log(`[API CALL] Fetching shops with lang: ${lang}`);

  try {
    const response = await instance.get('/web-edit/shop', { params: { lang } });
    console.log('[API RAW RESPONSE]', response.data);

    if (Array.isArray(response.data)) {
      console.log('[API RESPONSE]', response.data);
      return response.data;
    }

    const shops = response.data?.[lang]?.shop || [];
    if (!Array.isArray(shops)) {
      console.error('[API ERROR] Expected an array but received:', shops);
      throw new Error('API response is not an array');
    }

    console.log('[API RESPONSE]', shops);
    return shops;
  } catch (error) {
    console.error('[API ERROR] getShops:', error);
    throw error;
  }
};

export const getShop = async (id: string, lang: string) => {
  const response = await instance.get(`/web-edit/shop/${id}`, {
    params: { lang },
  });
  return response.data;
};

export const createShop = async (body: any, lang: string) => {
  const payload = { lang, shop: body };
  const response = await instance.post('/web-edit/shop', payload);
  return response.data;
};

export const editShop = async (id: string, body: any, lang: string) => {
  const payload = { lang, shop: body };
  const response = await instance.put(`/web-edit/shop/${id}`, payload);
  return response.data;
};

export const deleteShop = async (id: string) => {
  const response = await instance.delete(`/web-edit/shop/${id}`);
  return response.data;
};
