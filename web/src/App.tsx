import { Route, Routes } from 'react-router-dom';

import pages from './pages';

export default function App() {
  return (
    <>
      <ul>
        {pages.map(({ path, name }) => (
          <li>
            <a href={path}>{name}</a>
          </li>
        ))}
      </ul>
      <Routes>
        {pages.map(({ path, component: Page }) => {
          return <Route key={path} path={path} element={<Page />} />;
        })}
      </Routes>
    </>
  );
}
