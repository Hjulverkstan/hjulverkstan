import { useQuery } from '@tanstack/react-query';

import { GeneralContent } from './types';
import * as api from './api';
import { EnumAttributes } from '@data/enums';
import { ErrorRes } from '@data/api';

//

export const useGeneralContentsQ = () =>
  useQuery<GeneralContent[], ErrorRes>(api.createGetGeneralContent());

export interface UseGeneralContentQProps {
  id: string;
}

export const useWebEditCountQ = () =>
  useQuery<number, ErrorRes>(api.createGetWebEditCount());

export const useGeneralContentQ = ({ id }: UseGeneralContentQProps) =>
  useQuery<GeneralContent, ErrorRes>({
    ...api.createGetGeneralContentItem({ id }),
    enabled: !!id,
  });

//

export const useGeneralContentsAsEnumsQ = ({
  dataKey = 'generalContentId',
} = {}) =>
  useQuery<GeneralContent[], ErrorRes, EnumAttributes[]>({
    ...api.createGetGeneralContent(),
    select: (generalContents) =>
      generalContents?.map((generalContent) => ({
        dataKey,
        label: generalContent.title,
        value: generalContent.id,
      })) ?? [],
  });
