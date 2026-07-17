#!/usr/bin/env node
/**
 * Genera el bundle completo de favicon a partir de los SVGs fuente en
 * assets/favicon-source/ y los escribe en public/.
 *
 * Salidas:
 *   favicon.svg            — light/dark con prefers-color-scheme
 *   favicon.ico            — 16, 32, 48 (ICO multi-tamaño)
 *   favicon-96x96.png      — favicon PNG estándar
 *   apple-touch-icon.png   — 180×180 (iOS)
 *   web-app-manifest-192.png, web-app-manifest-512.png (Android/PWA)
 *   site.webmanifest       — PWA manifest
 *   _favicon-markup.html   — referencia con los <link> listos para pegar
 *
 * Uso: npm run favicon
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SOURCE_DIR = resolve(ROOT, 'assets/favicon-source');
const OUTPUT_DIR = resolve(ROOT, 'public');

const THEME_COLOR = '#2563EB';
const BG_COLOR = '#FAFAFA';

async function readSvg(name) {
  return readFile(resolve(SOURCE_DIR, name), 'utf8');
}

function combineSvg(lightSvg, darkSvg) {
  const lightInner = lightSvg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  const darkInner = darkSvg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<style>
  #light { display: inline; }
  #dark { display: none; }
  @media (prefers-color-scheme: dark) {
    #light { display: none; }
    #dark { display: inline; }
  }
</style>
<g id="light">${lightInner}</g>
<g id="dark">${darkInner}</g>
</svg>`;
}

function makeIco(pngBuffers) {
  const sizes = pngBuffers.map(({ size }) => size);
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);

  const dirEntries = [];
  const dataChunks = [];
  let offset = 6 + 16 * sizes.length;

  for (const { size, buffer } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0);
    entry.writeUInt8(size === 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(0, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += buffer.length;
    dirEntries.push(entry);
    dataChunks.push(buffer);
  }

  return Buffer.concat([header, ...dirEntries, ...dataChunks]);
}

async function renderSvgPng(svgString, size) {
  return sharp(Buffer.from(svgString)).resize(size, size).png().toBuffer();
}

async function main() {
  console.log('→ Generando favicons con sharp…');

  const lightSvg = await readSvg('light.svg');
  const darkSvg = await readSvg('dark.svg');
  console.log('  ✓ SVGs fuente leídos');

  const combinedSvg = combineSvg(lightSvg, darkSvg);
  const baseSvg = lightSvg;
  await writeFile(resolve(OUTPUT_DIR, 'favicon.svg'), combinedSvg);
  console.log('  ✓ favicon.svg (light/dark con prefers-color-scheme)');

  const sizes = [
    { name: 'favicon-96x96.png', size: 96 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'web-app-manifest-192x192.png', size: 192 },
    { name: 'web-app-manifest-512x512.png', size: 512 },
  ];
  for (const { name, size } of sizes) {
    const buf = await renderSvgPng(baseSvg, size);
    await writeFile(resolve(OUTPUT_DIR, name), buf);
  }
  console.log(`  ✓ ${sizes.length} PNGs generados`);

  const icoSizes = [16, 32, 48];
  const icoPngs = await Promise.all(
    icoSizes.map(async (size) => ({ size, buffer: await renderSvgPng(baseSvg, size) })),
  );
  await writeFile(resolve(OUTPUT_DIR, 'favicon.ico'), makeIco(icoPngs));
  console.log(`  ✓ favicon.ico (${icoSizes.join(', ')})`);

  const manifest = {
    name: 'Patricio Manquepillán',
    short_name: 'PM',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    theme_color: THEME_COLOR,
    background_color: BG_COLOR,
    display: 'standalone',
  };
  await writeFile(resolve(OUTPUT_DIR, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
  console.log('  ✓ site.webmanifest');

  const markup = [
    '<link rel="icon" href="/favicon.ico" sizes="any">',
    '<link rel="icon" type="image/svg+xml" href="/favicon.svg">',
    '<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">',
    '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">',
    '<link rel="manifest" href="/site.webmanifest">',
    '<meta name="theme-color" content="' + THEME_COLOR + '">',
  ].join('\n');
  await writeFile(resolve(OUTPUT_DIR, '_favicon-markup.html'), markup);
  console.log('  ✓ public/_favicon-markup.html (markup listo para copiar)');

  console.log('\nListo. Pega el contenido de public/_favicon-markup.html en src/index.html.');
}

main().catch((err) => {
  console.error('× Error generando favicons:', err);
  process.exit(1);
});