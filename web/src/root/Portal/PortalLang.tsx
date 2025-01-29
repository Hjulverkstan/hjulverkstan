import React, { createContext, useContext, ReactNode } from 'react';
import usePersistentState from '@hooks/usePersistentState';
import { useLangCount } from '@data/webedit/general/queries';
import { LANGUAGE_ENUMS } from '@data/webedit/general/enums';

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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLang(e.target.value);
  };

  const languagesWithCounts = LANGUAGE_ENUMS.map(({ value, label }) => ({
    value,
    label,
    count: langCounts?.[value] || 0,
  }));

  return (
    <select value={selectedLang} onChange={handleChange}>
      {languagesWithCounts.map(({ value, label, count }) => (
        <option key={value} value={value}>
          {`${label} (${count})`}
        </option>
      ))}
    </select>
  );
}
