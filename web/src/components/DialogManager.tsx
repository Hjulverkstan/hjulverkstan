import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { Dialog, DialogContent, DialogTitle } from '@components/shadcn/Dialog';

interface DialogContextTypes {
  openDialog: (content: ReactNode) => symbol;
  closeDialog: (id?: symbol) => void;
}

const DialogManagerContext = createContext<undefined | DialogContextTypes>(
  undefined,
);

export const useDialogManager = () => {
  const dialog = useContext(DialogManagerContext);
  if (!dialog) {
    throw Error(
      'useDialog must be invoked in a descendant for <DialogProvider />',
    );
  }
  return dialog;
};

interface DialogProviderProps {
  children: ReactNode;
}

interface OpenDialog {
  id: symbol;
  content: ReactNode;
}

export const Provider = ({ children }: DialogProviderProps) => {
  const [current, setCurrent] = useState<OpenDialog | null>(null);

  const openDialog = useCallback((content: ReactNode) => {
    const id = Symbol();
    setCurrent({ id, content });
    return id;
  }, []);

  const closeDialog = useCallback((id?: symbol) => {
    setCurrent((prev) => (prev && (!id || prev.id === id) ? null : prev));
  }, []);

  return (
    <DialogManagerContext.Provider value={{ openDialog, closeDialog }}>
      {children}

      <Dialog
        key={String(current?.id)}
        open={!!current}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) closeDialog();
        }}
      >
        {current && (
          <DialogContent
            className="max-h-[85dvh] w-[92vw] overflow-hidden p-0 sm:max-w-lg"
          >
            <DialogTitle className="sr-only">Dialog</DialogTitle>
            {current.content}
          </DialogContent>
        )}
      </Dialog>
    </DialogManagerContext.Provider>
  );
};
