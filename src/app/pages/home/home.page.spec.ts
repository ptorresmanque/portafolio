import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { PROJECTS } from '../../data/projects';
import { TranslationService } from '../../i18n/translation.service';
import { HomePage } from './home.page';

describe('HomePage', () => {
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
    const fixture = TestBed.createComponent(HomePage);
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

  it('exposes the four portfolio projects', () => {
    const fixture = TestBed.createComponent(HomePage);

    expect(fixture.componentInstance.projects.map((project) => project.id)).toEqual([
      'telemetria-2-0',
      'backstops',
      'comunidad-madrid',
      'cualautocompro-cl',
    ]);
  });

  it('starts without a selected project and toggles the dialog state', () => {
    const fixture = TestBed.createComponent(HomePage);
    const home = fixture.componentInstance;
    const target = PROJECTS[0];

    expect(home.dialogProject()).toBeNull();
    home.openDialog(target);
    expect(home.dialogProject()).toBe(target);
    home.closeDialog();
    expect(home.dialogProject()).toBeNull();
  });
});
