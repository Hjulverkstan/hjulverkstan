import { useQuery } from '@tanstack/react-query';
import { createGetLangCount } from '@data/webedit/general/api';
import { LangCountResponse } from '@data/webedit/general/queries';

export const useLangCount = (entity: string) =>
  useQuery<LangCountResponse, Error>(createGetLangCount(entity));
