/**
 * The developement server. Comes with Hot Module Reloading,
 * because of this we dont reuse the build script logic as we only want to
 * build for the current url. A different set of legic is therefore designed to
 * match the url with the right route and render it properly.
 *
 * For more information see our [Static Site Generation Strategy](link)
 */

import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

//

const rootPath = path.resolve(fileURLToPath(import.meta.url) + '../../..');

const vite = await createViteServer({
  root: rootPath,
  logLevel: 'info',
  server: {
    middlewareMode: true,
  },
  appType: 'custom',
});

//

const app = express();

app.use(vite.middlewares);
app.use(express.static(path.join(rootPath, 'public')));

const findRoute = (routes, matchUrl) =>
  routes.find(({ path }) =>
    path === '/' ? matchUrl === '/' : matchUrl.startsWith(path),
  );

app.use('*', async ({ originalUrl: url }, res) => {
  const { routesSSR, routesCSR, renderSSR, getDataForPreloadingServerSide } =
    await vite.ssrLoadModule('/src/server.tsx');

  // Inserting react-refresh for HMR

  const template = await vite.transformIndexHtml(
    url,
    fs.readFileSync(path.resolve(rootPath, 'index.html'), 'utf-8'),
  );

  // Render CSR html if route found

  const routeMatchCSR = findRoute(routesCSR, url);

  if (routeMatchCSR) {
    const html = template
      .replace(`<!--title-->`, routeMatchCSR.title)
      .replace(`<!--app-html-->`, '')
      .replace('__jsonFromBuildScript__', 'undefined');

    console.log(
      `[INFO]: Rendered CSR html for url "${url}" (${routeMatchCSR.path})`,
    );

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    return;
  }

  // Render SSR html if route found

  // Get the localized data to pass to the ssr render function and to
  // recognise localized urls.

  let data;
  try {
    data = await getDataForPreloadingServerSide(process.env);
  } catch (err) {
    console.error(
      '[ERROR]: Failed to getDataForPreloadingServerSide(), error:',
      err,
    );
    res
      .status(500)
      .send('There was an error. Please check the console for details.');
    return;
  }

  const isLocalizedUrl = Object.keys(data).some((locale) =>
    url.startsWith(`/${locale}`),
  );

  const nonLocalizedUrl = isLocalizedUrl ? url.slice(3) || '/' : url;

  const routeMatchSSR = findRoute(routesSSR, nonLocalizedUrl);

  // Fall back route if no route found. In production cloudfront should
  // fallback to the root index.html
  let fallBackRoute;
  if (!routeMatchSSR) {
    fallBackRoute = findRoute(routesSSR, '/');
    console.log(
      `[INFO]: Url "${url}" does not exist in SSR routes. Proceeding with fallback`,
    );
  }

  const html = template
    .replace(`<!--title-->`, routeMatchSSR?.title ?? fallBackRoute.title)
    .replace('__jsonFromBuildScript__', JSON.stringify(data))
    .replace(
      `<!--app-html-->`,
      renderSSR({ path: routeMatchSSR ? url : '/', data }),
    );

  console.log(
    `[INFO]: Rendered SSR html for url "${url}" (${routeMatchSSR?.path ?? fallBackRoute.path})`,
  );

  res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
});

app.listen(5173, () => {
  console.log('[INFO]: Listening on http://localhost:5173');
});
