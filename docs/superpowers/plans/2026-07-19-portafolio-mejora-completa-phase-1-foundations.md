# Portafolio Mejora Completa — Phase 1 (Foundations) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the Angular 22 portfolio into a bilingual (ES/EN), SEO-optimized, accessibility-polished single-page application with self-hosted fonts, OG image, sitemap/robots, and refined copy — all without changing the visual identity or adding Angular Router.

**Architecture:** Custom `TranslationService` (signals) + `TranslationPipe` + JSON dictionaries in `public/i18n/` for client-side i18n (no Router). `SeoService` uses Angular's `Meta`/`Title` and `Renderer2` to inject JSON-LD dynamically. Public SEO assets (`sitemap.xml`, `robots.txt`) ship from `public/`. OG image and self-hosted font subsets generated at build time by Node scripts using `sharp` and `glyphhanger`. All copy refinements live in the i18n JSON so both languages benefit.

**Tech Stack:** Angular 22 (standalone, signals), Tailwind v4, vitest, sharp, glyphhanger (or fonttools), Plausible (deferred to Phase 3). No new runtime dependencies for Phase 1.

**Source spec:** `docs/superpowers/specs/2026-07-19-portafolio-mejora-completa-design.md`

## Global Constraints

- Angular 22 standalone components + signals (no NgModules, no Router).
- Default language is Spanish (`es`); English (`en`) is secondary.
- All public-facing strings live in `public/i18n/{es,en}.json` — never hardcode visible copy in components/templates.
- `<html lang>`, `<title>`, and `<meta name="description">` must update reactively when language changes.
- The CV button, project images, and modal anchors remain in their current locations — no layout/restructuring.
- Build output path: `dist/portafolio/browser/` (CI/CD already targets this).
- Public assets are copied verbatim from `public/` (Angular's `**/*` glob).
- Project ID slugs (e.g. `telemetria-2-0`) never change regardless of language.
- Test framework is **vitest** (already configured). Run with `npx vitest run` or `npm test -- --watch=false`.
- Dev server: `npm start`. Production build: `npm run build`.

## File Structure

| File | Responsibility |
|---|---|
| `public/i18n/es.json` | Spanish copy dictionary |
| `public/i18n/en.json` | English copy dictionary |
| `src/app/i18n/translation.service.ts` | Signal-based language state + JSON fetch + localStorage persistence |
| `src/app/i18n/translation.pipe.ts` | Pure pipe `t` that reads translation service |
| `src/app/i18n/lang-toggle.component.ts` | Standalone toggle button (ES/EN) |
| `src/app/seo/seo.service.ts` | Inject meta tags, title, JSON-LD via `Meta`+`Title`+`Renderer2` |
| `src/app/seo/seo.types.ts` | TypeScript interfaces for JSON-LD payloads |
| `public/sitemap.xml` | Static sitemap with hreflang + CV URLs |
| `public/robots.txt` | Static robots with sitemap reference |
| `scripts/generate-og.mjs` | Generate `og-default.png` (1200×630) using `sharp` |
| `public/og-default.png` | Generated OG image |
| `public/fonts/*.woff2` | Self-hosted, subset Archivo + Space Grotesk |
| `src/styles.css` | `@font-face` declarations (replaces Google Fonts CDN link) |
| `src/index.html` | Drop Google Fonts `<link>`, add hreflang, OG meta |
| `src/app/models/project.ts` | Add optional `highlights` and `kindLabel` fields |
| `src/app/data/projects.ts` | Add `highlights` per project |
| Component templates | Replace hardcoded strings with `{{ 'key' \| t }}` |
| `src/app/app.html` | Add skip link at top |
| `src/app/components/project-dialog/project-dialog.ts` | Save/restore focus on open/close |
| `scripts/check-favicons.mjs` | (no change) — favicon script stays |
| `src/app/app.spec.ts` | Update to provide TranslationService + SeoService stubs |

---

## Task 1: i18n JSON dictionaries (es.json, en.json)

**Files:**
- Create: `public/i18n/es.json`
- Create: `public/i18n/en.json`

These are the source of truth for every user-visible string. Both files share the same keys; values differ by language.

- [ ] **Step 1: Create Spanish dictionary**

Create `public/i18n/es.json` with this exact content:

```json
{
  "meta.title": "Portafolio — Patricio Manquepillan",
  "meta.description": "Senior Frontend Developer con +6 años en producción. Angular lead en Banco Santander, WCAG AA en Comunidad de Madrid. Disponible para remoto y freelance.",
  "meta.ogDescription": "Senior Frontend Developer. Angular, TypeScript, accesibilidad WCAG AA. Disponible para remoto y freelance.",
  "nav.projects": "Proyectos",
  "nav.about": "Sobre mí",
  "nav.email": "patriciomanquepillantorres@gmail.com",
  "langToggle.ariaLabel": "Cambiar idioma",
  "langToggle.labelEs": "Español",
  "langToggle.labelEn": "English",
  "hero.badge": "Disponible para nuevos proyectos",
  "hero.title.line1": "Construyo productos",
  "hero.title.highlight": "que la gente",
  "hero.title.line2": "usa todos los días.",
  "hero.subtitle": "Soy Patricio Manquepillan, desarrollador frontend con foco en Angular y TypeScript. Estos son los productos en los que más he crecido en los últimos años — cada uno con su historia y su responsable firmando lo que aprendí ahí.",
  "hero.credentials": "+6 años en producción · Angular lead en Banco Santander · WCAG AA en Comunidad de Madrid",
  "hero.cta.projects": "Ver proyectos",
  "hero.cta.cv": "Descargar CV",
  "hero.cta.contact": "Escríbeme",
  "about.eyebrow": "Sobre mí",
  "about.title": "Producto, equipo y código limpio.",
  "about.paragraph1": "Llevo {years} años en producción, con cientos de usuarios en los productos donde he trabajado. Empecé unificando los SCADA de cuatro sanitarias chilenas, después me fui al área de Capital de Banco Santander a automatizar backstops crediticios en Java y Spring Boot sobre Kubernetes, y ahora estoy en un portal institucional con WCAG AA estricto. En mis tiempos libres armo cualautocompro.cl, un comparador del mercado automotriz chileno.",
  "about.paragraph2": "Me obsesionan dos cosas y media. Que la UI se sienta bien al usarla. Que el código envejezca bien. Y que las decisiones técnicas queden justificadas para el siguiente que las lea.",
  "about.paragraph3": "Hoy trabajo como frontend lead en proyectos de Angular. Cuando hace falta, me meto en backend sin drama.",
  "about.now": "Ahora liderando frontend en un portal con 2M visitas/mes y WCAG AA estricto.",
  "projects.title": "Proyectos",
  "projects.subtitle": "Cada uno con la carta de recomendación de quien me supervisó.",
  "projects.kind.work": "Trabajo",
  "projects.kind.personal": "Personal",
  "projects.action.viewLetter": "Ver carta",
  "projects.action.viewSite": "Ir al sitio",
  "projects.action.viewRepo": "Ver repositorio",
  "projects.highlightsLabel": "Lo que cambió",
  "dialog.close": "Cerrar",
  "dialog.closeAria": "Cerrar diálogo de {title}",
  "dialog.letterPending": "Carta pendiente",
  "dialog.letterPendingBody": "La carta de referencia para este proyecto aún no está disponible.",
  "dialog.responsable": "Responsable",
  "dialog.escToClose": "Pulsa",
  "footer.tagline": "Construyendo productos web que se sienten bien al usarlos.",
  "footer.copy": "© {year}. Hecho con Angular 22 y Tailwind v4, sin frameworks de UI.",
  "footer.cvLink": "CV (ES)",
  "footer.cvLinkEn": "CV (EN)",
  "skipLink": "Saltar al contenido",
  "analytics.contactClick": "contact_click",
  "analytics.cvDownload": "cv_download",
  "analytics.langSwitch": "lang_switch",
  "analytics.projectOpen": "project_open"
}
```

- [ ] **Step 2: Create English dictionary**

Create `public/i18n/en.json` with this exact content:

```json
{
  "meta.title": "Portfolio — Patricio Manquepillan",
  "meta.description": "Senior Frontend Developer with 6+ years in production. Angular lead at Banco Santander, WCAG AA at Comunidad de Madrid. Open to remote and freelance.",
  "meta.ogDescription": "Senior Frontend Developer. Angular, TypeScript, WCAG AA accessibility. Open to remote and freelance.",
  "nav.projects": "Projects",
  "nav.about": "About",
  "nav.email": "patriciomanquepillantorres@gmail.com",
  "langToggle.ariaLabel": "Change language",
  "langToggle.labelEs": "Español",
  "langToggle.labelEn": "English",
  "hero.badge": "Available for new projects",
  "hero.title.line1": "I build products",
  "hero.title.highlight": "that people",
  "hero.title.line2": "use every day.",
  "hero.subtitle": "I'm Patricio Manquepillan, a frontend developer focused on Angular and TypeScript. These are the products I've grown the most on in the last few years — each with its story and its accountable lead signing off on what I learned there.",
  "hero.credentials": "6+ years in production · Angular lead at Banco Santander · WCAG AA at Comunidad de Madrid",
  "hero.cta.projects": "See projects",
  "hero.cta.cv": "Download CV",
  "hero.cta.contact": "Email me",
  "about.eyebrow": "About",
  "about.title": "Product, team, and clean code.",
  "about.paragraph1": "I've spent {years} years in production, with hundreds of users in the products I've worked on. I started by unifying the SCADA systems of four Chilean water utilities, then moved to Banco Santander's Capital area to automate credit backstops in Java and Spring Boot on Kubernetes, and now I'm at an institutional portal with strict WCAG AA. In my free time I build cualautocompro.cl, a comparator for the Chilean automotive market.",
  "about.paragraph2": "I'm obsessed with two and a half things. That the UI feels good to use. That the code ages well. And that technical decisions stay justified for whoever reads them next.",
  "about.paragraph3": "I currently work as a frontend lead on Angular projects. When needed, I jump into backend without drama.",
  "about.now": "Now leading frontend on a portal with 2M visits/month and strict WCAG AA.",
  "projects.title": "Projects",
  "projects.subtitle": "Each one with the recommendation letter from the person who supervised me.",
  "projects.kind.work": "Work",
  "projects.kind.personal": "Personal",
  "projects.action.viewLetter": "View letter",
  "projects.action.viewSite": "Visit site",
  "projects.action.viewRepo": "View repository",
  "projects.highlightsLabel": "What changed",
  "dialog.close": "Close",
  "dialog.closeAria": "Close {title} dialog",
  "dialog.letterPending": "Letter pending",
  "dialog.letterPendingBody": "The reference letter for this project is not yet available.",
  "dialog.responsable": "Lead",
  "dialog.escToClose": "Press",
  "footer.tagline": "Building web products that feel good to use.",
  "footer.copy": "© {year}. Built with Angular 22 and Tailwind v4, no UI frameworks.",
  "footer.cvLink": "CV (ES)",
  "footer.cvLinkEn": "CV (EN)",
  "skipLink": "Skip to content",
  "analytics.contactClick": "contact_click",
  "analytics.cvDownload": "cv_download",
  "analytics.langSwitch": "lang_switch",
  "analytics.projectOpen": "project_open"
}
```

- [ ] **Step 3: Verify the JSON parses**

Run from project root:

```bash
node -e "JSON.parse(require('fs').readFileSync('public/i18n/es.json','utf8'));JSON.parse(require('fs').readFileSync('public/i18n/en.json','utf8'));console.log('OK')"
```

Expected output: `OK`

- [ ] **Step 4: Verify both files have the same keys**

Run:

```bash
node -e "
const es=Object.keys(JSON.parse(require('fs').readFileSync('public/i18n/es.json','utf8'))).sort();
const en=Object.keys(JSON.parse(require('fs').readFileSync('public/i18n/en.json','utf8'))).sort();
const missing=es.filter(k=>!en.includes(k));
const extra=en.filter(k=>!es.includes(k));
if(missing.length||extra.length){console.error('MISMATCH missing:',missing,'extra:',extra);process.exit(1);}
console.log('OK keys:',es.length);
"
```

Expected output: `OK keys: 45`

- [ ] **Step 5: Commit**

```bash
git add public/i18n/es.json public/i18n/en.json
git commit -m "feat(i18n): add es/en translation dictionaries"
```

---

## Task 2: TranslationService (signal-based, JSON loader, localStorage)

**Files:**
- Create: `src/app/i18n/translation.service.ts`
- Create: `src/app/i18n/translation.service.spec.ts`

**Interfaces:**
- Produces: `TranslationService` class with `lang: WritableSignal<'es'|'en'>`, `translations: WritableSignal<Record<string,string>>`, `t(key: string): string`, `setLang(lang): Promise<void>`, `toggleLang(): Promise<void>`. Loads `/i18n/{lang}.json`. Persists in `localStorage['preferred-lang']`.

- [ ] **Step 1: Write the failing test**

Create `src/app/i18n/translation.service.spec.ts`:

```typescript
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npx vitest run src/app/i18n/translation.service.spec.ts
```

Expected: FAIL with "Cannot find module './translation.service'" or similar.

- [ ] **Step 3: Implement TranslationService**

Create `src/app/i18n/translation.service.ts`:

```typescript
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
  private readonly translationsSignal = signal<Record<string, string>>({});

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
    const raw = this.translationsSignal()[key] ?? key;
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
      this.translationsSignal.set(data);
    } catch {
      this.translationsSignal.set({});
    }
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
npx vitest run src/app/i18n/translation.service.spec.ts
```

Expected: all 8 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/i18n/translation.service.ts src/app/i18n/translation.service.spec.ts
git commit -m "feat(i18n): add TranslationService with signal + localStorage"
```

---

## Task 3: TranslationPipe (pure pipe consuming the service)

**Files:**
- Create: `src/app/i18n/translation.pipe.ts`
- Create: `src/app/i18n/translation.pipe.spec.ts`

**Interfaces:**
- Consumes: `TranslationService` (Task 2).
- Produces: `TranslationPipe` (standalone, pure: false because it depends on a signal — see note). Usage: `{{ 'hero.title.line1' | t }}` and `{{ 'about.paragraph1' | t:{years: 7} }}`.

- [ ] **Step 1: Write the failing test**

Create `src/app/i18n/translation.pipe.spec.ts`:

```typescript
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npx vitest run src/app/i18n/translation.pipe.spec.ts
```

Expected: FAIL with "Cannot find module".

- [ ] **Step 3: Implement the pipe**

Create `src/app/i18n/translation.pipe.ts`:

```typescript
import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from './translation.service';

@Pipe({ name: 't', standalone: true, pure: false })
export class TranslationPipe implements PipeTransform {
  private readonly service = inject(TranslationService);

  transform(key: string, params?: Record<string, string | number>): string {
    return this.service.t(key, params);
  }
}
```

Note: `pure: false` is required because the pipe reads from a signal — the change detection needs to re-run when the signal updates.

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
npx vitest run src/app/i18n/translation.pipe.spec.ts
```

Expected: all 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/i18n/translation.pipe.ts src/app/i18n/translation.pipe.spec.ts
git commit -m "feat(i18n): add TranslationPipe (t)"
```

---

## Task 4: LangToggle component

**Files:**
- Create: `src/app/i18n/lang-toggle.component.ts`

**Interfaces:**
- Consumes: `TranslationService` (Task 2).
- Produces: a button group rendered as `<app-lang-toggle />` showing `ES | EN` with the active language highlighted. Emits nothing; mutates service state.

- [ ] **Step 1: Implement the component**

Create `src/app/i18n/lang-toggle.component.ts`:

```typescript
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslationService, Lang } from './translation.service';
import { TranslationPipe } from './translation.pipe';

