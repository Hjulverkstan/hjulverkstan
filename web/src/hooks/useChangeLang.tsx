import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Lang } from '@data/webedit/types';
import { usePreloadedData } from '@hooks/usePreloadedData';

export const useChangeLang = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { langs } = usePreloadedData();
  const { pathname, search, hash } = location;

  return useCallback((locale: Lang) => {
    const nonLocalisedPath = pathname.replace(
      new RegExp(`^/(?:${langs.join('|')})(?=/|$)`, 'i'),
      '',
    );

    navigate(`/${locale}${nonLocalisedPath}${search ?? ''}${hash ?? ''}`, {
      replace: true,
    });
  }, [langs, pathname, search, hash]);
};
