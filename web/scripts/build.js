/**
 * The content of the build script is based on our Static Site Generation
 * strategy. For more information read [link](link)
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

const htmlTemplate = fs.readFileSync(
  path.resolve(rootPath, 'dist/static/index.html'),
  'utf-8',
);

const { renderSSR, getDataForPreloadingServerSide, routesSSR, routesCSR } =
  await import(toImportUrl('dist/ssr/server.js'));

/**
 * The guts of building a route. Note that we call renderSSR (from server.ts) on
 * Client Side Rendered routes as well. We have to do this to retrieve the tags
 * from react-helmet-async.
 */

const buildRoute = ({ path, title, isSSR, data }) => {
  const actualPath = path.replace('/*', '');

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
    .replace('__jsonFromBuildScript__', JSON.stringify(data))
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

// Generate files

const startTime = Date.now();
console.log('[INFO]: Rendering CSR routes');

routesCSR.forEach(buildRoute);

/**
 * Build SSR routes in each locale and build at the root with default locale.
 * For more info see [Static Site Generation Strategy](link).
 */

try {
  const data = await getDataForPreloadingServerSide(process.env);

  Object.keys(data).forEach((locale) => {
    console.log(`[INFO]: Rendering routes for locale ${locale}`);
    routesSSR.forEach((route) =>
      buildRoute({
        path: `/${locale + route.path}`,
        title: route.title,
        isSSR: true,
        data,
      }),
    );
  });

  console.log('[INFO]: Rendering routes for root');

  routesSSR.forEach((route) =>
    buildRoute({
      path: route.path,
      title: route.title,
      isSSR: true,
      data,
    }),
  );
} catch (err) {
  console.error(
    '[ERROR]: There was an error in getDataForPreloadingServerSide()',
    err,
  );
  process.exit(1);
}

console.log(
  '[INFO]: Built all routes in',
  (Date.now() - startTime) / 1000 + 's.',
);
