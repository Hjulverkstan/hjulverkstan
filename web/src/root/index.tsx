import { Route, Routes } from 'react-router-dom';

import Home from './Home';
import About from './About';

export const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
];

export default function Root() {
  return (
    <>
      <ul>
        {routes.map(({ path, name }) => (
          <li key={path}>
            <a href={path}>{name}</a>
          </li>
        ))}
      </ul>
      <Routes>
        {routes.map(({ path, component: Page }) => {
          return <Route key={path} path={path} element={<Page />} />;
        })}
      </Routes>
    </>
  );
}
