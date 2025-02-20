import { instance, parseResponseData } from '@data/api';

export const getShops = async (lang: string) => {
  try {
    const response = await instance.get('/web-edit/shop', { params: { lang } });

    if (Array.isArray(response.data)) {
      return response.data.map(parseResponseData);
    }

    const shops = response.data?.[lang]?.shop || [];
    if (!Array.isArray(shops)) {
      console.error('[API ERROR] Expected an array but received:', shops);
      throw new Error('API response is not an array');
    }

    return shops.map(parseResponseData);
  } catch (error) {
    console.error('[API ERROR] getShops:', error);
    throw error;
  }
};

export const getShop = async (id: string, lang: string) => {
  try {
    const response = await instance.get(`/web-edit/shop/${id}`, {
      params: { lang },
    });
    return parseResponseData(response.data);
  } catch (error) {
    console.error('[API ERROR] getShop:', error);
    throw error;
  }
};

export const createShop = async (body: any, lang: string) => {
  try {
    const payload = { lang, shop: body };
    const response = await instance.post('/web-edit/shop', payload);

    return parseResponseData(response.data);
  } catch (error) {
    console.error('[API ERROR] createShop:', error);
    throw error;
  }
};

export const editShop = async (id: string, body: any, lang: string) => {
  try {
    const payload = { lang, shop: body };
    const response = await instance.put(`/web-edit/shop/${id}`, payload);
    return parseResponseData(response.data);
  } catch (error) {
    console.error('[API ERROR] editShop:', error);
    throw error;
  }
};

export const deleteShop = async (id: string) => {
  try {
    const response = await instance.delete(`/web-edit/shop/${id}`);
    return parseResponseData(response.data);
  } catch (error) {
    console.error('[API ERROR] deleteShop:', error);
    throw error;
  }
};
