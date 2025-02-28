import { useQuery } from '@tanstack/react-query';
import { StandardError } from '@data/api';
import * as api from './api';
import { GeneralContent } from '@data/webedit/general/types';
import { usePortalLang } from '../../../root/Portal/PortalLang';

export interface LangCountResponse {
  [key: string]: number;
}

export interface UseGeneralContentQ {
  id: string;
  lang: string;
}

export const useGeneralContentsQ = () => {
  const { selectedLang } = usePortalLang();
  return useQuery<GeneralContent[], StandardError>({
    ...api.createGetGeneralContents(selectedLang),
    queryKey: ['generalContents', selectedLang],
    enabled: !!selectedLang,
  });
};

export const useGeneralContentQ = ({ id }: { id: string }) => {
  const { selectedLang } = usePortalLang();
  return useQuery<GeneralContent, StandardError>({
    ...api.createGetGeneralContent({ id, lang: selectedLang }),
    enabled: !!id && !!selectedLang,
  });
};
