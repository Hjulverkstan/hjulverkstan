import React, { createContext, useContext, ReactNode } from 'react';
import usePersistentState from '@hooks/usePersistentState';

import * as Select from '@components/shadcn/Select';
import { useLangCount } from '@data/webedit/queries';
import { languageEnums } from '@data/webedit/enums';

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

  const languagesWithCounts = languageEnums.map(({ value, label }) => ({
    value,
    label,
    count: langCounts?.[value] || 0,
  }));

  return (
    <Select.Root
      value={selectedLang}
      onValueChange={(value) => setSelectedLang(value)}
    >
      <Select.Trigger className="w-40">
        <Select.Value placeholder="Select language…" />
      </Select.Trigger>
      <Select.Content>
        {languagesWithCounts.map(({ value, label, count }) => (
          <Select.Item key={value} value={value}>
            {`${label} (${count})`}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
