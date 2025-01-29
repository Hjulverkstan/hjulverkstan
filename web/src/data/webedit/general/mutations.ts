import { useMutation } from '@tanstack/react-query';
import * as api from './api';
import { queryClient } from '@root';
import { usePortalLang } from '../../../root/Portal/PortalLang';

export const useEditGeneralContentM = () => {
  const { selectedLang } = usePortalLang();

  return useMutation({
    mutationFn: async (body) => {
      return api
        .createEditGeneralContent()
        .mutationFn({ ...body, lang: selectedLang });
    },
    onSuccess: (_data) => {
      queryClient.invalidateQueries(['generalContent', selectedLang]);
    },
  });
};
