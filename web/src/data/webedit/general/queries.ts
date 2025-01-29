import { useQuery } from '@tanstack/react-query';
import { GeneralContent } from './types';
import { endpoints, instance, StandardError } from '@data/api';
import { GetGeneralContentsRes } from '@data/webedit/general/api';

export interface UseGeneralContentsQProps {
  lang: string;
}

export interface UseGeneralContentQProps {
  id: string;
  lang: string;
}

export interface LangCountResponse {
  [key: string]: number;
}

export const useLangCount = (entity: string) => {
  return useQuery<LangCountResponse, Error>({
    queryKey: ['langCount', entity],
    queryFn: async () => {
      const response = await instance.get<LangCountResponse>(
        '/web-edit/count',
        {
          params: { entity },
        },
      );
      return response.data;
    },
  });
};

export const useGeneralContentsQ = ({ lang }: UseGeneralContentsQProps) => {
  return useQuery<GeneralContent[], StandardError>({
    queryKey: ['generalContent', lang],
    queryFn: async () => {
      const res = await instance.get<GetGeneralContentsRes>(
        endpoints.webedit.generalContent,
        {
          params: { lang },
        },
      );
      return res.data.map((gc) => ({
        id: String(gc.id),
        key: gc.key,
        value: gc.value,
        textType: gc.textType,
        name: gc.name,
        description: gc.description,
        createdAt: gc.createdAt,
        updatedAt: gc.updatedAt,
        createdBy: gc.createdBy || '',
        updatedBy: gc.updatedBy || '',
      }));
    },
  });
};

export const useGeneralContentQ = ({ id, lang }: UseGeneralContentQProps) => {
  return useQuery<GeneralContent, StandardError>({
    queryKey: ['generalContent', id, lang],
    queryFn: async () => {
      if (!id) {
        console.warn("Skipping fetch: 'id' is missing in useGeneralContentQ");
        return Promise.reject("Invalid request: 'id' is required.");
      }

      const response = await instance.get<GeneralContent>(
        `${endpoints.webedit.generalContent}/${id}`,
        { params: { lang } },
      );

      return response.data;
    },
    enabled: !!id,
  });
};
