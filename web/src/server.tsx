import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

import Root from './root';

export { routes } from './root';

export function renderSSR(path: string | Partial<Location>) {
  return ReactDOMServer.renderToString(
    <StaticRouter location={path}>
      <Root />
    </StaticRouter>,
  );
}
