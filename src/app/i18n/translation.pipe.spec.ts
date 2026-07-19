import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { TranslationPipe } from './translation.pipe';
import { TranslationService } from './translation.service';

describe('TranslationPipe', () => {
  let pipe: TranslationPipe;
  let service: TranslationService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationService);
    pipe = new TranslationPipe(service);
  });

  it('returns translated value for a known key', async () => {
    await service.setLang('es');
    expect(pipe.transform('hero.cta.projects')).toBe('Ver proyectos');
  });

  it('returns English when lang is en', async () => {
    await service.setLang('en');
    expect(pipe.transform('hero.cta.projects')).toBe('See projects');
  });

  it('substitutes params when provided', async () => {
    await service.setLang('es');
    expect(pipe.transform('about.paragraph1', { years: 7 })).toContain('7 años');
  });

  it('returns the key when missing', () => {
    expect(pipe.transform('does.not.exist')).toBe('does.not.exist');
  });
});
