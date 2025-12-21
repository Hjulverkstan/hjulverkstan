import { createContext } from 'react';

import { LangAllEntitiesMap } from '@data/webedit/types';

import useStrictContext from './useStrictContext';
import { useCurrentLang } from '@hooks/useCurrentLang';

//

const PreloadedDataContext = createContext<null | LangAllEntitiesMap>(null);
PreloadedDataContext.displayName = 'PreloadedDataContext';

/**
 * Used by src/server.tsx and src/client.tsx to provide the preloaded data to
 * the react app. For now contains only data from /webedit/get-all but could
 * have other data from server side in the future. See [link](link) for more
 * information about the architecture behind preloaded data and our strategy
 * around Static Site Generation.
 */

export const PreloadedDataProvider = PreloadedDataContext.Provider;

//

/**
 * Use preloaded data from the Static Site Generation build process. This hook
 * is to access the raw data, for using preloaded data in the react app, see:
 * [usePreloadedDataLocalized](#usePreloadedDataLocalized). For more information
 * about our Static Site Generation strategy see [link](link).
 */

export const usePreloadedData = () => {
  const data = useStrictContext(PreloadedDataContext);

  return { data, langs: Object.keys(data ?? {}) };
};

//

/**
 * Use preloaded data from the Static Site Generation build process, must be
 * used in a decendant of [LangProvider](#LangProvider) so that the correct
 * language can be infered. For more information about our Static Site
 * Generation strategy see [link](link).
 */

export const usePreloadedDataLocalized = () => {
  const lang = useCurrentLang();
  const data = useStrictContext(PreloadedDataContext);
  const langs = Object.keys(data ?? {});

  return {
    data: data?.[lang],
    currLang: lang,
    langs,
  };
};
