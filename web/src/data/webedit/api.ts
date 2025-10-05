import * as U from '@utils';

import { createErrorHandler, endpoints, instance } from '../api';

import { AllEntities, LangSlug } from './types';

//

export interface GetAllEndpointsRes {
  entities: Record<LangSlug, AllEntities>;
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
      params: { fallbackLang: U.localeToLangCode(fallbackLocale) },
      timeout: 150000,
      ...(baseURL && { baseURL }),
    })
    .then((res) =>
      Object.fromEntries(
        Object.entries(res.data.entities).map(([lang, allEntities]) => [
          U.langCodeToLocale(lang),
          allEntities,
        ]),
      ),
    )
    .catch(createErrorHandler(endpoints.webedit.all));
