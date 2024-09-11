import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import * as api from '@data/auth/api';
import { LogInRes } from '@data/auth/api';

import { useToast } from '@components/shadcn/use-toast';
import { AuthRole } from '@data/auth/types';
import { Hand } from 'lucide-react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { createErrorToast } from '../root/Portal/toast';
import Message from './Message';
import { Button } from './shadcn/Button';

export interface UseAuthReturn {
  isInitialising: boolean;
  isLoading: boolean;
  logIn: (username: string, password: string) => void;
  logOut: () => void;
  auth: LogInRes | null;
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
  const [state, setState] = useState<null | LogInRes>(null);

  const { toast } = useToast();

  const logIn = (username: string, password: string) => {
    setIsLoading(true);

    api
      .logIn({ username, password })
      .then((res) => setState(res))
      .catch(() =>
        toast(
          createErrorToast({
            verbLabel: 'log in',
            dataLabel: 'user',
          }),
        ),
      )
      .finally(() => setIsLoading(false));
  };

  const logOut = () => {
    if (state) {
      setIsLoading(true);

      api
        .logOut(state.id)
        .then(() => setState(null))
        .catch(() =>
          toast(
            createErrorToast({
              verbLabel: 'log out',
              dataLabel: 'user',
            }),
          ),
        )
        .finally(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    /**
     * This is how we check our authentication cookies' validity, i.e. are we
     * authorized. Since all requests go through the refresh middleware
     * (see [auth/api.ts](../data/auth/api.ts), if the verify request fails with
     * a 401, the middleware will attempt to refresh the session.
     *
     * Therefore, on refresh success, run verify again to retrieve session
     * information*.
     **/

    const verify = () => api.verifyAuth().then((res) => setState(res));

    verify()
      .catch((err) => err.refreshSuccess && verify())
      .finally(() => setIsInitialising(false));
  }, []);

  useEffect(() => {
    /**
     * Any failed fresh request means we are no longer signed in. By setting
     * state to null our UI
     **/

    api.subscribeToRefreshFailed(() => {
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

//

interface ProtectedByRoleProps {
  roles: AuthRole[];
  redirectPath?: string;
  renderLandingPage?: boolean;
  children?: ReactNode;
}

export function ProtectedByRole({
  roles,
  redirectPath,
  renderLandingPage,
  children,
}: ProtectedByRoleProps) {
  const navigate = useNavigate();
  const { auth } = useAuth();

  if (!auth) {
    console.error(
      '<ProtectedByRole /> was rendered when there was not an authenticated user, users should se a sign in page if verification failed....',
    );
    return null;
  }

  if (!roles.every((role) => auth.roles.includes(role))) {
    if (redirectPath) return <Navigate to={redirectPath} replace />;

    if (renderLandingPage) {
      return (
        <Message
          className="h-full"
          icon={Hand}
          message="You do not have permission to view this content"
        >
          <Button onClick={() => navigate(-1)}>Go back</Button>
        </Message>
      );
    }

    return null;
  }

  return children ? children : <Outlet />;
}
