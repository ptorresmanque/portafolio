#!/usr/bin/env node
/**
 * Genera public/og-default.png (1200x630) para Open Graph / Twitter.
 * Diseño: fondo oscuro con acento azul + nombre + tagline + detalle.
 * Uso: npm run og
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT = resolve(ROOT, 'public/og-default.png');

const W = 1200;
const H = 630;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0A0A0B"/>
      <stop offset="100%" stop-color="#18181B"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.2" r="0.6">
      <stop offset="0%" stop-color="#2563EB" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#2563EB" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <g font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" fill="#FAFAFA">
    <text x="80" y="220" font-size="32" font-weight="500" fill="#71717A" letter-spacing="4">PORTAFOLIO</text>
    <text x="80" y="340" font-size="84" font-weight="700">Patricio Manquepillan</text>
    <text x="80" y="430" font-size="44" font-weight="500" fill="#2563EB">Senior Frontend Developer</text>
    <text x="80" y="520" font-size="28" font-weight="400" fill="#A1A1AA">Angular · TypeScript · WCAG AA · Remote</text>
  </g>

  <g transform="translate(80, 560)">
    <rect width="240" height="6" rx="3" fill="#2563EB"/>
  </g>
</svg>
`;

async function main() {
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toFile(OUT);
  console.log(`Wrote ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
