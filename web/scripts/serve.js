import { createProxyMiddleware } from 'http-proxy-middleware';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const rootPath = path.resolve(fileURLToPath(import.meta.url) + '../../..');
config({ path: path.resolve(rootPath, '../.env') });

const proxy = process.env.VITE_BACKEND_PROXY_SLUG;
const api = process.env.VITE_BACKEND_URL;

const app = express();

const staticDir = `${rootPath}/dist/static`;

if (!fs.existsSync(staticDir)) {
  throw new Error('No dist/static folder found! Build the application first!');
}
console.log(`[INFO] Serving static files from: ${staticDir}`);

app.use(
  proxy,
  createProxyMiddleware({
    target: api,
    changeOrigin: true,
    pathRewrite: (path) => path.replace(/^\/api/, ''),
  }),
);

app.use(express.static(staticDir));

app.use((req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(8000, () => {
  console.log(`[INFO] Server running on http://localhost:8000`);
  console.log(`[INFO] Proxying "${proxy}" -> "${api}"`);
});