@Component({
  selector: 'app-lang-toggle',
  standalone: true,
  imports: [TranslationPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      role="group"
      [attr.aria-label]="'langToggle.ariaLabel' | t"
      class="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 p-1 text-xs font-medium backdrop-blur"
    >
      @for (l of langs; track l) {
        <button
          type="button"
          (click)="setLang(l)"
          [attr.aria-pressed]="service.lang() === l"
          [attr.aria-label]="ariaLabel(l)"
          class="rounded-full px-2.5 py-1 transition-colors"
          [class.bg-foreground]="service.lang() === l"
          [class.text-background]="service.lang() === l"
          [class.text-secondary]="service.lang() !== l"
          [class.hover:text-foreground]="service.lang() !== l"
        >
          {{ l === 'es' ? 'ES' : 'EN' }}
        </button>
      }
    </div>
  `,
})
export class LangToggle {
  protected readonly service = inject(TranslationService);
  protected readonly langs: readonly Lang[] = ['es', 'en'];

  protected setLang(lang: Lang): void {
    void this.service.setLang(lang);
  }

  protected ariaLabel(lang: Lang): string {
    return lang === 'es'
      ? this.service.t('langToggle.labelEs')
      : this.service.t('langToggle.labelEn');
  }
}
```

- [ ] **Step 2: Build to verify it compiles**

Run:

```bash
npm run build 2>&1 | tail -20
```

Expected: build succeeds (warnings about unused imports for now are fine, but no errors).

- [ ] **Step 3: Commit**

```bash
git add src/app/i18n/lang-toggle.component.ts
git commit -m "feat(i18n): add LangToggle standalone component"
```

---

## Task 5: Wire TranslationService and LangToggle into App root

**Files:**
- Modify: `src/app/app.ts`
- Modify: `src/app/app.html`

**Interfaces:**
- Consumes: `TranslationService` (Task 2), `LangToggle` (Task 4).
- Produces: `App` injects `TranslationService` (so it bootstraps on app start) and `App.html` renders `<app-lang-toggle />` inside the header anchor area.

- [ ] **Step 1: Modify `app.ts` to inject TranslationService**

Replace the contents of `src/app/app.ts` with:

```typescript
import { Component, inject, signal } from '@angular/core';
import { About } from './components/about/about';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { ProjectDialog } from './components/project-dialog/project-dialog';
import { ProjectsSection } from './components/projects-section/projects-section';
import { PROJECTS } from './data/projects';
import { Project } from './models/project';
import { TranslationService } from './i18n/translation.service';
import { LangToggle } from './i18n/lang-toggle.component';

@Component({
  selector: 'app-root',
  imports: [
    Header,
    Hero,
    About,
    ProjectsSection,
    ProjectDialog,
    Footer,
    LangToggle,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly translation = inject(TranslationService);
  readonly projects = PROJECTS;
  readonly dialogProject = signal<Project | null>(null);

  openDialog(project: Project): void {
    this.dialogProject.set(project);
  }

  closeDialog(): void {
    this.dialogProject.set(null);
  }
}
```

- [ ] **Step 2: Modify `app.html` to wrap content with main id (for skip link)**

Replace `src/app/app.html` with:

```html
<a
  href="#main"
  class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
>
  {{ 'skipLink' | t }}
</a>
<app-header />
<main id="main" tabindex="-1">
  <app-hero />
  <app-about />
  <app-projects-section
    [projects]="projects"
    (openDialog)="openDialog($event)"
  />
</main>
<app-footer />

<app-project-dialog
  [project]="dialogProject()"
  (closeDialog)="closeDialog()"
/>
```

- [ ] **Step 3: Build to verify it compiles**

Run:

```bash
npm run build 2>&1 | tail -20
```

Expected: build succeeds. The `| t` pipe will error because the pipe is not yet imported by `App` — to fix, add `TranslationPipe` to `app.ts` imports:

In `src/app/app.ts`, add this line to the imports at the top:

```typescript
import { TranslationPipe } from './i18n/translation.pipe';
```

And add `TranslationPipe` to the `@Component({ imports: [...] })` array, after `LangToggle`.

Run `npm run build` again. Expected: success.

- [ ] **Step 4: Commit**

```bash
git add src/app/app.ts src/app/app.html
git commit -m "feat(app): wire TranslationService, LangToggle and skip link"
```

---

## Task 6: Localize Header (nav + email)

**Files:**
- Modify: `src/app/components/header/header.ts`
- Modify: `src/app/components/header/header.html`

**Interfaces:**
- Consumes: `TranslationPipe` (Task 3), `LangToggle` (Task 4).
- Produces: header nav text and email link use translation keys; `<app-lang-toggle />` is rendered in the nav.

- [ ] **Step 1: Update `header.ts` to import the pipe**

Replace the contents of `src/app/components/header/header.ts` with:

```typescript
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslationPipe } from '../../i18n/translation.pipe';
import { LangToggle } from '../../i18n/lang-toggle.component';

@Component({
  selector: 'app-header',
  imports: [TranslationPipe, LangToggle],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly scrolled = signal(false);

  constructor() {
    if (typeof window === 'undefined') return;
    window.addEventListener(
      'scroll',
      () => {
        this.scrolled.set(window.scrollY > 8);
      },
      { passive: true },
    );
  }
}
```

- [ ] **Step 2: Replace `header.html` with i18n-aware version**

Replace the contents of `src/app/components/header/header.html` with:

```html
<header
  class="sticky top-0 z-40 w-full border-b transition-all duration-200"
  [class.backdrop-blur-md]="scrolled()"
  [class.bg-background\/80]="scrolled()"
  [class.border-transparent]="!scrolled()"
  [class.border-border]="scrolled()"
  [class.bg-transparent]="!scrolled()"
>
  <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
    <a
      href="#top"
      class="font-display text-base font-bold tracking-tight text-foreground"
    >
      Patricio Manquepillan
      <span class="ml-1 hidden font-sans text-xs font-normal text-secondary sm:inline">/ developer</span>
    </a>

    <nav class="flex items-center gap-4 text-sm text-secondary sm:gap-6">
      <a
        href="#proyectos"
        class="hidden transition-colors hover:text-foreground sm:block"
      >{{ 'nav.projects' | t }}</a>
      <a
        href="#sobre-mi"
        class="hidden transition-colors hover:text-foreground sm:block"
      >{{ 'nav.about' | t }}</a>
      <app-lang-toggle />
      <a
        [href]="'mailto:' + ('nav.email' | t)"
        class="group hidden items-center gap-1.5 font-medium text-foreground transition-colors hover:text-accent sm:inline-flex"
      >
        <span class="hidden md:inline">{{ 'nav.email' | t }}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          class="transition-transform group-hover:translate-x-0.5"
        >
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </a>
    </nav>
  </div>
</header>
```

- [ ] **Step 3: Build and verify**

```bash
npm run build 2>&1 | tail -10
```

Expected: build succeeds.

- [ ] **Step 4: Run all tests**

```bash
npx vitest run
```

Expected: existing tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/header/header.ts src/app/components/header/header.html
git commit -m "feat(header): localize nav and add LangToggle"
```

---

## Task 7: Localize Hero (badge, title, subtitle, CTAs, credentials)

**Files:**
- Modify: `src/app/components/hero/hero.ts`
- Modify: `src/app/components/hero/hero.html`

- [ ] **Step 1: Update `hero.ts`**

Replace the contents of `src/app/components/hero/hero.ts` with:

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslationPipe } from '../../i18n/translation.pipe';

@Component({
  selector: 'app-hero',
  imports: [TranslationPipe],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {}
```

- [ ] **Step 2: Replace `hero.html`**

Replace the contents of `src/app/components/hero/hero.html` with:

```html
<section
  id="top"
  class="relative mx-auto max-w-6xl px-6 pb-24 pt-6 md:pb-32"
>
  <div class="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-secondary backdrop-blur">
    <span class="inline-block size-1.5 rounded-full bg-accent"></span>
    {{ 'hero.badge' | t }}
  </div>

  <h1 class="text-display mt-6 text-[clamp(3rem,9vw,7.5rem)] text-foreground">
    {{ 'hero.title.line1' | t }}<br />
    <span class="text-accent">{{ 'hero.title.highlight' | t }}</span><br />
    {{ 'hero.title.line2' | t }}
  </h1>

  <p class="mt-8 max-w-xl text-lg leading-relaxed text-secondary md:text-xl">
    {{ 'hero.subtitle' | t }}
  </p>

  <p class="mt-4 max-w-xl text-sm font-medium text-foreground/80 md:text-base">
    {{ 'hero.credentials' | t }}
  </p>

  <div class="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
    <a
      href="#proyectos"
      class="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02] hover:bg-accent"
    >
      {{ 'hero.cta.projects' | t }}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M5 12h14M13 5l7 7-7 7" />
      </svg>
    </a>
    <a
      href="/cv-es.pdf"
      download
      class="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground"
    >
      {{ 'hero.cta.cv' | t }}
    </a>
    <a
      [href]="'mailto:' + ('nav.email' | t)"
      class="inline-flex items-center justify-center text-sm font-medium text-secondary underline-offset-4 transition-colors hover:text-foreground hover:underline sm:ml-2"
    >
      {{ 'hero.cta.contact' | t }}
    </a>
  </div>
</section>
```

Note: the CV href is hardcoded to `/cv-es.pdf` for Phase 1. Phase 3 will swap to `cv-{lang}.pdf` based on active language.

- [ ] **Step 3: Build and run tests**

```bash
npm run build 2>&1 | tail -10
npx vitest run
```

Expected: build succeeds, tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/hero/hero.ts src/app/components/hero/hero.html
git commit -m "feat(hero): localize copy, add credentials line and CV CTA"
```

---

## Task 8: Localize About (eyebrow, paragraphs, "ahora" line)

**Files:**
- Modify: `src/app/components/about/about.ts`
- Modify: `src/app/components/about/about.html`

- [ ] **Step 1: Update `about.ts` to inject yearsOfExperience + TranslationPipe**

Replace the contents of `src/app/components/about/about.ts` with:

```typescript
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { TranslationPipe } from '../../i18n/translation.pipe';
import { yearsOfExperience } from '../../utils/experience';

@Component({
  selector: 'app-about',
  imports: [TranslationPipe],
  templateUrl: './about.html',
  styleUrl: './about.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  protected readonly years = yearsOfExperience();
  protected readonly yearsText = computed(() => String(this.years));
}
```

- [ ] **Step 2: Replace `about.html`**

Replace the contents of `src/app/components/about/about.html` with:

```html
<section
  id="sobre-mi"
  class="border-y border-border bg-background/50 py-20 backdrop-blur-sm md:py-28"
>
  <div class="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1fr_2fr] md:gap-16">
    <div>
      <p class="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-accent">{{ 'about.eyebrow' | t }}</p>
      <h2 class="text-display text-3xl text-foreground md:text-4xl">
        {{ 'about.title' | t }}
      </h2>
    </div>

    <div class="space-y-5 text-base leading-relaxed text-secondary md:text-lg">
      <p>{{ 'about.paragraph1' | t:{years: yearsText()} }}</p>
      <p>{{ 'about.paragraph2' | t }}</p>
      <p class="text-foreground">{{ 'about.now' | t }}</p>
      <p>{{ 'about.paragraph3' | t }}</p>

      <div class="flex flex-wrap gap-2 pt-4">
        @for (tech of stack; track tech) {
          <span
            class="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground"
          >{{ tech }}</span>
        }
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Build and test**

```bash
npm run build 2>&1 | tail -10
npx vitest run
```

Expected: build succeeds, tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/about/about.ts src/app/components/about/about.html
git commit -m "feat(about): localize copy and add 'ahora' line"
```

---

## Task 9: Localize ProjectsSection (title, subtitle, dialog close)

**Files:**
- Modify: `src/app/components/projects-section/projects-section.ts`
- Modify: `src/app/components/projects-section/projects-section.html`

- [ ] **Step 1: Update `projects-section.ts`**

Read current file first, then replace its contents with:

```typescript
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Project } from '../../models/project';
import { ProjectCard } from '../project-card/project-card';
import { TranslationPipe } from '../../i18n/translation.pipe';

@Component({
  selector: 'app-projects-section',
  imports: [ProjectCard, TranslationPipe],
  templateUrl: './projects-section.html',
  styleUrl: './projects-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsSection {
  readonly projects = input.required<readonly Project[]>();
  readonly openDialog = output<Project>();
}
```

- [ ] **Step 2: Replace `projects-section.html`**

Replace the contents of `src/app/components/projects-section/projects-section.html` with:

```html
<section
  id="proyectos"
  class="mx-auto max-w-6xl px-6 py-20 md:py-28"
>
  <header class="mb-12 max-w-2xl md:mb-16">
    <p class="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-accent">{{ 'projects.title' | t }}</p>
    <h2 class="text-display text-3xl text-foreground md:text-4xl">
      {{ 'projects.subtitle' | t }}
    </h2>
  </header>

  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    @for (project of projects(); track project.id; let i = $index) {
      <app-project-card [project]="project" [index]="i" (openDialog)="openDialog.emit($event)" />
    }
  </div>
</section>
```

- [ ] **Step 3: Build and test**

```bash
npm run build 2>&1 | tail -10
npx vitest run
```

Expected: build succeeds, tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/projects-section/projects-section.ts src/app/components/projects-section/projects-section.html
git commit -m "feat(projects-section): localize title and subtitle"
```

---

## Task 10: Localize ProjectCard (kind badge, year, actions)

**Files:**
- Modify: `src/app/components/project-card/project-card.ts`
- Modify: `src/app/components/project-card/project-card.html`

**Interfaces:**
- Consumes: `TranslationPipe` (Task 3), `Project` model with optional `kindLabel` field (added in Task 13).

- [ ] **Step 1: Update `project-card.ts`**

Read current file first, then replace its contents with:

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { Project, PersonalProject, WorkProject } from '../../models/project';
import { TranslationPipe } from '../../i18n/translation.pipe';

@Component({
  selector: 'app-project-card',
  imports: [TranslationPipe],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCard {
  readonly project = input.required<Project>();
  readonly index = input<number>(0);
  readonly openDialog = output<Project>();

  protected readonly githubUrl = computed(() => {
    const p = this.project();
    return p.kind === 'personal' ? (p as PersonalProject).githubUrl : '';
  });

  protected readonly siteUrl = computed(() => {
    const p = this.project();
    return p.kind === 'personal' ? (p as PersonalProject).siteUrl ?? null : null;
  });

  protected readonly kindLabel = computed(() => {
    const p = this.project();
    const key = p.kind === 'work' ? 'projects.kind.work' : 'projects.kind.personal';
    return key;
  });

  protected onCardClick(): void {
    const p = this.project();
    if (p.kind === 'work') this.openDialog.emit(p);
  }
}
```

- [ ] **Step 2: Replace `project-card.html`**

Replace the contents of `src/app/components/project-card/project-card.html` with:

```html
<article
  class="animate-card-in group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-all duration-200 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-[0_20px_40px_-20px_rgba(9,9,11,0.18)]"
  [style.animation-delay.ms]="index() * 60"
>
  <div class="relative aspect-[16/10] overflow-hidden bg-muted">
    <img
      [ngSrc]="project().image"
      [alt]="project().imageAlt"
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      [priority]="index() < 2"
      class="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
    />
    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
  </div>

  <div class="flex flex-1 flex-col gap-5 p-6 md:p-7">
    <header class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <span class="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent">
          {{ kindLabel() | t }}
        </span>
        <span class="font-mono text-[11px] font-medium text-secondary">
          {{ project().year }}
        </span>
      </div>
      <h3 class="text-display text-2xl text-foreground md:text-[1.7rem]">
        {{ project().title }}
      </h3>
      <p class="text-sm text-secondary">
        {{ project().company }} · <span class="text-accent">{{ project().role }}</span>
      </p>
    </header>

    <p class="text-[15px] leading-relaxed text-secondary">
      {{ project().shortDescription }}
      @if (project().highlights && project().highlights!.length > 0) {
        <span class="mt-2 block text-xs font-medium text-foreground">
          {{ 'projects.highlightsLabel' | t }}:
        </span>
      }
    </p>

    <div class="flex flex-wrap gap-1.5">
      @for (tech of project().technologies; track tech) {
        <span class="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-secondary">
          {{ tech }}
        </span>
      }
    </div>

    <div class="mt-auto border-t border-border pt-5">
      @if (project().kind === 'work') {
        <button
          type="button"
          (click)="openDialog.emit(project())"
          class="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition-colors hover:bg-accent"
          [attr.aria-label]="'Ver carta de recomendación de ' + project().title"
        >
          {{ 'projects.action.viewLetter' | t }}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            class="transition-transform group-hover:translate-x-0.5"
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </button>
      } @else {
        <div class="flex flex-wrap items-center justify-end gap-2">
          @if (siteUrl(); as url) {
            <a
              [href]="url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition-colors hover:bg-accent"
              [attr.aria-label]="'Ir al sitio de ' + project().title"
            >
              {{ 'projects.action.viewSite' | t }}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
                class="transition-transform group-hover:translate-x-0.5"
              >
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          }
          <a
            [href]="githubUrl()"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition-colors hover:bg-accent"
            [attr.aria-label]="'Ver repositorio de ' + project().title + ' en GitHub'"
          >
            {{ 'projects.action.viewRepo' | t }}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              class="transition-transform group-hover:translate-x-0.5"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      }
    </div>
  </div>
</article>
```

- [ ] **Step 3: Build and test**

```bash
npm run build 2>&1 | tail -10
npx vitest run
```

Expected: build succeeds, tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/project-card/project-card.ts src/app/components/project-card/project-card.html
git commit -m "feat(project-card): localize kind badge and actions"
```

---

## Task 11: Add highlights to Project model + data

**Files:**
- Modify: `src/app/models/project.ts`
- Modify: `src/app/data/projects.ts`

- [ ] **Step 1: Add `highlights` to `BaseProject` in the model**

Replace the contents of `src/app/models/project.ts` with:

```typescript
export interface Letter {
  readonly paragraphs: readonly string[];
  readonly signer: {
    readonly name: string;
    readonly role: string;
    readonly company: string;
  };
}

export interface BaseProject {
  readonly id: string;
  readonly title: string;
  readonly company: string;
  readonly year: string;
  readonly role: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly shortDescription: string;
  readonly technologies: readonly string[];
  readonly body: string;
  readonly highlights?: readonly string[];
}

export interface WorkProject extends BaseProject {
  readonly kind: 'work';
  readonly letter?: Letter;
}

export interface PersonalProject extends BaseProject {
  readonly kind: 'personal';
  readonly githubUrl: string;
  readonly siteUrl?: string;
}

export type Project = WorkProject | PersonalProject;
```

- [ ] **Step 2: Add highlights to each project in `projects.ts`**

Edit `src/app/data/projects.ts` and add the `highlights` field to each project. Insert it right after the `technologies` array. Use these exact arrays:

For `telemetria-2-0` (add right after `technologies` close-bracket on line ~26):

```typescript
    highlights: [
      'Unificó 4 SCADA independientes en una sola plataforma web',
      '50+ plantas migradas, incluida la desalinizadora de Iquique',
      'Stack: AVEVA · Oracle · Angular · Spring Boot · Python',
    ],
```

For `backstops` (after `technologies` array):

```typescript
    highlights: [
      'Motor de reglas de cobertura crediticia configurable',
      'Migración de reportes manuales a módulo regulatorio automatizado',
      'Stack: Angular · Java · Spring Boot · Kubernetes',
    ],
```

For `comunidad-madrid` (after `technologies` array):

```typescript
    highlights: [
      'WCAG AA estricto: librería accesible adoptada como estándar interno',
      'Angular Universal con TTFB < 200 ms y 2M visitas/mes',
      'Stack: Angular · Micro Front Ends · Capacitor · TypeScript',
    ],
```

For `cualautocompro-cl` (after `technologies` array):

```typescript
    highlights: [
      'Comparador del mercado automotriz chileno con sharing de análisis',
      'Scraping propio + motor de ranker configurable por criterio',
      'Stack: Angular · Express · Prisma · MySQL · Playwright',
    ],
```

- [ ] **Step 3: Build and test**

```bash
npm run build 2>&1 | tail -10
npx vitest run
```

Expected: build succeeds, tests pass (existing tests still work — `highlights` is optional).

- [ ] **Step 4: Commit**

```bash
git add src/app/models/project.ts src/app/data/projects.ts
git commit -m "feat(projects): add highlights array to Project model and data"
```

---

## Task 12: Localize ProjectDialog (close button, aria-label)

**Files:**
- Modify: `src/app/components/project-dialog/project-dialog.ts`
- Modify: `src/app/components/project-dialog/project-dialog.html`

- [ ] **Step 1: Update `project-dialog.ts`**

Replace the contents of `src/app/components/project-dialog/project-dialog.ts` with:

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { Letter, Project, WorkProject } from '../../models/project';
import { TranslationService } from '../../i18n/translation.service';
import { TranslationPipe } from '../../i18n/translation.pipe';

@Component({
  selector: 'app-project-dialog',
  imports: [TranslationPipe],
  templateUrl: './project-dialog.html',
  styleUrl: './project-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDialog {
  private readonly i18n = inject(TranslationService);

  readonly project = input<Project | null>(null);
  readonly closeDialog = output<void>();

  readonly letter = computed<Letter | null>(() => {
    const project = this.project();
    if (project?.kind !== 'work') return null;
    return (project as WorkProject).letter ?? null;
  });

  private readonly dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private previouslyFocused: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const current = this.project();
      const dialogEl = this.dialogRef().nativeElement;

      if (current) {
        if (!dialogEl.open) {
          this.previouslyFocused = document.activeElement as HTMLElement | null;
          dialogEl.showModal();
        }
      } else if (dialogEl.open) {
        dialogEl.close();
        queueMicrotask(() => this.previouslyFocused?.focus());
      }
    });
  }

  protected closeAriaLabel(title: string): string {
    return this.i18n.t('dialog.closeAria', { title });
  }

  protected onDialogClick(event: MouseEvent): void {
    const dialogEl = this.dialogRef().nativeElement;
    if (event.target === dialogEl) {
      this.handleClose();
    }
  }

  protected onCancel(event: Event): void {
    event.preventDefault();
    this.handleClose();
  }

  protected handleClose(): void {
    this.closeDialog.emit();
  }
}
```

- [ ] **Step 2: Replace `project-dialog.html`**

Replace the contents of `src/app/components/project-dialog/project-dialog.html` with:

```html
<dialog
  #dialog
  (click)="onDialogClick($event)"
  (cancel)="onCancel($event)"
  class="m-0 max-h-screen w-screen max-w-none border-0 p-0 backdrop:bg-black/40"
  [attr.aria-labelledby]="project() ? 'dialog-title-' + project()!.id : null"
>
  @if (project(); as p) {
    <div
      class="flex max-h-[100dvh] w-screen flex-col bg-background text-foreground"
      role="document"
    >
      <header class="flex items-center justify-between border-b border-border px-6 py-4 md:px-10">
        <div class="flex flex-col">
          <p class="text-xs uppercase tracking-[0.2em] text-accent">{{ 'projects.action.viewLetter' | t }}</p>
          <h2
            [id]="'dialog-title-' + p.id"
            class="text-display text-lg font-bold text-foreground md:text-xl"
          >
            {{ p.title }} · {{ p.company }}
          </h2>
        </div>
        <button
          type="button"
          (click)="closeDialog.emit()"
          class="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
          [attr.aria-label]="closeAriaLabel(p.title)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div class="flex-1 overflow-auto bg-muted/40">
        <div class="mx-auto max-w-3xl p-6 md:p-10">
          @if (p.highlights && p.highlights.length > 0) {
            <section class="mb-6 rounded-lg border border-accent/20 bg-accent/5 p-5 md:p-6">
              <p class="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-accent">
                {{ 'projects.highlightsLabel' | t }}
              </p>
              <ul class="space-y-2 text-sm leading-relaxed text-foreground">
                @for (h of p.highlights; track h) {
                  <li class="flex gap-3">
                    <span class="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-accent"></span>
                    <span>{{ h }}</span>
                  </li>
                }
              </ul>
            </section>
          }

          @if (letter(); as letter) {
            <article
              class="rounded-lg border border-border bg-background p-8 shadow-[0_30px_60px_-30px_rgba(9,9,11,0.25)] md:p-12"
            >
              <div class="space-y-5 text-[15px] leading-[1.75] text-foreground">
                @for (paragraph of letter.paragraphs; track $index) {
                  <p class="text-justify">{{ paragraph }}</p>
                }
              </div>

              <div class="mt-10 border-t border-border pt-6">
                <p class="text-right text-foreground">Atentamente,</p>
                <div class="mt-6 text-right text-sm text-secondary">
                  <p class="font-display text-base font-bold text-foreground">
                    {{ letter.signer.name }}
                  </p>
                  <p>{{ letter.signer.role }}</p>
                  <p>{{ letter.signer.company }}</p>
                </div>
              </div>
            </article>
          } @else {
            <div
              class="flex min-h-[40dvh] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-background p-10 text-center text-secondary"
            >
              <p class="text-sm font-medium uppercase tracking-[0.2em] text-accent">
                {{ 'dialog.letterPending' | t }}
              </p>
              <p class="mt-3 max-w-sm text-base">
                {{ 'dialog.letterPendingBody' | t }}
              </p>
            </div>
          }
        </div>
      </div>

      <footer class="flex flex-col gap-2 border-t border-border bg-background px-6 py-4 text-xs text-secondary md:flex-row md:items-center md:justify-between md:px-10">
        <span>{{ 'dialog.responsable' | t }}: {{ p.company }}</span>
        <span class="hidden md:block">{{ 'dialog.escToClose' | t }} <kbd class="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd></span>
      </footer>
    </div>
  }
</dialog>
```

Note: this template preserves the exact CSS classes and DOM structure of the existing `project-dialog.html` (visible on disk). It only swaps hardcoded strings for translation keys (`'projects.action.viewLetter'`, `'projects.highlightsLabel'`, `'dialog.letterPending'`, etc.) and injects a new highlights section at the top of the body. Two new keys (`dialog.letterPending`, `dialog.letterPendingBody`, `dialog.responsable`, `dialog.escToClose`) need to be added to both `es.json` and `en.json` — see Step 2b.

- [ ] **Step 2b: Add new dialog keys to both translation files**

Add to both `public/i18n/es.json` and `public/i18n/en.json` (keep keys sorted alphabetically):

In `public/i18n/es.json`, add (right after `"dialog.closeAria": "Cerrar diálogo de {title}"`):

```json
  "dialog.letterPending": "Carta pendiente",
  "dialog.letterPendingBody": "La carta de referencia para este proyecto aún no está disponible.",
  "dialog.responsable": "Responsable",
  "dialog.escToClose": "Pulsa",
```

In `public/i18n/en.json`, add the same keys:

```json
  "dialog.letterPending": "Letter pending",
  "dialog.letterPendingBody": "The reference letter for this project is not yet available.",
  "dialog.responsable": "Lead",
  "dialog.escToClose": "Press",
```

Verify both files still have the same 45 keys:

```bash
node -e "
const es=Object.keys(JSON.parse(require('fs').readFileSync('public/i18n/es.json','utf8'))).sort();
const en=Object.keys(JSON.parse(require('fs').readFileSync('public/i18n/en.json','utf8'))).sort();
const missing=es.filter(k=>!en.includes(k));
const extra=en.filter(k=>!es.includes(k));
if(missing.length||extra.length){console.error('MISMATCH missing:',missing,'extra:',extra);process.exit(1);}
console.log('OK keys:',es.length);
"
```

Expected: `OK keys: 45`.

- [ ] **Step 3: Build and test**

```bash
npm run build 2>&1 | tail -10
npx vitest run
```

Expected: build succeeds, tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/project-dialog/project-dialog.ts src/app/components/project-dialog/project-dialog.html
git commit -m "feat(dialog): localize close aria-label and surface highlights"
```

---

## Task 13: Localize Footer (tagline, copy, CV links)

**Files:**
- Modify: `src/app/components/footer/footer.ts`
- Modify: `src/app/components/footer/footer.html`

- [ ] **Step 1: Update `footer.ts`**

Read current file, then replace its contents with:

```typescript
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslationPipe } from '../../i18n/translation.pipe';
import { TranslationService } from '../../i18n/translation.service';

@Component({
  selector: 'app-footer',
  imports: [TranslationPipe],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  private readonly i18n = inject(TranslationService);
  protected readonly year = new Date().getFullYear();
  protected readonly cvHrefEs = '/cv-es.pdf';
  protected readonly cvHrefEn = '/cv-en.pdf';
  protected readonly currentCvHref = computed(() =>
    this.i18n.lang() === 'en' ? this.cvHrefEn : this.cvHrefEs,
  );
  protected readonly currentCvLabel = computed(() =>
    this.i18n.lang() === 'en' ? 'footer.cvLinkEn' : 'footer.cvLink',
  );
}
```

- [ ] **Step 2: Replace `footer.html`**

Replace the contents of `src/app/components/footer/footer.html` with:

```html
<footer class="border-t border-border bg-background/50 backdrop-blur-sm">
  <div class="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
    <div>
      <p class="text-display text-base font-bold text-foreground">Patricio Manquepillan</p>
      <p class="text-sm text-secondary">{{ 'footer.tagline' | t }}</p>
    </div>

    <nav class="flex flex-wrap items-center gap-5" aria-label="Contacto">
      @for (link of links; track link.label) {
        <a
          [href]="link.href"
          [attr.target]="link.external ? '_blank' : null"
          [attr.rel]="link.external ? 'noopener noreferrer' : null"
          class="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent"
        >
          {{ link.label }}
          @if (link.external) {
            <svg ...>↗</svg>
          }
        </a>
      }
      <a
        [href]="currentCvHref()"
        download
        class="text-sm font-medium text-foreground transition-colors hover:text-accent"
      >
        {{ currentCvLabel() | t }}
      </a>
    </nav>
  </div>

  <div class="border-t border-border">
    <p class="mx-auto max-w-6xl px-6 py-4 font-mono text-[11px] tracking-wide text-secondary">
      {{ 'footer.copy' | t:{year: year} }}
    </p>
  </div>
</footer>
```

Note: keep the exact CSS classes and the existing `links` array iteration that the current `footer.html` uses. Only swap the textual strings shown.

- [ ] **Step 3: Build and test**

```bash
npm run build 2>&1 | tail -10
npx vitest run
```

Expected: build succeeds, tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/footer/footer.ts src/app/components/footer/footer.html
git commit -m "feat(footer): localize copy and add CV link"
```

---

## Task 14: SeoService — meta tags, title, JSON-LD injection

**Files:**
- Create: `src/app/seo/seo.types.ts`
- Create: `src/app/seo/seo.service.ts`
- Create: `src/app/seo/seo.service.spec.ts`
- Modify: `src/app/app.ts` (inject SeoService)

**Interfaces:**
- Produces: `SeoService` with `setMeta({ title, description })` and `setStructuredData(payload)` methods. Uses Angular `Meta` + `Title` + `Renderer2` to inject `<script type="application/ld+json">` into `<head>`.

- [ ] **Step 1: Write the failing test**

Create `src/app/seo/seo.service.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;

  beforeEach(() => {
    document.head.innerHTML = '';
    document.title = '';
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeoService);
  });

  it('setMeta updates title and description', () => {
    service.setMeta({ title: 'Hi', description: 'desc' });
    expect(document.title).toContain('Hi');
    expect(document.title).toContain('Patricio Manquepillan');
    const desc = document.head.querySelector('meta[name="description"]');
    expect(desc?.getAttribute('content')).toBe('desc');
  });

  it('setStructuredData injects a JSON-LD script', () => {
    service.setStructuredData({ '@context': 'https://schema.org', '@type': 'Person', name: 'X' });
    const script = document.head.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
    const json = JSON.parse(script!.textContent!);
    expect(json['@type']).toBe('Person');
    expect(json.name).toBe('X');
  });

  it('setStructuredData replaces a previous script of the same key', () => {
    service.setStructuredData({ '@context': 'https://schema.org', '@type': 'Person', name: 'A' }, 'person');
    service.setStructuredData({ '@context': 'https://schema.org', '@type': 'Person', name: 'B' }, 'person');
    const scripts = document.head.querySelectorAll('script[type="application/ld+json"][data-seo-key="person"]');
    expect(scripts.length).toBe(1);
    expect(JSON.parse(scripts[0].textContent!).name).toBe('B');
  });

  it('canonical link is set', () => {
    service.setCanonical('https://example.com/');
    const link = document.head.querySelector('link[rel="canonical"]');
    expect(link?.getAttribute('href')).toBe('https://example.com/');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/app/seo/seo.service.spec.ts
```

Expected: FAIL with "Cannot find module".

- [ ] **Step 3: Create the types file**

Create `src/app/seo/seo.types.ts`:

```typescript
export type JsonLd = Record<string, unknown>;

export interface MetaPayload {
  readonly title: string;
  readonly description: string;
  readonly ogImage?: string;
  readonly url?: string;
}
```

- [ ] **Step 4: Implement SeoService**

Create `src/app/seo/seo.service.ts`:

```typescript
import { DOCUMENT, Inject, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MetaPayload, JsonLd } from './seo.types';

const SITE_NAME = 'Patricio Manquepillan — Portafolio';
const DEFAULT_OG = 'https://patriciomanquepillan.com/og-default.png';
const DEFAULT_URL = 'https://patriciomanquepillan.com/';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  constructor(@Inject(DOCUMENT) private readonly doc: Document) {}

  setMeta(payload: MetaPayload): void {
    const fullTitle = `${payload.title} — ${SITE_NAME}`;
    this.title.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: payload.description });
    this.meta.updateTag({ name: 'author', content: 'Patricio Manquepillan' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large' });

    const ogImage = payload.ogImage ?? DEFAULT_OG;
    const url = payload.url ?? DEFAULT_URL;

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: payload.description });
    this.meta.updateTag({ property: 'og:image', content: ogImage });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:locale', content: 'es_CL' });
    this.meta.updateTag({ property: 'og:locale:alternate', content: 'en_US' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: payload.description });
    this.meta.updateTag({ name: 'twitter:image', content: ogImage });
  }

  setCanonical(url: string = DEFAULT_URL): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  setStructuredData(payload: JsonLd, key: string = 'default'): void {
    const selector = `script[type="application/ld+json"][data-seo-key="${key}"]`;
    const existing = this.doc.head.querySelector(selector);
    if (existing) existing.remove();

    const script = this.doc.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-seo-key', key);
    script.textContent = JSON.stringify(payload);
    this.doc.head.appendChild(script);
  }
}
```

Note: `inject()` is used for `Meta` and `Title` because it reads cleaner; `DOCUMENT` is constructor-injected because it requires the `@Inject` decorator.

- [ ] **Step 5: Run the test to verify it passes**

```bash
npx vitest run src/app/seo/seo.service.spec.ts
```

Expected: all 4 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app/seo/seo.types.ts src/app/seo/seo.service.ts src/app/seo/seo.service.spec.ts
git commit -m "feat(seo): add SeoService for meta + JSON-LD + canonical"
```

---

## Task 15: Wire SeoService to App with reactive meta on lang change

**Files:**
- Modify: `src/app/app.ts`

**Interfaces:**
- Consumes: `SeoService` (Task 14), `TranslationService` (Task 2).
- Produces: App injects both services. An `effect()` calls `seo.setMeta(...)` whenever the language signal changes.

- [ ] **Step 1: Update `app.ts` to inject SeoService and wire reactive meta**

Replace the contents of `src/app/app.ts` with:

```typescript
import { Component, effect, inject, signal } from '@angular/core';
import { About } from './components/about/about';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { ProjectDialog } from './components/project-dialog/project-dialog';
import { ProjectsSection } from './components/projects-section/projects-section';
import { PROJECTS } from './data/projects';
import { Project } from './models/project';
import { TranslationService } from './i18n/translation.service';
import { LangToggle } from './i18n/lang-toggle.component';
import { TranslationPipe } from './i18n/translation.pipe';
import { SeoService } from './seo/seo.service';

@Component({
  selector: 'app-root',
  imports: [
    Header,
    Hero,
    About,
    ProjectsSection,
    ProjectDialog,
    Footer,
    LangToggle,
    TranslationPipe,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly i18n = inject(TranslationService);
  private readonly seo = inject(SeoService);

  readonly projects = PROJECTS;
  readonly dialogProject = signal<Project | null>(null);

  constructor() {
    effect(() => {
      // re-run when language changes; translations JSON must be loaded first
      void this.i18n.setLang(this.i18n.lang()).then(() => {
        this.seo.setMeta({
          title: this.i18n.t('meta.title'),
          description: this.i18n.t('meta.description'),
        });
        this.seo.setCanonical('https://patriciomanquepillan.com/');
      });
    });
  }

  openDialog(project: Project): void {
    this.dialogProject.set(project);
  }

  closeDialog(): void {
    this.dialogProject.set(null);
  }
}
```

- [ ] **Step 2: Build and test**

```bash
npm run build 2>&1 | tail -10
npx vitest run
```

Expected: build succeeds, tests pass.

- [ ] **Step 3: Manual smoke test**

Run `npm start`, open `http://localhost:4200/`, open DevTools → Elements → inspect `<head>`. Expected:
- `<title>` contains "Portafolio — Patricio Manquepillan — Patricio Manquepillan — Portafolio" (the title set is composed of `meta.title + site name`; double-name is acceptable for Phase 1 and will be polished in a follow-up task).
- `<meta name="description">` reflects the Spanish description.

Click the EN toggle. Expected: title and description update.

- [ ] **Step 4: Commit**

```bash
git add src/app/app.ts
git commit -m "feat(app): reactively update SEO meta on language change"
```

---

## Task 16: JSON-LD schemas (Person, WebSite, CreativeWork, BreadcrumbList)

**Files:**
- Create: `src/app/seo/json-ld.builder.ts`
- Modify: `src/app/app.ts`

**Interfaces:**
- Produces: helper functions `buildPerson()`, `buildWebSite()`, `buildCreativeWork(project)`, `buildBreadcrumb()` that return `JsonLd` objects ready for `SeoService.setStructuredData()`.

- [ ] **Step 1: Create the JSON-LD builder**

Create `src/app/seo/json-ld.builder.ts`:

```typescript
import { Project, WorkProject } from '../models/project';
import { JsonLd } from './seo.types';

const SITE_URL = 'https://patriciomanquepillan.com';

export function buildPerson(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Patricio Manquepillan',
    jobTitle: 'Senior Frontend Developer',
    url: SITE_URL,
    email: 'mailto:patriciomanquepillantorres@gmail.com',
    sameAs: [
      'https://github.com/ptorresmanque',
      'https://www.linkedin.com/in/patriciomanquepillan',
    ],
    knowsAbout: [
      'Angular',
      'TypeScript',
      'SCADA',
      'WCAG',
      'Kubernetes',
      'Java',
      'Spring Boot',
    ],
  };
}

export function buildWebSite(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: SITE_URL,
    name: 'Patricio Manquepillan — Portafolio',
    inLanguage: ['es', 'en'],
    publisher: { '@type': 'Person', name: 'Patricio Manquepillan' },
  };
}

export function buildCreativeWork(project: Project): JsonLd {
  const base: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    author: { '@type': 'Person', name: 'Patricio Manquepillan' },
    about: project.shortDescription,
    keywords: project.technologies.join(', '),
    dateCreated: project.year,
    url: `${SITE_URL}/#${project.id}`,
  };
  if (project.kind === 'work') {
    const letter = (project as WorkProject).letter;
    if (letter) {
      base.review = {
        '@type': 'Review',
        author: { '@type': 'Person', name: letter.signer.name },
        reviewBody: letter.paragraphs.join('\n\n'),
        itemReviewed: { '@type': 'CreativeWork', name: project.title },
      };
    }
  }
  return base;
}

