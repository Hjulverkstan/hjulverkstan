import { createContext } from 'react';
import useStrictContext from '@hooks/useStrictContext';

const LocaleContext = createContext<null | string>(null);
LocaleContext.displayName = 'LocaleContext';

/**
 * Used around routes that should be able to use
 * [usePreloadedDataLocalized](#usePreloadedDataLocalized) so that the correct
 * language can be picked from the preloaded data automagically.
 */

export const LocaleProvider = LocaleContext.Provider;

export const useCurrentLocale = (): string => {
  return useStrictContext(LocaleContext);
};
