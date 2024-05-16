import { Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import ThemeProvider from '@components/shadcn/ThemeProvider';
import Toaster from '@components/shadcn/Toaster';
import * as Tooltip from '@components/shadcn/Tooltip';
import * as Auth from '@components/Auth';

import Home from './Home';
import About from './About';
import Portal from './Portal';

import '../globals.css';

// To be used by build-script:
export const routes = [
  { path: '/', title: 'ShopInventoryTable', component: Home },
  { path: '/about', title: 'About', component: About },
  {
    path: '/portal',
    title: 'Portal',
    component: Portal,
    hasNestedRoutes: true,
    disableSSR: true,
  },
];

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retryDelay: (attemptIndex) => Math.min(1000 * 4 ** attemptIndex, 15000),
      retry: (retryCount, error: any) => error.status !== 404 || retryCount > 2,
    },
    queries: {
      retryDelay: (attemptIndex) => Math.min(1000 * 4 ** attemptIndex, 15000),
      retry: (retryCount, error: any) => error.status !== 404 || retryCount > 2,
      refetchIntervalInBackground: true,
    },
  },
});

export default function Root() {
  return (
    <Auth.Provider>
      <ThemeProvider storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <Tooltip.Provider delayDuration={500}>
            <Routes>
              {routes.map(({ path, component: Page, hasNestedRoutes = '' }) => {
                return (
                  <Route
                    key={path}
                    path={path + (hasNestedRoutes && '/*')}
                    element={<Page />}
                  />
                );
              })}
            </Routes>
            <Toaster />
          </Tooltip.Provider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </Auth.Provider>
  );
}
