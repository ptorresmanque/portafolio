import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { Hero } from './hero';
import { TranslationService } from '../../i18n/translation.service';

const ES = {
  'hero.badge': 'Disponible para nuevos proyectos',
  'hero.title.line1': 'Construyo productos',
  'hero.title.highlight': 'que la gente',
  'hero.title.line2': 'usa todos los días.',
  'hero.subtitle': 'Soy Patricio Manquepillan, desarrollador frontend con foco en Angular y TypeScript.',
  'hero.credentials':
    '+6 años en producción · Angular lead en Banco Santander · WCAG AA en Comunidad de Madrid',
  'hero.cta.projects': 'Ver proyectos',
  'hero.cta.cv': 'Descargar CV',
  'hero.cta.contact': 'Escríbeme',
  'nav.email': 'patriciomanquepillantorres@gmail.com',
};

const EN = {
  'hero.badge': 'Available for new projects',
  'hero.title.line1': 'I build products',
  'hero.title.highlight': 'that people',
  'hero.title.line2': 'use every day.',
  'hero.subtitle': "I'm Patricio Manquepillan, a frontend developer focused on Angular and TypeScript.",
  'hero.credentials':
    '6+ years in production · Angular lead at Banco Santander · WCAG AA at Comunidad de Madrid',
  'hero.cta.projects': 'See projects',
  'hero.cta.cv': 'Download CV',
  'hero.cta.contact': 'Email me',
  'nav.email': 'patriciomanquepillantorres@gmail.com',
};

function setup(translations: Record<string, string>, lang: 'es' | 'en') {
  TestBed.configureTestingModule({
    providers: [
      {
        provide: TranslationService,
        useValue: {
          lang: () => lang,
          t: (key: string) => translations[key] ?? key,
        },
      },
    ],
  });
  const fixture = TestBed.createComponent(Hero);
  fixture.detectChanges();
  return fixture;
}

describe('Hero', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders localized copy in Spanish including the credentials line and CTAs', () => {
    const fixture = setup(ES, 'es');
    const root = fixture.nativeElement as HTMLElement;

    expect(root.textContent).toContain('Disponible para nuevos proyectos');
    expect(root.querySelector('h1')?.textContent).toContain('Construyo productos');
    expect(root.querySelector('h1')?.textContent).toContain('que la gente');
    expect(root.querySelector('h1')?.textContent).toContain('usa todos los días.');
    expect(root.textContent).toContain('Soy Patricio Manquepillan');
    expect(root.textContent).toContain(
      '+6 años en producción · Angular lead en Banco Santander · WCAG AA en Comunidad de Madrid',
    );
  });

  it('renders the primary, secondary, and tertiary CTAs with the right targets', () => {
    const fixture = setup(ES, 'es');
    const root = fixture.nativeElement as HTMLElement;
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('a'));

    const projects = links.find((a) => a.textContent?.includes('Ver proyectos'));
    const cv = links.find((a) => a.textContent?.includes('Descargar CV'));
    const contact = links.find((a) => a.textContent?.includes('Escríbeme'));

    expect(projects?.getAttribute('href')).toBe('#proyectos');
    expect(cv?.getAttribute('href')).toBe('/cv-es.pdf');
    expect(cv?.getAttribute('download')).not.toBeNull();
    expect(contact?.getAttribute('href')).toBe('mailto:patriciomanquepillantorres@gmail.com');
  });

  it('switches copy to English when the active language is en', () => {
    const fixture = setup(EN, 'en');
    const root = fixture.nativeElement as HTMLElement;
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('a'));

    expect(root.textContent).toContain('Available for new projects');
    expect(root.querySelector('h1')?.textContent).toContain('I build products');
    expect(root.textContent).toContain(
      '6+ years in production · Angular lead at Banco Santander · WCAG AA at Comunidad de Madrid',
    );
    expect(links.some((a) => a.textContent?.includes('See projects'))).toBe(true);
    expect(links.some((a) => a.textContent?.includes('Download CV'))).toBe(true);
    expect(links.some((a) => a.textContent?.includes('Email me'))).toBe(true);
  });
});
