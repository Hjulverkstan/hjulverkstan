import { createErrorHandler, endpoints, instance } from '../api';

import { AllEntities, Lang } from './types';

// GET ALL ENTITIES BY LANG

export interface GetAllEndpointsRes {
  entities: Record<Lang, AllEntities>;
}

export interface GetAllWebEditEntitiesByLangParams {
  fallbackLang: string;
}

export const getAllWebEditEntitiesByLang = (
  { fallbackLang }: GetAllWebEditEntitiesByLangParams,
  baseURL?: string,
) =>
  instance
    .get<GetAllEndpointsRes>(endpoints.webedit.all, {
      params: { fallbackLang },
      timeout: 150000,
      ...(baseURL && { baseURL }),
    })
    .then((res) => res.data.entities)
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
