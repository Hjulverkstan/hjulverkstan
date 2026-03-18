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
import { Lang } from '@data/webedit/types';
import useStrictContext from '@hooks/useStrictContext';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import usePersistentState from '@hooks/usePersistentState';
import usePortalSlugs from '@hooks/useSlugs';
import { fallbackLang } from '@root';

//

const PortalWebEditLangContext = createContext<{
  lang: Lang;
  setLang: Dispatch<SetStateAction<Lang>>;
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
  const [lang, setLang] = usePersistentState<Lang>(
    'web-edit-lang',
    fallbackLang,
  );

  if ((lang as string) === 'global') {
    setLang(fallbackLang);
  }

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
  const disabled = tailSlug?.includes('create') || tailSlug?.includes('edit');

  return (
    <div>
      <Select$.Root value={lang} onValueChange={(lang: Lang) => setLang(lang)}>
        <Select$.Trigger
          className="h-8"
          variant="translation"
          disabled={disabled}
        >
          <Globe className="h-4 w-4" />
          <Select$.Value />
        </Select$.Trigger>
        <Select$.Content className="border-purple-border border">
          {enums.lang.map(({ label, value }) => (
            <Select$.Item
              key={value}
              value={value}
              className="focus:bg-purple-fill focus:text-purple-foreground"
            >
              {label}
            </Select$.Item>
          ))}
        </Select$.Content>
      </Select$.Root>
    </div>
  );
};
