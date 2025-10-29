import * as C from '@utils/common';

import { createErrorHandler, endpoints, instance } from '../api';

import { AllEntities, Locale } from './types';

// GET ALL ENTITIES BY LANG

export interface GetAllEndpointsRes {
  entities: Record<Locale, AllEntities>;
}

export interface GetAllWebEditEntitiesByLangParams {
  fallbackLocale: string;
}

export const getAllWebEditEntitiesByLang = (
  { fallbackLocale }: GetAllWebEditEntitiesByLangParams,
  baseURL?: string,
) =>
  instance
    .get<GetAllEndpointsRes>(endpoints.webedit.all, {
      params: { fallbackLang: C.localeToLangCode(fallbackLocale) },
      timeout: 150000,
      ...(baseURL && { baseURL }),
    })
    .then((res) =>
      Object.fromEntries(
        Object.entries(res.data.entities).map(([lang, allEntities]) => [
          C.langCodeToLocale(lang),
          allEntities,
        ]),
      ),
    )
    .catch(createErrorHandler(endpoints.webedit.all));

// LANG COUNT

export type GetLangCountParams = { entity: string };

export const createGetLangCount = ({ entity }: GetLangCountParams) => ({
  queryKey: [endpoints.webedit.count, entity],
  queryFn: () =>
    instance
      .get(`${endpoints.webedit.count}/${entity}`)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.webedit.count)),
});
