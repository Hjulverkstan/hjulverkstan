import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ImageEditContextType {
  activeKey: string | null;
  setActiveKey: (key: string | null) => void;
}

const ImageEditContext = createContext<ImageEditContextType | undefined>(
  undefined,
);

export const ImageEditProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  return (
    <ImageEditContext.Provider value={{ activeKey, setActiveKey }}>
      {children}
    </ImageEditContext.Provider>
  );
};

export const useImageEditContext = () => {
  const context = useContext(ImageEditContext);
  if (!context) {
    throw new Error(
      'useImageEditContext must be used within an ImageEditProvider',
    );
  }
  return context;
};
