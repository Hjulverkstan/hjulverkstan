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
import { Global, Lang, WebEditLang } from '@data/webedit/types';
import useStrictContext from '@hooks/useStrictContext';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import usePersistentState from '@hooks/usePersistentState';
import usePortalSlugs from '@hooks/useSlugs';
import { cn } from '@utils/common';

//

const PortalWebEditLangContext = createContext<{
  lang: WebEditLang;
  setLang: Dispatch<SetStateAction<WebEditLang>>;
} | null>(null);

//

export const usePortalWebEditLang = () => {
  const { lang } = useStrictContext(PortalWebEditLangContext);
  return lang;
};

//

export interface PortalWebEditLangProviderProps {
  children: ReactNode;
}

export const Provider = ({ children }: PortalWebEditLangProviderProps) => {
  const [lang, setLang] = usePersistentState<WebEditLang>(
    'web-edit-lang',
    Global,
  );

  return (
    <PortalWebEditLangContext.Provider value={{ lang, setLang }}>
      {children}
    </PortalWebEditLangContext.Provider>
  );
};

//

export const Select = () => {
  const enums = useTranslateRawEnums<typeof enumsRaw>(enumsRaw);
  const { lang, setLang } = useStrictContext(PortalWebEditLangContext);

  const { tailSlug } = usePortalSlugs();

  return (
    <div>
      <Select$.Root value={lang} onValueChange={(lang: Lang) => setLang(lang)}>
        <Select$.Trigger
          className="h-8"
          variant={lang === Global ? 'accent' : 'translation'}
          disabled={!!tailSlug}
        >
          <Globe className="h-4 w-4" />
          <Select$.Value />
        </Select$.Trigger>
        <Select$.Content
          className={cn(lang !== Global && 'border-purple-border border')}
        >
          {enums.lang.map(({ label, value }) => (
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