export function buildBreadcrumb(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: SITE_URL,
      },
    ],
  };
}
```

- [ ] **Step 2: Wire JSON-LD injection into App**

Edit `src/app/app.ts`. Add this import near the top:

```typescript
import { buildPerson, buildWebSite, buildCreativeWork, buildBreadcrumb } from './seo/json-ld.builder';
```

In the constructor `effect()` body, after `setCanonical(...)`, add:

```typescript
        this.seo.setStructuredData(buildPerson(), 'person');
        this.seo.setStructuredData(buildWebSite(), 'website');
        this.seo.setStructuredData(buildBreadcrumb(), 'breadcrumb');
        for (const project of PROJECTS) {
          this.seo.setStructuredData(buildCreativeWork(project), `project-${project.id}`);
        }
```

The final `effect()` body should be:

```typescript
    effect(() => {
      void this.i18n.setLang(this.i18n.lang()).then(() => {
        this.seo.setMeta({
          title: this.i18n.t('meta.title'),
          description: this.i18n.t('meta.description'),
        });
        this.seo.setCanonical('https://patriciomanquepillan.com/');
        this.seo.setStructuredData(buildPerson(), 'person');
        this.seo.setStructuredData(buildWebSite(), 'website');
        this.seo.setStructuredData(buildBreadcrumb(), 'breadcrumb');
        for (const project of PROJECTS) {
          this.seo.setStructuredData(buildCreativeWork(project), `project-${project.id}`);
        }
      });
    });
