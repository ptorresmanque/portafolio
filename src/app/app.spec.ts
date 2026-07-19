import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { App } from './app';
import { PROJECTS } from './data/projects';
import { TranslationService } from './i18n/translation.service';

describe('App', () => {
  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('initializes TranslationService when App is created', () => {
    let creations = 0;

    TestBed.configureTestingModule({
      providers: [
        {
          provide: TranslationService,
          useFactory: () => {
            creations += 1;
            return { t: (key: string) => key };
          },
        },
      ],
    });
    TestBed.overrideComponent(App, { set: { template: '' } });

    TestBed.createComponent(App);

    expect(creations).toBe(1);
  });

  it('renders the skip link first with a focusable main target', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TranslationService,
          useValue: {
            t: (key: string) => (key === 'skipLink' ? 'Skip to content' : key),
            lang: () => 'es' as const,
            setLang: async () => {},
          },
        },
      ],
    });
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://images.unsplash.com';
    document.head.append(preconnect);
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const firstFocusable = root.querySelector<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]',
    );
    const main = root.querySelector('main#main');

    expect(firstFocusable?.getAttribute('href')).toBe('#main');
    expect(firstFocusable?.textContent?.trim()).toBe('Skip to content');
    expect(main?.getAttribute('tabindex')).toBe('-1');
    preconnect.remove();
  });

  it('should expose the 4 project placeholders', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance.projects.length).toBe(4);
    expect(fixture.componentInstance.projects.map((p) => p.id)).toEqual([
      'telemetria-2-0',
      'backstops',
      'comunidad-madrid',
      'cualautocompro-cl',
    ]);
  });

  it('classifies projects correctly by kind', () => {
    const workProjects = PROJECTS.filter((p) => p.kind === 'work');
    const personalProjects = PROJECTS.filter((p) => p.kind === 'personal');

    expect(workProjects.map((p) => p.id)).toEqual([
      'telemetria-2-0',
      'backstops',
      'comunidad-madrid',
    ]);
    expect(personalProjects.map((p) => p.id)).toEqual(['cualautocompro-cl']);

    const cualauto = personalProjects[0];
    if (cualauto.kind === 'personal') {
      expect(cualauto.githubUrl).toBe('https://github.com/ptorresmanque/CualAutoCompro');
      expect(cualauto.siteUrl).toBe('https://cualautocompro.cl');
    }
  });

  it('starts with no dialog project and toggles on openDialog/closeDialog', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    expect(app.dialogProject()).toBeNull();

    const target = PROJECTS[0];
    app.openDialog(target);
    expect(app.dialogProject()).toBe(target);

    app.closeDialog();
    expect(app.dialogProject()).toBeNull();
  });
});
