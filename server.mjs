import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createApp } from './server/app.mjs';
import { loadEnvFile } from './server/env.mjs';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

await loadEnvFile(rootDir);

const app = createApp({ rootDir });
const url = await app.start();

console.log(`[server] listening on ${url}`);
console.log('[server] static game: /');
console.log('[server] admin panel: /admin.html');
