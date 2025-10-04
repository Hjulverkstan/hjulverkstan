import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { Dialog, DialogContent } from '@components/shadcn/Dialog';

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
          onOpenChange={(open) => {
            if (!open) closeDialog(dialogs[0].id);
          }}
        >
          <DialogContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="bg-background w-[min(92vw,32rem)] overflow-hidden
              rounded-2xl border p-0 shadow-2xl sm:w-[min(90vw,32rem)]"
          >
            {dialogs[0].content}
          </DialogContent>
        </Dialog>
      )}
    </DialogManagerContext.Provider>
  );
};
