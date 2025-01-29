import {
  createErrorHandler,
  endpoints,
  instance,
  parseResponseData,
} from '@data/api';
import { GeneralContent } from './types';
import { LangCountResponse } from '@data/webedit/general/queries';

export interface GetGeneralContentsRes {
  generalContents: GeneralContent[];
}

export const createGetGeneralContents = (lang: string) => ({
  queryKey: ['generalContents', lang],
  queryFn: () =>
    instance
      .get<GetGeneralContentsRes>(endpoints.webedit.generalContent, {
        params: { lang },
      })
      .then(
        (res) =>
          (res.data as unknown as GeneralContent[])
            .map(parseResponseData)
            .reverse() as GeneralContent[],
      )
      .catch(createErrorHandler(endpoints.webedit.generalContent)),
});

export const createGetGeneralContent = ({
  id,
  lang,
}: {
  id: string;
  lang: string;
}) => ({
  queryKey: ['generalContent', id, lang],
  queryFn: () =>
    instance
      .get<GeneralContent>(`${endpoints.webedit.generalContent}/${id}`, {
        params: { lang },
      })
      .then((res) => parseResponseData(res.data) as GeneralContent)
      .catch(createErrorHandler(endpoints.webedit.generalContent)),
});

// MUTATIONS

const transformBody = ({
  value,
  lang,
}: Partial<GeneralContent> & { lang: string }) => ({
  value,
  lang,
  generalContent: {
    value: value,
  },
});

export const createEditGeneralContent = () => ({
  mutationFn: (body: GeneralContent) =>
    instance
      .put<GeneralContent>(
        `${endpoints.webedit.generalContent}/${body.id}`,
        transformBody(body),
      )
      .then((res) => parseResponseData(res.data) as GeneralContent)
      .catch(createErrorHandler(endpoints.webedit.generalContent)),
});

export const getLangCount = async (
  entity: string,
): Promise<LangCountResponse> => {
  const response = await instance.get<LangCountResponse>(
    endpoints.webedit.count,
    {
      params: { entity },
    },
  );
  return response.data;
};
