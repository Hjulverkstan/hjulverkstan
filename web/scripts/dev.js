/**
 * The development server. Comes with Hot Module Reloading.
 * Because of this we don't reuse the build script logic, we only want to
 * render for the current URL during development.
 *
 * Instead, we load and evaluate the current URL dynamically using Express,
 * Vite middleware, and SSR rendering logic. The routes are generated based
 * on WebEdit content data fetched at runtime.
 *
 * For more information see our [Static Site Generation Strategy](link)
 */

import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Setup

const rootPath = path.resolve(fileURLToPath(import.meta.url) + '../../..');

const vite = await createViteServer({
  root: rootPath,
  logLevel: 'info',
  server: {
    middlewareMode: true,
  },
  appType: 'custom',
});

const app = express();

const proxy = process.env.VITE_BACKEND_PROXY_SLUG;
const api = process.env.VITE_BACKEND_URL;

app.use(
  proxy,
  createProxyMiddleware({
    target: api,
    changeOrigin: true,
    pathRewrite: (path) => path.replace(/^\/api/, ''),
  }),
);

app.use(vite.middlewares);
app.use(express.static(path.join(rootPath, 'public')));

const findRoute = (routes, matchUrl) =>
  routes.find(({ path }) => {
    const actualPath = path.replace('/*', '');
    return actualPath === '/'
      ? matchUrl === '/'
      : matchUrl.startsWith(actualPath);
  });

// Expand dynamic segments into concrete routes (e.g. /shops/:slug => /shops/backa)

const expandRoute = (route) =>
  route.dynamicSegments?.length
    ? route.dynamicSegments.map((params) => {
        const path = Object.entries(params).reduce(
          (acc, [key, value]) => acc.replace(`:${key}`, value),
          route.path,
        );
        return { ...route, path };
      })
    : [route];

app.use('*', async ({ originalUrl: url }, res) => {
  const { createRoutes, renderSSR, getDataForPreloadingServerSide } =
    await vite.ssrLoadModule('/src/server.tsx');

  // Inserting react-refresh for HMR

  const template = await vite.transformIndexHtml(
    url,
    fs.readFileSync(path.resolve(rootPath, 'index.html'), 'utf-8'),
  );

  // Get the localized data to pass to the ssr render function and to
  // recognize localized urls.

  let data;
  try {
    data = await getDataForPreloadingServerSide(process.env);
  } catch (err) {
    console.error('[ERROR]: Failed to getDataForPreloadingServerSide()', err);
    res
      .status(500)
      .send('There was an error. Please check the console for details.');
    return;
  }

  // Generate routes dynamically based on the data

  const { ssr: routesSSR, csr: routesCSR } = createRoutes(data);

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

  const isLocalizedUrl = Object.keys(data).some((locale) =>
    url.startsWith(`/${locale}`),
  );

  const expandedRoutesSSR = routesSSR.flatMap(expandRoute);
  const nonLocalizedUrl = isLocalizedUrl ? url.slice(3) || '/' : url;
  const routeMatchSSR = findRoute(expandedRoutesSSR, nonLocalizedUrl);

  // Fall back route if no route found. In production cloudfront should
  // fall back to the root index.html

  let fallBackRoute;
  if (!routeMatchSSR) {
    fallBackRoute = findRoute(expandedRoutesSSR, '/');
    console.log(
      `[INFO]: Url "${url}" does not exist in SSR routes. Proceeding with fallback`,
    );
  }

  const html = template
    .replace(`<!--title-->`, routeMatchSSR?.title ?? fallBackRoute.title)
    .replace(
      '__jsonFromBuildScript__',
      JSON.stringify(data)?.replaceAll("'", "\\'"),
    )
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
