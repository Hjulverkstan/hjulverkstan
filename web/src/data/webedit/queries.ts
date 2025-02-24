import { useQuery } from '@tanstack/react-query';
import { getLangCount } from '@data/webedit/general/api';
import { LangCountResponse } from '@data/webedit/general/queries';

export const useLangCount = (entity: string) => {
  return useQuery<LangCountResponse, Error>({
    queryKey: ['langCount', entity],
    queryFn: () => getLangCount(entity),
  });
};
