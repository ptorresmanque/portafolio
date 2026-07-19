// Test environment setup.
//
// Three pieces of plumbing are required before the TranslationService tests
// can run against the Angular unit-test infrastructure:
//
// 1. `localStorage` shadowing. Vitest's jsdom environment shadows the global
//    `localStorage` binding with an unusable value in this setup, so code that
//    does `localStorage.getItem(...)` receives `undefined`. Replace it with an
//    in-memory Storage that matches the browser interface used by the service.
//
// 2. `navigator.language` defaults to `en-US` in jsdom, which makes the
//    service's `detectInitialLang()` return `'en'` even when there is no
//    stored preference. The first test (`defaults to "es"`) needs an
//    "ambiguous" locale so the fallback path runs. Set it to `es-ES`.
//
// 3. `fetch` is jsdom's default, which would try to hit the network for
//    `/i18n/{lang}.json`. Stub it with an in-memory map populated from the
//    JSON files on disk so the translation-loading tests can run offline.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

class MemoryStorage implements Storage {
  private readonly store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

const memory = new MemoryStorage();

Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  enumerable: true,
  writable: true,
  value: memory,
});

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: memory,
  });
  Object.defineProperty(window.navigator, 'language', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: 'es-ES',
  });
  Object.defineProperty(window.navigator, 'languages', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: ['es-ES', 'es'],
  });
}

const i18nRoot = join(process.cwd(), 'public', 'i18n');
const i18nCache = new Map<string, string>();
function loadI18n(lang: string): string {
  const cached = i18nCache.get(lang);
  if (cached !== undefined) return cached;
  const content = readFileSync(join(i18nRoot, `${lang}.json`), 'utf-8');
  i18nCache.set(lang, content);
  return content;
}

const realFetch = globalThis.fetch;
globalThis.fetch = (async (input: RequestInfo | URL): Promise<Response> => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const match = /\/i18n\/(es|en)\.json$/.exec(url);
  if (match) {
    const lang = match[1];
    try {
      const body = loadI18n(lang);
      return new Response(body, { status: 200, headers: { 'content-type': 'application/json' } });
    } catch {
      return new Response('not found', { status: 404 });
    }
  }
  return realFetch ? realFetch(input as any) : new Response('not found', { status: 404 });
}) as typeof fetch;
