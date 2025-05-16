import * as U from '@utils';

import {
  createErrorHandler,
  endpoints,
  instance,
  parseResponseData,
} from '../api';

import { AllEntities, AllEntitiesRaw, LangSlug } from './types';

//

export interface GetAllEndpointsRes {
  entities: Record<LangSlug, AllEntitiesRaw>;
}

export interface GetAllWebEditEntitiesByLangProps {
  fallBackLocale: string;
}

export const getAllWebEditEntitiesByLang = (
  { fallBackLocale }: GetAllWebEditEntitiesByLangProps,
  baseURL?: string,
) =>
  instance
    .get<GetAllEndpointsRes>(endpoints.webedit.all, {
      params: { fallbackLang: U.localeToLangCode(fallBackLocale) },
      timeout: 15000,
      ...(baseURL && { baseURL }),
    })
    .then(
      (res) =>
        Object.fromEntries(
          Object.entries(res.data.entities).map(
            ([lang, { generalContent, shops, story }]) => [
              // We use locales instead of langs for the keys
              U.langCodeToLocale(lang),
              {
                // General content should a map instead of array
                generalContent: Object.fromEntries(
                  generalContent.map((gc) => [gc.key, gc.value]),
                ),
                shops: shops.map(parseResponseData).reverse(),
                story: story.map(parseResponseData).reverse(),
              },
            ],
          ),
        ) as Record<LangSlug, AllEntities>,
    )
    .catch(createErrorHandler(endpoints.webedit.all));
