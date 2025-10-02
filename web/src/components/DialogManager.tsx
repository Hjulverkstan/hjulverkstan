import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';
import { Dialog, DialogContent } from '@components/shadcn/Dialog';
import { useLocation } from 'react-router-dom';

type OpenOptions = { key?: string; replaceIfOpen?: boolean };

interface DialogContextTypes {
  openDialog: (content: ReactNode, options?: OpenOptions) => symbol;
  closeDialog: (id: symbol) => void;
  closeAllDialogs: () => void;
}

const Ctx = createContext<DialogContextTypes | undefined>(undefined);

export const useDialogManager = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw Error('useDialogManager måste anropas under <Provider />');
  return ctx;
};

interface OpenDialog {
  id: symbol;
  key?: string;
  content: ReactNode;
}

export const Provider = ({ children }: { children: ReactNode }) => {
  const [dialogs, setDialogs] = useState<OpenDialog[]>([]);
  const location = useLocation();

  const openDialog = useCallback(
    (content: ReactNode, options?: OpenOptions) => {
      const id = Symbol();
      const key = options?.key;

      setDialogs((prev) => {
        if (key) {
          const i = prev.findIndex((d) => d.key === key);
          if (i !== -1) {
            if (options?.replaceIfOpen) {
              const next = [...prev];
              next[i] = { id, key, content };
              return next;
            }
            return prev;
          }
        }

        return [...prev, { id, key, content }];
      });

      return id;
    },
    [],
  );

  const closeDialog = useCallback((id: symbol) => {
    setDialogs((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const closeAllDialogs = useCallback(() => {
    setDialogs([]);
  }, []);

  useEffect(() => {
    setDialogs([]);
  }, [location.pathname]);

  return (
    <Ctx.Provider value={{ openDialog, closeDialog, closeAllDialogs }}>
      {children}

      {dialogs.map((d) => (
        <Dialog
          key={d.id.toString()}
          open={true}
          onOpenChange={(open) => {
            if (!open) closeDialog(d.id);
          }}
        >
          <DialogContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            className=" bg-background w-[min(92vw,32rem)] overflow-hidden
              rounded-2xl border p-0 shadow-2xl sm:w-[min(90vw,32rem)]"
          >
            {d.content}
          </DialogContent>
        </Dialog>
      ))}
    </Ctx.Provider>
  );
};
