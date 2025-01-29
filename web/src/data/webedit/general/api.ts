import { createErrorHandler, endpoints, instance } from '@data/api';
import { AllEntitiesRaw } from '@data/webedit/types';

export type GetGeneralContentsRes = AllEntitiesRaw['generalContent'];

export const createEditGeneralContent = () => ({
  mutationFn: (body) => {
    if (!body.id) {
      console.error("Error: 'id' is missing in createEditGeneralContent", body);
      return Promise.reject(new Error("Invalid request: 'id' is required."));
    }

    const formattedBody = {
      lang: body.lang,
      generalContent: {
        id: body.id,
        key: body.key,
        value: body.value,
        textType: body.textType,
        name: body.name,
        description: body.description,
        createdAt: body.createdAt,
        updatedAt: body.updatedAt,
      },
    };

    return instance
      .put(`${endpoints.webedit.generalContent}/${body.id}`, formattedBody)
      .then((res) => {
        console.log('✅ Backend svar:', res.data);
        return res.data;
      })
      .catch(createErrorHandler(endpoints.webedit.generalContent));
  },
});
