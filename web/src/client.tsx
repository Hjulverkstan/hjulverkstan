import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { PreloadedDataProvider } from '@hooks/usePreloadedData';

import Root from './root';

/**
 * When mounting and rendering the app client side, get the data created by
 * [getDataForPreloadingServerSide](./server.ts#getDataForPreloadingServerSide)
 * and added to the window object during the build process and pass it to
 * PreloadedDataProvider. See [Static Site Generation Strategy](link) fore more
 * info.
 */

const getPreloadedDataClientSide = () => {
  // Perhaps not necessary but prevent excecutable content:
  const unsafeRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  const safeParseJson = (json: string) =>
    JSON.parse(json.replace(unsafeRegex, ''));

  if (!window) throw new Error('getPreloadedDataClientSide invoked serverside');
  else if (window.__PRELOADED_DATA__ === 'undefined') return undefined;
  else return safeParseJson(window.__PRELOADED_DATA__);
};

declare global {
  interface Window {
    __PRELOADED_DATA__: string;
  }
}

/**
 * Render using hydrate api if there are DOM-nodes present in #app otherwise
 * proceed with standrard client side rendered approach. See [link](link) if
 * unsure why.
 */

const mountEl = document.getElementById('app')!;

const node = (
  <PreloadedDataProvider value={getPreloadedDataClientSide()}>
    <BrowserRouter>
      <HelmetProvider>
        <Root />
      </HelmetProvider>
    </BrowserRouter>
  </PreloadedDataProvider>
);

if (mountEl.childNodes.length) ReactDOM.hydrateRoot(mountEl, node);
else ReactDOM.createRoot(mountEl).render(node);