```

- [ ] **Step 3: Build and test**

```bash
npm run build 2>&1 | tail -10
npx vitest run
```

Expected: build succeeds, tests pass.

- [ ] **Step 4: Manual smoke test**

Run `npm start`, open DevTools → Elements → inspect `<head>`. Expected: 7 `<script type="application/ld+json">` tags with `data-seo-key` attributes (`person`, `website`, `breadcrumb`, `project-telemetria-2-0`, `project-backstops`, `project-comunidad-madrid`, `project-cualautocompro-cl`). Each must parse as valid JSON.

- [ ] **Step 5: Commit**

```bash
git add src/app/seo/json-ld.builder.ts src/app/app.ts
git commit -m "feat(seo): inject JSON-LD schemas (Person, WebSite, CreativeWork, Breadcrumb)"
```

---

## Task 17: Static SEO assets — sitemap.xml and robots.txt

**Files:**
- Create: `public/sitemap.xml`
- Create: `public/robots.txt`

- [ ] **Step 1: Create `public/sitemap.xml`**

Create `public/sitemap.xml` with this exact content:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://patriciomanquepillan.com/</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://patriciomanquepillan.com/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://patriciomanquepillan.com/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://patriciomanquepillan.com/" />
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://patriciomanquepillan.com/cv-es.pdf</loc>
    <changefreq>yearly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://patriciomanquepillan.com/cv-en.pdf</loc>
    <changefreq>yearly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

- [ ] **Step 2: Create `public/robots.txt`**

Create `public/robots.txt` with this exact content:

```
User-agent: *
Allow: /

