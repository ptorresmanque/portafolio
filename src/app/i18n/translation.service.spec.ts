import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationService);
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
    localStorage.setItem('preferred-lang', 'en');
    const fresh = TestBed.inject(TranslationService);
    expect(fresh.lang()).toBe('en');
  });
});