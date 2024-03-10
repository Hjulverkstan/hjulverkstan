import { Route, Routes } from 'react-router-dom';
import { TooltipProvider } from '@components/ui/tooltip';

import Home from './home';
import About from './about';
import Admin from './admin';

import '../globals.css';

// To be used by build-script:
export const routes = [
  { path: '/', title: 'Inventory', component: Home },
  { path: '/about', title: 'About', component: About },
  {
    path: '/admin',
    title: 'Admin',
    component: Admin,
    nest: true,
    noSSR: true,
  },
];

export default function Root() {
  return (
    <TooltipProvider delayDuration={0}>
      <Routes>
        {routes.map(({ path, component: Page, nest = '' }) => {
          return (
            <Route key={path} path={path + (nest && '/*')} element={<Page />} />
          );
        })}
      </Routes>
    </TooltipProvider>
  );
}
