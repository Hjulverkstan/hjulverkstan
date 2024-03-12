import { Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { TooltipProvider } from '@components/ui/Tooltip';

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

export const queryClient = new QueryClient();

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={0}>
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
      </TooltipProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
