import {
  instance,
  endpoints,
  createErrorHandler,
  parseResponseData,
} from '@data/api';
import { GeneralContent } from './types';

export interface GetGeneralContentRes {
  generalContent: GeneralContent[];
}

export interface GetWebEditCountRes {
  count: number;
}

export const createGetWebEditCount = () => ({
  queryKey: ['webEditCount'],
  queryFn: () =>
    instance
      .get<GetWebEditCountRes>(endpoints.webedit.count)
      .then((res) => res.data.count)
      .catch(createErrorHandler(endpoints.webedit.count)),
});

export const createGetGeneralContent = () => ({
  queryKey: ['generalContent'],
  queryFn: () =>
    instance
      .get<GetGeneralContentRes>(endpoints.webedit.generalContent)
      .then(
        (res) =>
          res.data.generalContent
            .map(parseResponseData)
            .reverse() as GeneralContent[],
      )
      .catch(createErrorHandler(endpoints.webedit.generalContent)),
});

export type GetGeneralContentItemRes = GeneralContent;

export interface GetGeneralContentItemParams {
  id: string;
}

export const createGetGeneralContentItem = ({
  id,
}: GetGeneralContentItemParams) => ({
  queryKey: ['generalContent', id],
  queryFn: () =>
    instance
      .get<GetGeneralContentItemRes>(endpoints.webedit.generalContentById(id))
      .then((res) => parseResponseData(res.data) as GeneralContent)
      .catch(createErrorHandler(endpoints.webedit.generalContent)),
});

export type CreateGeneralContentParams = Omit<GeneralContent, 'id'>;

export type CreateGeneralContentRes = GeneralContent;

export const createCreateGeneralContent = () => ({
  mutationFn: (body: CreateGeneralContentParams) =>
    instance
      .post<CreateGeneralContentRes>(endpoints.webedit.generalContent, body)
      .then((res) => parseResponseData(res.data) as GeneralContent)
      .catch(createErrorHandler(endpoints.webedit.generalContent)),
});

export type EditGeneralContentParams = GeneralContent;

export type EditGeneralContentRes = GeneralContent;

export const createEditGeneralContent = () => ({
  mutationFn: (body: EditGeneralContentParams) =>
    instance
      .put<EditGeneralContentRes>(
        endpoints.webedit.generalContentById(body.id),
        body,
      )
      .then((res) => parseResponseData(res.data) as GeneralContent)
      .catch(createErrorHandler(endpoints.webedit.generalContent)),
});

export const createDeleteGeneralContent = () => ({
  mutationFn: (id: string) =>
    instance
      .delete(endpoints.webedit.generalContentById(id))
      .then((res) => parseResponseData(res.data) as GeneralContent)
      .catch(createErrorHandler(endpoints.webedit.generalContent)),
});
