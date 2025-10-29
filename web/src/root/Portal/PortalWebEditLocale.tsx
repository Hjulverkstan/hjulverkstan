import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
} from 'react';
import { Globe } from 'lucide-react';

// use $ to prevent conflict with export const Select
import * as Select$ from '@components/shadcn/Select';
import * as enumsRaw from '@data/translations/enums';
import { Global, Locale, LocaleAndGlobal } from '@data/webedit/types';
import useStrictContext from '@hooks/useStrictContext';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import usePersistentState from '@hooks/usePersistentState';
import usePortalSlugs from '@hooks/useSlugs';
import { cn } from '@utils/common';

//

const PortalWebEditLocaleContext = createContext<{
  locale: LocaleAndGlobal;
  setLocale: Dispatch<SetStateAction<LocaleAndGlobal>>;
} | null>(null);

//

export const usePortalWebEditLocale = () => {
  const { locale } = useStrictContext(PortalWebEditLocaleContext);
  return locale;
};

//

export interface PortalWebEditLocaleProviderProps {
  children: ReactNode;
}

export const Provider = ({ children }: PortalWebEditLocaleProviderProps) => {
  const [locale, setLocale] = usePersistentState<LocaleAndGlobal>(
    'web-edit-locale',
    Global,
  );

  return (
    <PortalWebEditLocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </PortalWebEditLocaleContext.Provider>
  );
};

//

export const Select = () => {
  const enums = useTranslateRawEnums<typeof enumsRaw>(enumsRaw);
  const { locale, setLocale } = useStrictContext(PortalWebEditLocaleContext);

  const { tailSlug } = usePortalSlugs();

  return (
    <div>
      <Select$.Root
        value={locale}
        onValueChange={(locale: Locale) => setLocale(locale)}
      >
        <Select$.Trigger
          className="h-8"
          variant={locale === Global ? 'accent' : 'translation'}
          disabled={!!tailSlug}
        >
          <Globe className="h-4 w-4" />
          <Select$.Value />
        </Select$.Trigger>
        <Select$.Content
          className={cn(locale !== Global && 'border-purple-border border')}
        >
          {enums.locale.map(({ label, value }) => (
            <Select$.Item
              key={value}
              value={value}
              className={cn(
                value !== Global &&
                  'focus:bg-purple-fill' + ' focus:text-purple-foreground',
              )}
            >
              {label}
            </Select$.Item>
          ))}
        </Select$.Content>
      </Select$.Root>
    </div>
  );
};
