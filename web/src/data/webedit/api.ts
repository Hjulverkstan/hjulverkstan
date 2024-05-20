import * as U from '@utils';

import {
  createErrorHandler,
  endpoints,
  instance,
  parseResponseData,
} from '../api';

import { AllEntities, AllEntitiesRaw, LangCode } from './types';

//

export interface GetAllEndpointsRes {
  entities: Record<LangCode, AllEntitiesRaw>;
}

export interface GetAllWebEditEntitiesByLangProps {
  fallBackLocale: string;
}

export const getAllWebEditEntitiesByLang = ({
  fallBackLocale,
}: GetAllWebEditEntitiesByLangProps) =>
  instance
    .get<GetAllEndpointsRes>(endpoints.webedit.all, {
      params: { fallbackLang: U.localeToLangCode(fallBackLocale) },
      timeout: 10000,
    })
    .then(
      (res) =>
        Object.fromEntries(
          Object.entries(res.data.entities).map(
            ([lang, { generalContent, shop }]) => [
              // We use locales instead of langs for the keys
              U.langCodeToLocale(lang),
              {
                // General content should a map instead of array
                generalContent: Object.fromEntries(
                  generalContent.map((gc) => [gc.key, gc.value]),
                ),
                shop: shop.map(parseResponseData).reverse(),
              },
            ],
          ),
        ) as Record<LangCode, AllEntities>,
    )
    .catch(createErrorHandler(endpoints.webedit.all));
