import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;
  let originalFetch: typeof fetch;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationService);
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('defaults to "es"', () => {
    expect(service.lang()).toBe('es');
  });

  it('t() returns the value for a known key', async () => {
    await service.setLang('es');
    expect(service.t('hero.cta.projects')).toBe('Ver proyectos');
  });

  it('t() returns the key when missing', () => {
    expect(service.t('missing.key')).toBe('missing.key');
  });

  it('t() substitutes {placeholder} tokens', async () => {
    await service.setLang('es');
    expect(service.t('about.paragraph1', { years: '7' })).toContain('7');
  });

  it('setLang("en") loads English and updates the signal', async () => {
    await service.setLang('en');
    expect(service.lang()).toBe('en');
    expect(service.t('hero.cta.projects')).toBe('See projects');
  });

  it('persists choice in localStorage', async () => {
    await service.setLang('en');
    expect(localStorage.getItem('preferred-lang')).toBe('en');
  });

  it('toggleLang() switches es <-> en', async () => {
    expect(service.lang()).toBe('es');
    await service.toggleLang();
    expect(service.lang()).toBe('en');
    await service.toggleLang();
    expect(service.lang()).toBe('es');
  });

  it('reads preferred-lang from localStorage on construction', () => {
    TestBed.resetTestingModule();
    localStorage.setItem('preferred-lang', 'en');
    TestBed.configureTestingModule({});
    const fresh = TestBed.inject(TranslationService);
    expect(fresh.lang()).toBe('en');
  });

  it('setLang() to the same lang does not re-fetch (cache hit)', async () => {
    await service.setLang('es');
    const spy = vi.spyOn(globalThis, 'fetch');
    await service.setLang('es');
    expect(spy).not.toHaveBeenCalled();
  });

  it('concurrent setLang calls for the same lang share a single fetch', async () => {
    TestBed.resetTestingModule();
    let resolveEnFetch: (v: Response) => void = () => {};
    const pendingEn = new Promise<Response>((r) => (resolveEnFetch = r));
    const pendingOther = new Promise<Response>(() => {});
    const spy = vi.spyOn(globalThis, 'fetch').mockImplementation((input) => {
      const url = typeof input === 'string' ? input : (input as URL).href;
      return /\/i18n\/en/.test(url) ? pendingEn : pendingOther;
    });
    TestBed.configureTestingModule({});
    const fresh = TestBed.inject(TranslationService);

    const p1 = fresh.setLang('en');
    const p2 = fresh.setLang('en');
    resolveEnFetch(new Response('{"x":"y"}', { status: 200, headers: { 'content-type': 'application/json' } }));
    await Promise.all([p1, p2]);

    const enCalls = spy.mock.calls.filter(([input]) => {
      const url = typeof input === 'string' ? input : (input as URL).href;
      return /\/i18n\/en/.test(url);
    });
    expect(enCalls).toHaveLength(1);
    expect(fresh.lang()).toBe('en');
  });

  it('drops an out-of-order response when the lang has moved on', async () => {
    // Queue: en resolves slowly, es resolves fast. setLang('en') then
    // setLang('es') should leave translations on Spanish — even if the
    // English fetch resolves after the Spanish one.
    TestBed.resetTestingModule();
    const responses = new Map<string, { resolve: (v: Response) => void }>();
    const makeResponse = (lang: string): Promise<Response> =>
      new Promise<Response>((r) => (responses.set(lang, { resolve: r })));

    const en = makeResponse('en');
    const es = makeResponse('es');
    const spy = vi.spyOn(globalThis, 'fetch').mockImplementation((input) => {
      const url = typeof input === 'string' ? input : (input as URL).href;
      return /\/i18n\/en/.test(url) ? en : es;
    });
    TestBed.configureTestingModule({});
    const fresh = TestBed.inject(TranslationService);

    const p1 = fresh.setLang('en');
    const p2 = fresh.setLang('es');
    responses.get('es')!.resolve(
      new Response('{"hero.cta.projects":"ES-PROJECTS"}', { status: 200 }),
    );
    await p2;
    responses.get('en')!.resolve(
      new Response('{"hero.cta.projects":"EN-PROJECTS"}', { status: 200 }),
    );
    await p1;

    expect(fresh.lang()).toBe('es');
    expect(fresh.t('hero.cta.projects')).toBe('ES-PROJECTS');
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('survives a SecurityError on localStorage.setItem', async () => {
    const original = localStorage.setItem;
    localStorage.setItem = vi.fn(() => {
      throw new Error('SecurityError');
    });
    try {
      await expect(service.setLang('en')).resolves.toBeUndefined();
      expect(service.lang()).toBe('en');
    } finally {
      localStorage.setItem = original;
    }
  });
});
