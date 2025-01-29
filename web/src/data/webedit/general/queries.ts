import { useQuery } from '@tanstack/react-query';
import { StandardError } from '@data/api';
import * as api from './api';
import { GeneralContent } from '@data/webedit/general/types';

export interface LangCountResponse {
  [key: string]: number;
}

export interface UseGeneralContentQ {
  id: string;
  lang: string;
}

export const useGeneralContentsQ = (lang: string) =>
  useQuery<GeneralContent[], StandardError>({
    ...api.createGetGeneralContents(lang),
    queryKey: ['generalContents', lang],
    enabled: !!lang,
  });

export const useGeneralContentQ = ({ id, lang }: UseGeneralContentQ) =>
  useQuery<GeneralContent, StandardError>({
    ...api.createGetGeneralContent({ id, lang }),
    enabled: !!id && !!lang,
  });
