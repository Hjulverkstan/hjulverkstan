import { createContext } from 'react';

import useStrictContext from './useStrictContext';
import { LocaleAllEntitiesMap } from '@data/webedit/types';

//

const PreloadedDataContext = createContext<null | LocaleAllEntitiesMap>(null);
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

const LocaleContext = createContext<null | string>(null);
LocaleContext.displayName = 'LocaleContext';

/**
 * Used around routes that should be able to use
 * [usePreloadedDataLocalized](#usePreloadedDataLocalized) so that the correct
 * language can be picked from the preloaded data automagically.
 */

export const LocaleProvider = LocaleContext.Provider;

//

/**
 * Use preloaded data from the Static Site Generation build process. This hook
 * is to access the raw data, for using preloaded data in the react app, see:
 * [usePreloadedDataLocalized](#usePreloadedDataLocalized). For more information
 * about our Static Site Generation strategy see [link](link).
 */

export const usePreloadedData = () => {
  const data = useStrictContext(PreloadedDataContext);

  return { data, locales: Object.keys(data ?? {}) };
};

//

/**
 * Use preloaded data from the Static Site Generation build process, must be
 * used in a decendant of [LocaleProvider](#LocaleProvider) so that the correct
 * language can be infered. For more information about our Static Site
 * Generation strategy see [link](link).
 */

export const usePreloadedDataLocalized = () => {
  const data = useStrictContext(PreloadedDataContext);
  const locales = Object.keys(data ?? {});

  const locale = useStrictContext(LocaleContext);

  return {
    data: data?.[locale],
    currLocale: locale,
    locales,
  };
};
