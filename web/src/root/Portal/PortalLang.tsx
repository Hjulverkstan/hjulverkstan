import React, { createContext, useContext, ReactNode } from 'react';
import usePersistentState from '@hooks/usePersistentState';
import { useLangCount } from '@data/webedit/general/queries';
import { LANGUAGE_ENUMS } from '@data/webedit/general/enums';

// Importera shadcn/Select-komponenterna
import * as ShadSelect from '@components/shadcn/Select';

const PortalLangContext = createContext<{
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
} | null>(null);

export const PortalLangProvider = ({ children }: { children: ReactNode }) => {
  const [selectedLang, setSelectedLang] = usePersistentState(
    'selectedLang',
    'ENG',
  );

  return (
    <PortalLangContext.Provider value={{ selectedLang, setSelectedLang }}>
      {children}
    </PortalLangContext.Provider>
  );
};

export const usePortalLang = () => {
  const context = useContext(PortalLangContext);
  if (!context) {
    throw new Error('usePortalLang must be used within PortalLangProvider');
  }
  return context;
};

export function PortalLangSelect({ entity }: { entity: string }) {
  const { selectedLang, setSelectedLang } = usePortalLang();
  const { data: langCounts } = useLangCount(entity);

  const languagesWithCounts = LANGUAGE_ENUMS.map(({ value, label }) => ({
    value,
    label,
    count: langCounts?.[value] || 0,
  }));

  return (
    <ShadSelect.Root
      value={selectedLang}
      onValueChange={(value) => setSelectedLang(value)}
    >
      <ShadSelect.Trigger className="w-40">
        <ShadSelect.Value placeholder="Select language…" />
      </ShadSelect.Trigger>
      <ShadSelect.Content>
        {languagesWithCounts.map(({ value, label, count }) => (
          <ShadSelect.Item key={value} value={value}>
            {`${label} (${count})`}
          </ShadSelect.Item>
        ))}
      </ShadSelect.Content>
    </ShadSelect.Root>
  );
}
