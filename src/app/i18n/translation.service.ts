import { Injectable, signal, WritableSignal, effect } from '@angular/core';

export type Lang = 'es' | 'en';
export const SUPPORTED_LANGS: readonly Lang[] = ['es', 'en'] as const;
const STORAGE_KEY = 'preferred-lang';
const FALLBACK: Lang = 'es';

function detectInitialLang(): Lang {
  if (typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'es' || stored === 'en') return stored;
    } catch {
      // localStorage can throw SecurityError in privacy modes / sandboxed
      // iframes. Fall through to navigator detection.
    }
  }
  if (typeof navigator !== 'undefined') {
    const nav = navigator.language?.slice(0, 2).toLowerCase();
    if (nav === 'en') return 'en';
  }
  return FALLBACK;
}

function safeSetItem(key: string, value: string): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // SecurityError / QuotaExceededError — preference won't persist across
    // reloads, but the in-memory signal still works for the current session.
  }
}

@Injectable({ providedIn: 'root' })
export class TranslationService {
  readonly lang: WritableSignal<Lang> = signal<Lang>(detectInitialLang());
  readonly translations: WritableSignal<Record<string, string>> = signal<Record<string, string>>({});

  private readonly cache = new Map<Lang, Record<string, string>>();
  private readonly inFlight = new Map<Lang, Promise<void>>();

  constructor() {
    effect(() => {
      const l = this.lang();
      if (typeof document !== 'undefined') {
        document.documentElement.lang = l;
      }
    });
    void this.load(this.lang());
  }

  t(key: string, params?: Record<string, string | number>): string {
    const raw = this.translations()[key] ?? key;
    if (!params) return raw;
    return raw.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
  }

  async setLang(lang: Lang): Promise<void> {
    if (lang !== this.lang()) {
      this.lang.set(lang);
      safeSetItem(STORAGE_KEY, lang);
    }
    await this.load(lang);
  }

  async toggleLang(): Promise<void> {
    await this.setLang(this.lang() === 'es' ? 'en' : 'es');
  }

  private async load(lang: Lang): Promise<void> {
    const cached = this.cache.get(lang);
    if (cached) {
      this.translations.set(cached);
      return;
    }

    const pending = this.inFlight.get(lang);
    if (pending) return pending;

    const controller = new AbortController();
    const promise = (async () => {
      try {
        const res = await fetch(`/i18n/${lang}.json`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Record<string, string>;
        this.cache.set(lang, data);
        // Only commit to the public signal if the lang is still current.
        // Out-of-order responses that would clobber a newer lang are
        // dropped at the source.
        if (this.lang() === lang) {
          this.translations.set(data);
        }
      } catch (err) {
        if ((err as { name?: string }).name === 'AbortError') return;
        this.cache.delete(lang);
        if (this.lang() === lang) {
          this.translations.set({});
        }
      } finally {
        this.inFlight.delete(lang);
      }
    })();
    this.inFlight.set(lang, promise);
    return promise;
  }
}