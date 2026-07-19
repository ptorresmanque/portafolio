import { Injectable, signal, WritableSignal, effect } from '@angular/core';

export type Lang = 'es' | 'en';
export const SUPPORTED_LANGS: readonly Lang[] = ['es', 'en'] as const;
const STORAGE_KEY = 'preferred-lang';
const FALLBACK: Lang = 'es';

function detectInitialLang(): Lang {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'es' || stored === 'en') return stored;
  }
  if (typeof navigator !== 'undefined') {
    const nav = navigator.language?.slice(0, 2).toLowerCase();
    if (nav === 'en') return 'en';
  }
  return FALLBACK;
}

@Injectable({ providedIn: 'root' })
export class TranslationService {
  readonly lang: WritableSignal<Lang> = signal<Lang>(detectInitialLang());
  readonly translations: WritableSignal<Record<string, string>> = signal<Record<string, string>>({});

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
    if (lang === this.lang()) {
      await this.load(lang);
      return;
    }
    this.lang.set(lang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
    }
    await this.load(lang);
  }

  async toggleLang(): Promise<void> {
    await this.setLang(this.lang() === 'es' ? 'en' : 'es');
  }

  private async load(lang: Lang): Promise<void> {
    try {
      const res = await fetch(`/i18n/${lang}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as Record<string, string>;
      this.translations.set(data);
    } catch {
      this.translations.set({});
    }
  }
}
