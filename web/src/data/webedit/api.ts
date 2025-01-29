import * as U from '@utils';
import {
  createErrorHandler,
  endpoints,
  instance,
  parseResponseData,
} from '../api';
import { AllEntities, AllEntitiesRaw, LangCode } from './types';

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
    .then((res) => {
      const parsedEntities = Object.fromEntries(
        Object.entries(res.data.entities).map(([lang, data]) => {
          const typedLang = lang as LangCode;

          return [
            U.langCodeToLocale(typedLang),
            {
              generalContent: data.generalContent.map((gc) => ({
                id: gc.id,
                key: gc.key,
                value: gc.value,
                textType: gc.textType,
                name: gc.name,
                description: gc.description,
                createdAt: gc.createdAt || new Date().toISOString(),
                updatedAt: gc.updatedAt || new Date().toISOString(),
              })),
              shop: data.shop.map(parseResponseData).reverse(),
            },
          ];
        }),
      ) as unknown as Record<LangCode, AllEntities>;

      return parsedEntities;
    })
    .catch(createErrorHandler(endpoints.webedit.all));
