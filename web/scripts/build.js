/**
 *
 * Script to build static assets of the app for releasing to environment or to
 * test the build locally.
 *
 * It statically generates HTML pages for both CSR and SSR routes. SSR pages are generated
 * with localized content and embedded into HTML templates.
 *
 * For more information see our [Static Site Generation Strategy](link)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// Setup
const rootPath = path.resolve(fileURLToPath(import.meta.url) + '../../..');
const toImportUrl = (url) => new URL('file://' + path.resolve(rootPath, url));

config({ path: path.resolve(rootPath, '../.env') }); // Load env vars from .env file

console.log(
  'Loaded the following env vars:',
  Object.entries(process.env).filter(([k]) => k.startsWith('VITE')),
);

// Build

// Each built route is added to routeManifest and is exported to a json for the
// cloudfront lamdba function to be able to respond with the correct index.html
// file intelligently if a routes does not match an index.html.

const routeManifest = [];

const htmlTemplate = fs.readFileSync(
  path.resolve(rootPath, 'dist/static/index.html'),
  'utf-8',
);

const { renderSSR, getDataForPreloadingServerSide, createRoutes } =
  await import(toImportUrl('dist/ssr/server.js'));

/**
 * Renders a route into a complete HTML file using SSR if enabled.
 */

const buildRoute = ({ path, title, isSSR, data }) => {
  const actualPath = path.replace('/*', '');

  routeManifest.push((actualPath + '/').replace('//', '/'));

  const helmetContext = {};

  const appHtml = renderSSR({
    path: actualPath,
    data: isSSR ? data : undefined,
    helmetContext,
  });

  const { helmet } = helmetContext;

  const html = htmlTemplate
    .replace(`<!--title-->`, title)
    .replace(`<!--app-html-->`, isSSR ? appHtml : '')
    .replace(
      '__jsonFromBuildScript__',
      JSON.stringify(data)?.replaceAll("'", "\\'"),
    )
    .replace(
      `<!--helmet-->`,
      `
      ${helmet.title.toString()}
      ${helmet.priority.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      ${helmet.script.toString()}
    `,
    );

  const outputDir = `${rootPath}/dist/static${actualPath}`;
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputDir + '/index.html', html);

  console.log(`[INFO]: * Rendered [${path}] (${appHtml.length} chars)`);
};

// Expand dynamic segments in route definitions into concrete paths
const expandRoute = (route) =>
  route.dynamicSegments?.length
    ? route.dynamicSegments.map((params) => {
        const actualPath = Object.entries(params).reduce(
          (path, [key, value]) => path.replace(`:${key}`, value),
          route.path,
        );
        return { ...route, path: actualPath };
      })
    : [route];

// Start rendering process
const startTime = Date.now();
console.log('[INFO]: Rendering CSR routes');

/**
 * Build SSR routes in each locale and build at the root with default locale.
 * For more info see [Static Site Generation Strategy](link).
 */

try {
  const data = await getDataForPreloadingServerSide(process.env);
  const { ssr: routesSSR, csr: routesCSR } = createRoutes(data);

  // Render CSR routes (e.g. Portal)
  console.log('[INFO]: Rendering CSR routes');
  routesCSR.forEach(buildRoute);

  // Render SSR routes per locale
  Object.keys(data).forEach((locale) => {
    console.log(`[INFO]: Rendering routes for locale ${locale}`);
    routesSSR.flatMap(expandRoute).forEach((route) => {
      buildRoute({
        path: `/${locale}${route.path}`,
        title: route.title,
        isSSR: true,
        data,
      });
    });
  });

  // Render default fallback (e.g. /sv/...)
  console.log('[INFO]: Rendering routes for root');
  routesSSR.flatMap(expandRoute).forEach((route) => {
    buildRoute({
      path: route.path,
      title: route.title,
      isSSR: true,
      data,
    });
  });
} catch (err) {
  console.error(
    '[ERROR]: There was an error in getDataForPreloadingServerSide()',
    err,
  );
  process.exit(1);
}

console.log(
  'Writing route-manifest.json with the following content:',
  routeManifest,
);

const manifestPath = path.resolve(rootPath, 'dist/static/route-manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(routeManifest, null, 2));

console.log(
  '[INFO]: Built all routes in',
  (Date.now() - startTime) / 1000 + 's.',
);
