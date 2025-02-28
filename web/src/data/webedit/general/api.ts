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
  imageUrl,
  lang,
}: Partial<GeneralContent> & { lang: string }) => ({
  lang,
  generalContent: {
    value: value,
    imageUrl: imageUrl ?? null,
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

export const getLangCount = (entity: string): Promise<LangCountResponse> =>
  instance
    .get<LangCountResponse>(endpoints.webedit.count, { params: { entity } })
    .then((response) => response.data);

export const createGetLangCount = (entity: string) => ({
  queryKey: ['langCount', entity],
  queryFn: () => getLangCount(entity),
});
