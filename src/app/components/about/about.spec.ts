import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { About } from './about';
import { TranslationService } from '../../i18n/translation.service';
import { yearsOfExperience } from '../../utils/experience';

const ES = {
  'about.eyebrow': 'Sobre mí',
  'about.title': 'Producto, equipo y código limpio.',
  'about.paragraph1':
    'Llevo {years} años en producción, con cientos de usuarios en los productos donde he trabajado.',
  'about.paragraph2':
    'Tres prioridades guían mi trabajo. Que la interfaz se sienta bien al usarla. Que el código envejezca bien. Y que las decisiones técnicas queden justificadas para el siguiente que las lea.',
  'about.now': 'Ahora liderando frontend en un portal con 2M visitas/mes y WCAG AA estricto.',
  'about.paragraph3':
    'Trabajo como frontend lead en proyectos de Angular. Cuando hace falta, participo en el backend con el mismo nivel de rigor.',
};

const EN = {
  'about.eyebrow': 'About',
  'about.title': 'Product, team, and clean code.',
  'about.paragraph1':
    "I've spent {years} years in production, with hundreds of users in the products I've worked on.",
  'about.paragraph2':
    "Three priorities guide my work. That the interface feels good to use. That the code ages well. And that technical decisions stay justified for whoever reads them next.",
  'about.now': 'Now leading frontend on a portal with 2M visits/month and strict WCAG AA.',
  'about.paragraph3':
    'I work as a frontend lead on Angular projects. When needed, I take part in the backend with the same standard of rigour.',
};

function setup(translations: Record<string, string>, lang: 'es' | 'en') {
  TestBed.configureTestingModule({
    providers: [
      {
        provide: TranslationService,
        useValue: {
          lang: () => lang,
          t: (key: string, params?: Record<string, string | number>) => {
            const raw = translations[key] ?? key;
            if (!params) return raw;
            return raw.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
          },
        },
      },
    ],
  });
  const fixture = TestBed.createComponent(About);
  fixture.detectChanges();
  return fixture;
}

describe('About', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders localized copy in Spanish including the ahora line and substitutes years', () => {
    const fixture = setup(ES, 'es');
    const root = fixture.nativeElement as HTMLElement;

    expect(root.textContent).toContain('Sobre mí');
    expect(root.querySelector('h2')?.textContent).toContain(
      'Producto, equipo y código limpio.',
    );
    expect(root.textContent).toContain(`Llevo ${yearsOfExperience()} años en producción`);
    expect(root.textContent).toContain('Tres prioridades guían mi trabajo.');
    expect(root.textContent).toContain(
      'Ahora liderando frontend en un portal con 2M visitas/mes y WCAG AA estricto.',
    );
    expect(root.textContent).toContain(
      'Trabajo como frontend lead en proyectos de Angular.',
    );
  });

  it('renders the tech stack badges unchanged', () => {
    const fixture = setup(ES, 'es');
    const root = fixture.nativeElement as HTMLElement;
    const badges = Array.from(root.querySelectorAll('span')).map((s) => s.textContent?.trim());

    expect(badges).toEqual(
      expect.arrayContaining([
        'Angular',
        'TypeScript',
        'Spring Boot',
        'Python',
        'Kubernetes',
        'Express',
        'Prisma',
        'MySQL',
        'Postgres',
        'Tailwind',
        'Astro',
      ]),
    );
  });

  it('switches copy to English when the active language is en', () => {
    const fixture = setup(EN, 'en');
    const root = fixture.nativeElement as HTMLElement;

    expect(root.textContent).toContain('About');
    expect(root.querySelector('h2')?.textContent).toContain('Product, team, and clean code.');
    expect(root.textContent).toContain(`I've spent ${yearsOfExperience()} years in production`);
    expect(root.textContent).toContain('Three priorities guide my work.');
    expect(root.textContent).toContain(
      'Now leading frontend on a portal with 2M visits/month and strict WCAG AA.',
    );
    expect(root.textContent).toContain(
      'I work as a frontend lead on Angular projects.',
    );
  });
});
