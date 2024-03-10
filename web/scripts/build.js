import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const rootPath = path.resolve(fileURLToPath(import.meta.url) + '../../..');

const htmlTemplate = fs.readFileSync(
  path.resolve(rootPath, 'dist/static/index.html'),
  'utf-8',
);

const { renderSSR, routes } = await import(
  path.resolve(rootPath, 'dist/ssr/server.js')
);

routes.forEach(({ path, useSSR = true }) => {
  const appHtml = useSSR ? renderSSR(path) : '';
  const html = htmlTemplate.replace(`<!--app-html-->`, appHtml);

  const outputPath = `/dist/static${path === '/' ? '/index' : path}.html`;
  fs.writeFileSync(rootPath + outputPath, html);

  console.log(
    `Rendered [${path}] (lines of html: ${appHtml.split('\n').length}`,
  );
});
