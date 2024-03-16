import { Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import ThemeProvider from '@components/ui/ThemeProvider';
import Toaster from '@components/ui/Toaster';
import * as Tooltip from '@components/ui/Tooltip';

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
    nest: true,
    noSSR: true,
  },
];

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: (attemptIndex) => Math.min(1000 * 4 ** attemptIndex, 15000),
      retry: 3,
    },
  },
});

export default function Root() {
  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <Tooltip.Provider delayDuration={500}>
          <Routes>
            {routes.map(({ path, component: Page, nest = '' }) => {
              return (
                <Route
                  key={path}
                  path={path + (nest && '/*')}
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
  );
}
