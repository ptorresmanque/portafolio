#!/usr/bin/env node
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist', 'portafolio', 'browser');
const PORT = Number(process.env.CV_PORT ?? 4321);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

function startStaticServer(rootDir, port) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0]);
        let filePath = path.join(rootDir, urlPath);
        if (!filePath.startsWith(rootDir)) {
          res.writeHead(403);
          res.end('forbidden');
          return;
        }
        if (urlPath.endsWith('/')) filePath = path.join(filePath, 'index.html');
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, 'index.html');
        }
        if (!fs.existsSync(filePath)) {
          // Fallback to index.html for SPA routing
          filePath = path.join(rootDir, 'index.html');
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
      } catch (err) {
        res.writeHead(500);
        res.end(String(err));
      }
    });
    server.on('error', reject);
    server.listen(port, () => resolve(server));
  });
}

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* not ready */
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`Server no respondió en ${timeoutMs}ms: ${url}`);
}

function assertBuildExists() {
  const indexPath = path.join(DIST, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error(
      `\n[generate-cv] No se encontró ${indexPath}.\n` +
        `Ejecuta primero: npm run build\n`,
    );
    process.exit(1);
  }
}

async function generate(lang) {
  const url = `http://127.0.0.1:${PORT}/${lang}/cv`;
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForSelector('app-cv', { timeout: 10000 });
    // Pequeña espera extra para que carguen las fonts
    await new Promise((r) => setTimeout(r, 300));
    const outPath = path.join(DIST, `cv-${lang}.pdf`);
    await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    const stat = fs.statSync(outPath);
    console.log(`[generate-cv] cv-${lang}.pdf escrito: ${(stat.size / 1024).toFixed(1)} KB`);
    if (stat.size < 10 * 1024) {
      console.warn(
        `[generate-cv] ⚠️ cv-${lang}.pdf parece sospechosamente pequeño (${stat.size} bytes)`,
      );
    }
    return outPath;
  } finally {
    await browser.close();
  }
}

async function main() {
  assertBuildExists();
  const server = await startStaticServer(DIST, PORT);
  console.log(`[generate-cv] servidor estático en http://127.0.0.1:${PORT}`);
  try {
    await waitForServer(`http://127.0.0.1:${PORT}/`);
    for (const lang of ['es', 'en']) {
      await generate(lang);
    }
    console.log('[generate-cv] ✅ CVs generados correctamente.');
  } finally {
    server.close();
  }
}

main().catch((err) => {
  console.error('[generate-cv] ❌ Error generando CVs:', err);
  process.exit(2);
});