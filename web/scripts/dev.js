import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const rootPath = path.resolve(fileURLToPath(import.meta.url) + '../../..');

async function createServer() {
  const vite = await createViteServer({
    root: rootPath,
    logLevel: 'info',
    server: {
      middlewareMode: true,
    },
    appType: 'custom',
  });

  const app = express();

  app.use(vite.middlewares);

  app.use('*', async ({ originalUrl: url }, res) => {
    const htmlTemplateRaw = fs.readFileSync(
      path.resolve(rootPath, 'index.html'),
      'utf-8',
    );

    // Inserting react-refresh for local development
    const htmlTemplate = await vite.transformIndexHtml(url, htmlTemplateRaw);

    const { renderSSR, routes } = await vite.ssrLoadModule('/src/server.tsx');

    const { noSSR } =
      routes.find(({ path }) =>
        path === '/' ? url === '/' : url.startsWith(path),
      ) || {};

    const appHtml = noSSR ? '' : renderSSR(url);
    const html = htmlTemplate.replace(`<!--app-html-->`, appHtml);

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html); //Outputing final html
  });

  app.listen(5173, () => {
    console.log('http://localhost:5173');
  });
}

createServer();
