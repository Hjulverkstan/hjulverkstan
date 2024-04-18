import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import * as api from '@api';

import { useToast } from '@components/ui/use-toast';
import { createErrorToast } from '../root/Portal/toast';

export interface UseAuthReturn {
  isInitialising: boolean;
  isLoading: boolean;
  logIn: (username: string, password: string) => void;
  logOut: () => void;
  auth: api.LogInRes | null;
}

const AuthContext = createContext<undefined | UseAuthReturn>(undefined);

export const useAuth = () => {
  const auth = useContext(AuthContext);

  if (!auth)
    throw Error('useAuth must be invoked in a decendent of <AuthProvider />');

  return auth;
};

//

interface AuthProviderProps {
  children: ReactNode;
}

export const Provider = ({ children }: AuthProviderProps) => {
  const [isInitialising, setIsInitialising] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<null | api.LogInRes>(null);

  const { toast } = useToast();

  const logIn = (username: string, password: string) => {
    setIsLoading(true);
    api
      .logIn({ username, password })
      .then((res) => {
        setIsLoading(false);
        setState(res);
      })
      .catch((err: any) => {
        console.error(err);
        setIsLoading(false);
        toast(
          createErrorToast({
            verbLabel: 'log in',
            dataLabel: 'user',
          }),
        );
      });
  };

  const logOut = () => {
    if (state?.id) {
      setIsLoading(true);
      api
        .logOut(state.id)
        .then(() => {
          setIsLoading(false);
          setState(null);
        })
        .catch((err: any) => {
          console.error(err);
          setIsLoading(false);
          toast(
            createErrorToast({
              verbLabel: 'log out',
              dataLabel: 'user',
            }),
          );
        });
    }
  };

  useEffect(() => {
    api
      .verifyAuth()
      .then((res) => {
        setIsInitialising(false);
        setState(res);
      })
      .catch(() => setIsInitialising(false));
  }, []);

  useEffect(() => {
    api.subscribeToUnsuccessfulTokenRefresh(() => {
      setIsLoading(false);
      setState(null);
    });
  }, []);

  const context: UseAuthReturn = {
    isInitialising,
    isLoading,
    logIn,
    logOut,
    auth: state,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

Provider.displayName = 'AuthProvider';