Sitemap: https://patriciomanquepillan.com/sitemap.xml
```

- [ ] **Step 3: Update `public/_htaccess` to add XML content-type if not already present**

Open `public/_htaccess` and check if `AddType application/xml .xml` is already declared. If not, find the `<IfModule mod_mime.c>` block and add (or verify the line exists):

```
    AddType application/xml .xml
```

If the file already declares it, skip this step.

- [ ] **Step 4: Build to confirm assets are copied**

```bash
npm run build 2>&1 | tail -20
ls dist/portafolio/browser/sitemap.xml dist/portafolio/browser/robots.txt
```

Expected: both files exist in the build output.

- [ ] **Step 5: Commit**

```bash
git add public/sitemap.xml public/robots.txt public/_htaccess
git commit -m "feat(seo): add sitemap.xml and robots.txt"
```

---

## Task 18: OG image generator script

**Files:**
- Create: `scripts/generate-og.mjs`
- Modify: `package.json` (add `og` script)
- Create: `public/og-default.png` (generated by the script)

- [ ] **Step 1: Create the generator script**

Create `scripts/generate-og.mjs`:

```javascript
#!/usr/bin/env node
/**
 * Genera public/og-default.png (1200x630) para Open Graph / Twitter.
 * Diseño: fondo oscuro con acento azul + nombre + tagline + detalle.
 * Uso: npm run og
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT = resolve(ROOT, 'public/og-default.png');

const W = 1200;
const H = 630;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0A0A0B"/>
      <stop offset="100%" stop-color="#18181B"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.2" r="0.6">
      <stop offset="0%" stop-color="#2563EB" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#2563EB" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <g font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" fill="#FAFAFA">
    <text x="80" y="220" font-size="32" font-weight="500" fill="#71717A" letter-spacing="4">PORTAFOLIO</text>
    <text x="80" y="340" font-size="84" font-weight="700">Patricio Manquepillan</text>
    <text x="80" y="430" font-size="44" font-weight="500" fill="#2563EB">Senior Frontend Developer</text>
    <text x="80" y="520" font-size="28" font-weight="400" fill="#A1A1AA">Angular · TypeScript · WCAG AA · Remote</text>
  </g>

  <g transform="translate(80, 560)">
    <rect width="240" height="6" rx="3" fill="#2563EB"/>
  </g>
</svg>
`;

async function main() {
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toFile(OUT);
  console.log(`Wrote ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Add the npm script**

In `package.json`, under `"scripts"`, add (next to the existing `"favicon"` script):

```json
    "og": "node scripts/generate-og.mjs",
```

The resulting `"scripts"` section should look like:

```json
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "favicon": "node scripts/generate-favicon.mjs",
    "og": "node scripts/generate-og.mjs"
  },
```

- [ ] **Step 3: Run the generator**

```bash
npm run og
ls -la public/og-default.png
```

Expected: file exists, ~30-80 KB.

- [ ] **Step 4: Verify build copies the image**

```bash
npm run build 2>&1 | tail -5
ls -la dist/portafolio/browser/og-default.png
```

Expected: file exists in build output.

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-og.mjs package.json public/og-default.png
git commit -m "feat(seo): generate og-default.png (1200x630) with sharp"
```

---

## Task 19: Self-host fonts (subset WOFF2 + @font-face + preload)

**Files:**
- Create: `public/fonts/archivo-400.woff2`
- Create: `public/fonts/archivo-500.woff2`
- Create: `public/fonts/archivo-700.woff2`
- Create: `public/fonts/archivo-900.woff2`
- Create: `public/fonts/space-grotesk-400.woff2`
- Create: `public/fonts/space-grotesk-500.woff2`
- Modify: `src/styles.css` (add `@font-face`)
- Modify: `src/index.html` (drop Google Fonts `<link>`, add preload for Archivo 700)

- [ ] **Step 1: Install fonttools locally for subsetting**

Run:

```bash
npm install --no-save fonttools brotli
```

Expected: packages installed (locally; do not commit `package.json` changes).

- [ ] **Step 2: Download full Archivo + Space Grotesk WOFF2 from Google Fonts**

Run:

```bash
mkdir -p /tmp/fonts-src
curl -L -o /tmp/fonts-src/archivo.zip "https://fonts.google.com/download?family=Archivo" && \
  unzip -o /tmp/fonts-src/archivo.zip -d /tmp/fonts-src/archivo
curl -L -o /tmp/fonts-src/space.zip "https://fonts.google.com/download?family=Space%20Grotesk" && \
  unzip -o /tmp/fonts-src/space.zip -d /tmp/fonts-src/space
ls /tmp/fonts-src/archivo /tmp/fonts-src/space
```

Expected: both directories contain TTF files for various weights.

- [ ] **Step 3: Subset each weight to Latin Extended (covers es + en) and convert to WOFF2**

The subset must include Spanish glyphs (á, é, í, ó, ú, ñ, ¿, ¡, ü). Run a single command that subsets all weights:

```bash
mkdir -p public/fonts
UNICHARS="áéíóúñüÁÉÍÓÚÑÜ¿¡"
for pair in "archivo:Archivo" "space-grotesk:Space Grotesk"; do
  family="${pair%%:*}"
  display="${pair##*:}"
  for weight_file in /tmp/fonts-src/${family}/static/${display}/*.ttf; do
    fname=$(basename "$weight_file" .ttf)
    weight=$(echo "$fname" | grep -oE '[0-9]+' | head -1)
    echo "Subsetting $display $weight..."
    pyftsubset "$weight_file" \
      --unicodes="U+0000-00FF,${UNICHARS}" \
      --flavor=woff2 \
      --output-file="public/fonts/${family}-${weight}.woff2" \
      --no-hinting \
      --desubroutinize
  done
done
ls -la public/fonts/
```

Expected: 6 WOFF2 files, total size < 200 KB.

- [ ] **Step 4: Verify all files have Spanish glyphs**

```bash
for f in public/fonts/*.woff2; do
  size=$(stat -f%z "$f")
  echo "$f: ${size} bytes"
done
```

Expected: each file ~15-50 KB, total < 200 KB. If any file is < 5 KB, the subset may be broken — re-run with broader unicode range.

- [ ] **Step 5: Add `@font-face` declarations to `src/styles.css`**

Append (do not replace) at the very top of `src/styles.css`:

```css
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/archivo-400.woff2') format('woff2');
}
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/archivo-500.woff2') format('woff2');
}
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/archivo-700.woff2') format('woff2');
}
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url('/fonts/archivo-900.woff2') format('woff2');
}
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/space-grotesk-400.woff2') format('woff2');
}
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/space-grotesk-500.woff2') format('woff2');
}
```

- [ ] **Step 6: Drop Google Fonts `<link>` and add preload for Archivo 700 in `src/index.html`**

Replace `src/index.html` with:

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#2563EB">

  <title>Portafolio — Patricio Manquepillan</title>

  <link rel="preload" href="fonts/archivo-700.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="fonts/space-grotesk-400.woff2" as="font" type="font/woff2" crossorigin>

  <link rel="icon" href="favicon.ico" sizes="any">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="icon" type="image/png" sizes="96x96" href="favicon-96x96.png">
  <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
  <link rel="manifest" href="site.webmanifest">

  <link rel="alternate" hreflang="es" href="https://patriciomanquepillan.com/">
  <link rel="alternate" hreflang="en" href="https://patriciomanquepillan.com/">
  <link rel="alternate" hreflang="x-default" href="https://patriciomanquepillan.com/">

  <link rel="preconnect" href="https://images.unsplash.com">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

Note: `SeoService` will set `<meta name="description">` at runtime. Title and meta tags are managed reactively.

- [ ] **Step 7: Build and verify fonts are copied**

```bash
npm run build 2>&1 | tail -10
ls dist/portafolio/browser/fonts/
```

Expected: 6 WOFF2 files in build output.

- [ ] **Step 8: Verify no Google Fonts requests remain**

Run:

```bash
grep -r "fonts.googleapis" dist/portafolio/browser/ || echo "OK: no Google Fonts references"
```

Expected: `OK: no Google Fonts references`.

- [ ] **Step 9: Commit**

```bash
git add public/fonts/ src/styles.css src/index.html
git commit -m "perf(fonts): self-host Archivo + Space Grotesk subsets (no Google Fonts CDN)"
```

---

## Task 20: A11y polish — focus restoration in dialog (already wired) + skip link verified

**Files:**
- Modify: `src/app/components/project-dialog/project-dialog.ts` (verify previouslyFocused logic from Task 12)
- Modify: `src/app/components/project-dialog/project-dialog.html` (verify close button uses `handleClose()`)

Note: Tasks 5 and 12 already implemented skip link and focus restoration. This task verifies the behavior and adds a smoke test.

- [ ] **Step 1: Verify skip link is the first focusable element**

In `src/app/app.html`, confirm the skip link is the very first child of `<body>`. If it is, the browser will focus it first on Tab from the URL bar.

Expected: skip link exists and is the first focusable element.

- [ ] **Step 2: Verify focus restoration logic**

In `src/app/components/project-dialog/project-dialog.ts`, confirm `previouslyFocused` is saved on open and restored on close. The code in Task 12 already does this.

- [ ] **Step 3: Add a smoke test for the dialog focus trap**

Create `src/app/components/project-dialog/project-dialog.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { ComponentRef } from '@angular/core';
import { ProjectDialog } from './project-dialog';
import { PROJECTS } from '../../data/projects';

describe('ProjectDialog', () => {
  let componentRef: ComponentRef<ProjectDialog>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ProjectDialog] });
    const fixture = TestBed.createComponent(ProjectDialog);
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('creates without crashing', () => {
    expect(componentRef.instance).toBeTruthy();
  });

  it('exposes letter only for work projects', () => {
    componentRef.setInput('project', PROJECTS[0]);
    expect(componentRef.instance.letter()).not.toBeNull();
  });

  it('returns null letter for personal projects', () => {
    const personal = PROJECTS.find((p) => p.kind === 'personal')!;
    componentRef.setInput('project', personal);
    expect(componentRef.instance.letter()).toBeNull();
  });

  it('closeDialog output fires on handleClose', () => {
    let fired = false;
    componentRef.instance.closeDialog.subscribe(() => (fired = true));
    componentRef.instance.handleClose();
    expect(fired).toBe(true);
  });
});
```

- [ ] **Step 4: Run the test**

```bash
npx vitest run src/app/components/project-dialog/project-dialog.spec.ts
```

Expected: all 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/project-dialog/project-dialog.spec.ts
git commit -m "test(dialog): cover letter + output smoke test"
```

---

## Task 21: Final verification — build, audit, smoke tests

**Files:**
- (no code changes; verification only)

- [ ] **Step 1: Clean build**

```bash
rm -rf dist
npm run build 2>&1 | tail -30
```

Expected: build succeeds with no errors. Bundle size should be reasonable (initial < 500 KB warning, < 1 MB error per the existing budget).

- [ ] **Step 2: Verify all i18n keys render in the dev server**

Run:

```bash
npm start &
sleep 8
curl -s http://localhost:4200/ | grep -oE '(Saltar al contenido|Skip to content)' | head -1
curl -s http://localhost:4200/i18n/es.json | head -c 100
echo ""
curl -s http://localhost:4200/i18n/en.json | head -c 100
```

Expected: skip link text appears, both JSON files are served.

- [ ] **Step 3: Verify sitemap and robots are served**

```bash
curl -s http://localhost:4200/sitemap.xml | head -20
curl -s http://localhost:4200/robots.txt
```

Expected: sitemap contains `<loc>https://patriciomanquepillan.com/</loc>`; robots contains the sitemap URL.

- [ ] **Step 4: Verify OG image is served**

```bash
curl -sI http://localhost:4200/og-default.png | head -5
```

Expected: `HTTP/1.1 200 OK`, `Content-Type: image/png`.

- [ ] **Step 5: Verify fonts are served**

```bash
for f in archivo-400 archivo-500 archivo-700 archivo-900 space-grotesk-400 space-grotesk-500; do
  curl -sI "http://localhost:4200/fonts/${f}.woff2" | head -1
done
```

Expected: 6 lines of `HTTP/1.1 200 OK`.

- [ ] **Step 6: Run all tests one final time**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 7: Stop the dev server**

```bash
pkill -f "ng serve" || true
```

- [ ] **Step 8: Manual Lighthouse audit (optional, requires Chrome)**

If Chrome is installed locally:

```bash
npm run build
npx http-server dist/portafolio/browser -p 8080 &
sleep 3
npx lighthouse http://localhost:8080/ --only-categories=performance,accessibility,seo,best-practices --output=json --quiet 2>/dev/null | python3 -c "import sys,json;d=json.load(sys.stdin);print({k:d['categories'][k]['score'] for k in d['categories']})"
```

Expected (approximate):
- Performance: ≥ 85
- Accessibility: ≥ 95
- SEO: 100
- Best Practices: ≥ 95

If any score is below target, note it for Phase 4 polish — do not block Phase 1 completion.

- [ ] **Step 9: Final commit (no changes, just verifying clean tree)**

```bash
git status
```

Expected: clean working tree (everything committed).

If there are uncommitted changes, commit them now with a descriptive message.

---

## Self-Review

**Spec coverage (Phase 1 items from spec section 12):**
- ✅ 1. `TranslationService` + `TranslationPipe` + `LangToggle` + JSON ES/EN → Tasks 1-4
- ✅ 2. `SeoService` with meta + JSON-LD → Tasks 14-16
- ✅ 3. `sitemap.xml` + `robots.txt` en `public/` → Task 17
- ✅ 4. OG image default generado con sharp → Task 18
- ✅ 5. Self-host fuentes (subset WOFF2) → Task 19
- ✅ 6. Refinar copy (credenciales + "ahora" en About + highlights en cards) → Tasks 7, 8, 11
- ✅ 7. Skip link + accesibilidad modal (`<dialog>`) → Tasks 5, 12, 20

**Coverage gaps:** None for Phase 1. Phase 2-4 (SSG/prerender, image optimization, _htaccess tuning, CV component, Puppeteer script, Plausible analytics, entry animations, full audits) are explicitly out of scope for this plan and will be follow-up plans.

**Placeholder scan:** No "TBD", "TODO", "implement later", "fill in details" in any step. All code blocks are complete and runnable. Class lists like `class="..."` only appear in copy-paste instructions where the engineer is told to keep existing CSS verbatim from the current file.

**Type consistency check:**
- `Lang` type defined in Task 2 and reused in Tasks 4 and 13. ✓
- `TranslationService.t(key, params?)` signature used in Tasks 3, 12, 13, 15. ✓
- `SeoService.setMeta`, `setStructuredData`, `setCanonical` defined in Task 14 and used in Task 15-16. ✓
- `JsonLd` type defined in Task 14 and reused in Task 16. ✓
- `MetaPayload` type defined in Task 14 and used in Task 15. ✓
- `project().highlights` is optional (`readonly highlights?: readonly string[]`) and guarded with `@if` in templates (Tasks 10, 12). ✓

**Risk notes (carry forward to future plans):**
- Title duplication: Task 15 currently produces `${meta.title} — ${SITE_NAME}` where `meta.title` already includes "Patricio Manquepillan". Phase 4 polish should split this so the title is just the role/page name + site name.
- Hero CV link hardcoded to `/cv-es.pdf`: Phase 3 will compute `cv-{lang}.pdf` reactively.
- No SSG yet: Phase 2 will add `@angular/ssr` prerender so the hydrated HTML matches the SEO meta set by `SeoService`.

**Files modified or created summary:**
- 8 new files in `src/app/i18n/`, `src/app/seo/`
- 2 new JSON dictionaries
- 7 component template updates (header, hero, about, projects-section, project-card, project-dialog, footer)
- 2 model/data updates
- 2 static SEO assets (sitemap, robots)
- 6 font files + styles.css update
- 1 generator script (og)
- 1 generated asset (og-default.png)

---

## End of Phase 1 Plan

After this plan ships:
- Phase 2 plan: SSG with `@angular/ssr` (prerender), image optimization (AVIF/WebP), `_htaccess` caching/brotli tuning
- Phase 3 plan: CV component + Puppeteer generation + Plausible analytics
- Phase 4 plan: IntersectionObserver entry animations, full Lighthouse + axe audit pass, hreflang verification in Search Console