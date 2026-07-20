import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { ProjectCard } from './project-card';
import { PROJECTS } from '../../data/projects';
import { TranslationService } from '../../i18n/translation.service';

const ES = { 'projects.kind.work': 'Trabajo', 'projects.kind.personal': 'Personal' };
const EN = { 'projects.kind.work': 'Work', 'projects.kind.personal': 'Personal' };

function setup(lang: 'es' | 'en' = 'es') {
  const dict = lang === 'es' ? ES : EN;
  TestBed.configureTestingModule({
    providers: [
      {
        provide: TranslationService,
        useValue: {
          lang: () => lang,
          t: (key: string) => dict[key as keyof typeof dict] ?? key,
        },
      },
    ],
  });
  const fixture = TestBed.createComponent(ProjectCard);
  fixture.componentRef.setInput('project', PROJECTS[0]);
  fixture.componentRef.setInput('index', 0);
  fixture.detectChanges();
  return fixture;
}

function luminance(rgb: readonly [number, number, number]): number {
  const channel = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
}

function contrastRatio(a: readonly [number, number, number], b: readonly [number, number, number]): number {
  const [l1, l2] = [luminance(a), luminance(b)];
  const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (light + 0.05) / (dark + 0.05);
}

const ACCENT: readonly [number, number, number] = [37, 99, 235];
const FOREGROUND: readonly [number, number, number] = [9, 9, 11];
const BACKGROUND: readonly [number, number, number] = [250, 250, 250];

function blend(fg: readonly [number, number, number], alpha: number, bg: readonly [number, number, number]): readonly [number, number, number] {
  return [
    Math.round(fg[0] * alpha + bg[0] * (1 - alpha)),
    Math.round(fg[1] * alpha + bg[1] * (1 - alpha)),
    Math.round(fg[2] * alpha + bg[2] * (1 - alpha)),
  ];
}

describe('ProjectCard', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders the kind badge with WCAG AA-compliant text on the accent background', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const badge = root.querySelector('header span.rounded-full');
    expect(badge).toBeTruthy();

    // Badge paints bg-accent/10 over the card background (#FAFAFA).
    // The previous design used text-accent on bg-accent/10 and measured
    // 4.32:1 — below the 4.5:1 WCAG AA threshold for normal text. This
    // test pins the corrected combination so any future regression is
    // caught at unit-test time.
    const classes = badge!.getAttribute('class') ?? '';
    expect(classes).toContain('bg-accent/10');
    expect(classes).toContain('text-foreground');

    const bgComposite = blend(ACCENT, 0.10, BACKGROUND);
    const ratio = contrastRatio(FOREGROUND, bgComposite);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('does not render the highlights section in either language', () => {
    const esFixture = setup('es');
    const esRoot = esFixture.nativeElement as HTMLElement;

    // Highlights were reverted (internal review only); the Spanish locale
    // must not expose the label or the bullet list.
    expect(esRoot.textContent).not.toContain('Lo que cambió');
    expect(esRoot.querySelector('ul')).toBeNull();

    TestBed.resetTestingModule();
    const enFixture = setup('en');
    const enRoot = enFixture.nativeElement as HTMLElement;
    expect(enRoot.textContent).not.toContain('What changed');
    expect(enRoot.querySelector('ul')).toBeNull();
  });

  it('renders the short description in the card without highlights bullets', () => {
    const fixture = setup();
    const root = fixture.nativeElement as HTMLElement;
    const project = PROJECTS[0];

    expect(root.textContent).toContain(project.shortDescription);
  });

  it('renders the English overlay when the active language is en', () => {
    const fixture = setup('en');
    const root = fixture.nativeElement as HTMLElement;
    const project = PROJECTS[0];

    // image alt is swapped (the img tag carries it as an attribute)
    const img = root.querySelector('img');
    expect(img?.getAttribute('alt')).toBe(project.localized!.en!.imageAlt);

    // shortDescription is rendered from the overlay, not the Spanish default
    const enShort = project.localized!.en!.shortDescription;
    expect(enShort).toBeTruthy();
    expect(root.textContent).toContain(enShort);
    expect(root.textContent).not.toContain(project.shortDescription);
  });
});