import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { Dialog } from '@components/shadcn/Dialog';

interface DialogContextTypes {
  openDialog: (content: ReactNode) => symbol;
  closeDialog: (id: symbol) => void;
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
  const [dialogs, setDialogs] = useState<OpenDialog[]>([]);

  const openDialog = useCallback((content: ReactNode) => {
    const id = Symbol();
    setDialogs((prev) => [{ id, content } as OpenDialog, ...prev]);
    return id;
  }, []);

  const closeDialog = useCallback((id: symbol) => {
    setDialogs((prev) => prev.filter((dialog) => dialog.id !== id));
  }, []);

  return (
    <DialogManagerContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      {!!dialogs.length && (
        <Dialog
          key={dialogs[0].id.toString()}
          open={true}
          onOpenChange={() => closeDialog(dialogs[0].id)}
        >
          {dialogs[0].content}
        </Dialog>
      )}
    </DialogManagerContext.Provider>
  );
};
