import { createContext } from 'react';
import useStrictContext from '@hooks/useStrictContext';

const LangContext = createContext<null | string>(null);
LangContext.displayName = 'LocaleContext';

/**
 * Used around routes that should be able to use
 * [usePreloadedDataLocalized](#usePreloadedDataLocalized) so that the correct
 * language can be picked from the preloaded data automagically.
 */

export const LangProvider = LangContext.Provider;

export const useCurrentLang = (): string => {
  return useStrictContext(LangContext);
};
