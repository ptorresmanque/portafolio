# CV Harvard Format Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate two single-page A4 CVs in Harvard format (Spanish + English) as PDFs at `/cv-es.pdf` and `/cv-en.pdf`, sourced from an Angular component and rendered by Puppeteer, so the existing "Descargar CV" buttons in the portfolio work.

**Architecture:** A standalone Angular component (`CvComponent`) renders the CV from a TypeScript data file (`cv.data.ts`). Two Angular Router routes (`/es/cv` and `/en/cv`) host the component. A post-build Node script (`generate-cv.mjs`) starts a static server over `dist/portafolio/browser/`, uses Puppeteer to navigate to each route, and prints A4 PDFs into the build output.

**Tech Stack:** Angular 22 (standalone components, signals, `@if`), Angular Router, TypeScript, Vitest, Tailwind CSS v4 (no utility classes used in CV — plain CSS), Puppeteer (with bundled Chromium), Node 20+ ESM.

## Global Constraints

- Angular 22 standalone component style (no NgModules); `ChangeDetectionStrategy.OnPush`.
- Vitest for tests; use `ng test --watch=false` to run once.
- Tipografía `Archivo` ya self-hosteada en `public/fonts/`, subset Latin; usarla en el CV.
- No usar frameworks de UI en el CV (solo CSS plano).
- Tamaño objetivo del CV: 1 página A4 (210mm × 297mm) por idioma.
- Los PDFs se generan en `dist/portafolio/browser/` (no se commitean; ya cubierto por `.gitignore`).
- Sin foto, sin ubicación, sin dirección postal — solo email, teléfono, LinkedIn, GitHub, sitio.
- Commits en español siguiendo convención del repo (`feat:`, `chore:`, `test:`, `docs:`, `fix:`).
- Branch: continuar en `main` salvo que el usuario pida otra cosa.

---

## File Structure

| Archivo | Tipo | Responsabilidad |
|---|---|---|
| `src/app/cv/data/cv.types.ts` | Crear | Tipos compartidos del CV |
| `src/app/cv/data/cv.data.ts` | Crear | Fuente de verdad: contenido ES + EN |
| `src/app/cv/data/cv.data.spec.ts` | Crear | Tests de integridad de datos |
| `src/app/cv/cv.component.ts` | Crear | Componente standalone que lee `cv.data.ts` |
| `src/app/cv/cv.component.html` | Crear | Template del CV (1 columna, header → resumen → experiencia → educación → skills → idiomas → refs) |
| `src/app/cv/cv.component.css` | Crear | Estilos A4 + tipografía Archivo |
| `src/app/cv/cv.routes.ts` | Crear | Lazy routes para `/es/cv` y `/en/cv` |
| `src/app/cv/cv.component.spec.ts` | Crear | Tests del componente (render ES/EN, secciones presentes) |
| `src/app/app.config.ts` | Modificar | Proveer `provideRouter` con rutas CV |
| `src/app/app.routes.ts` | Crear | Rutas de la app (lazy root + CV) |
| `src/app/app.ts` | Modificar | Usar `RouterOutlet` en lugar de render fijo |
| `src/app/app.html` | Modificar | Envolver contenido existente en `<router-outlet>` con layout shell |
| `package.json` | Modificar | Scripts `cv`, `build:full`; dep `puppeteer` |
| `scripts/generate-cv.mjs` | Crear | Lanza servidor estático, navega con Puppeteer, imprime PDFs |
| `README.md` | Modificar | Documentar scripts nuevos |

---

## Task 1: Crear la capa de datos del CV

**Files:**
- Create: `src/app/cv/data/cv.types.ts`
- Create: `src/app/cv/data/cv.data.ts`
- Create: `src/app/cv/data/cv.data.spec.ts`

**Interfaces:**
- Consumes: nada
- Produces: tipos `CvData`, `CvContact`, `CvExperience`, `CvEducation`, `CvSkillsBlock`, `CvLanguage`; constante `CV: Record<'es' | 'en', CvData>`.

- [ ] **Step 1: Crear tipos del CV**

Crear `src/app/cv/data/cv.types.ts`:

```typescript
export interface CvContact {
  readonly label: string;
  readonly value: string;
  readonly href: string;
}

export interface CvExperience {
  readonly company: string;
  readonly role: string;
  readonly period: string;
  readonly bullets: readonly string[];
  readonly stack?: readonly string[];
}

export interface CvEducation {
  readonly degree: string;
  readonly note?: string;
}

export interface CvSkillsBlock {
  readonly category: string;
  readonly items: readonly string[];
}

export interface CvLanguage {
  readonly name: string;
  readonly level: string;
}

export interface CvData {
  readonly header: {
    readonly name: string;
    readonly contact: readonly CvContact[];
  };
  readonly summary: string;
  readonly experience: readonly CvExperience[];
  readonly education: readonly CvEducation[];
  readonly skills: readonly CvSkillsBlock[];
  readonly languages: readonly CvLanguage[];
  readonly referencesNote: string;
}
```

- [ ] **Step 2: Crear spec de integridad de datos (test que falla)**

Crear `src/app/cv/data/cv.data.spec.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { CV } from './cv.data';

describe('CV data integrity', () => {
  it.each(['es', 'en'] as const)('has 4 experience entries in %s', (lang) => {
    expect(CV[lang].experience).toHaveLength(4);
  });

  it.each(['es', 'en'] as const)('every experience has company, role, period, and ≥1 bullet in %s', (lang) => {
    for (const exp of CV[lang].experience) {
      expect(exp.company).not.toBe('');
      expect(exp.role).not.toBe('');
      expect(exp.period).not.toBe('');
      expect(exp.bullets.length).toBeGreaterThanOrEqual(1);
    }
  });

  it.each(['es', 'en'] as const)('has 4 skills categories in %s', (lang) => {
    expect(CV[lang].skills).toHaveLength(4);
    for (const block of CV[lang].skills) {
      expect(block.items.length).toBeGreaterThanOrEqual(2);
    }
  });

  it.each(['es', 'en'] as const)('has 2 languages in %s', (lang) => {
    expect(CV[lang].languages).toHaveLength(2);
  });

  it.each(['es', 'en'] as const)('has header with name and ≥5 contact items in %s', (lang) => {
    expect(CV[lang].header.name).not.toBe('');
    expect(CV[lang].header.contact.length).toBeGreaterThanOrEqual(5);
  });

  it('shared structural parity between ES and EN', () => {
    expect(CV.es.experience.length).toBe(CV.en.experience.length);
    expect(CV.es.skills.length).toBe(CV.en.skills.length);
    expect(CV.es.languages.length).toBe(CV.en.languages.length);
    expect(CV.es.education.length).toBe(CV.en.education.length);
  });

  it('i18n content does not leak across languages', () => {
    expect(CV.es.summary).not.toBe(CV.en.summary);
    expect(CV.es.referencesNote).not.toBe(CV.en.referencesNote);
    expect(CV.es.experience[0].company).not.toBe(CV.en.experience[0].company);
  });
});
```

- [ ] **Step 3: Ejecutar spec para confirmar que falla**

Run: `ng test --watch=false`
Expected: FAIL con `Cannot find module './cv.data'` (porque aún no existe).

- [ ] **Step 4: Crear datos del CV**

Crear `src/app/cv/data/cv.data.ts`:

```typescript
import type { CvData } from './cv.types';

const HEADER = {
  name: 'Patricio Emanuel Manquepillan Torres',
  contact: [
    {
      label: 'Email',
      value: 'patriciomanquepillantorres@gmail.com',
      href: 'mailto:patriciomanquepillantorres@gmail.com',
    },
    {
      label: 'Teléfono',
      value: '+56 962575863',
      href: 'tel:+56962575863',
    },
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/patricio-manquepillan-torres',
      href: 'https://www.linkedin.com/in/patricio-manquepillan-torres',
    },
    {
      label: 'GitHub',
      value: 'github.com/ptorresmanque',
      href: 'https://github.com/ptorresmanque',
    },
    {
      label: 'Web',
      value: 'cualautocompro.cl',
      href: 'https://cualautocompro.cl',
    },
  ],
};

const EXPERIENCE_ES: CvData['experience'] = [
  {
    company: 'Comunidad de Madrid',
    role: 'Frontend developer',
    period: '2025 — actualidad',
    bullets: [
      'Frontend en un equipo de 12 personas en el portal institucional con 2M visitas/mes.',
      'Construí una librería accesible (combobox, modal con focus trap, navegación por teclado) que se convirtió en estándar interno para los siguientes portales del gobierno regional.',
      'Optimicé SSR con Angular Universal hasta TTFB < 200 ms en los 200 trámites más consultados.',
    ],
    stack: ['Angular', 'micro front ends', 'Capacitor', 'TypeScript', 'PostgreSQL', 'Jenkins'],
  },
  {
    company: 'Banco Santander España (vía NTT Data)',
    role: 'Fullstack developer',
    period: 'abr 2022 — abr 2025',
    bullets: [
      'Sistema automatizado de backstops crediticios con motor de reglas configurable, scoring e integración con sistemas internos, dentro de iniciativa conjunta del banco con la Unión Europea.',
      'Evolucioné de frontend Angular a gestionar y desplegar microservicios backend en Java + Spring Boot sobre Kubernetes con escalado automático y despliegues sin downtime.',
    ],
    stack: ['Angular', 'Java', 'Spring Boot', 'Kubernetes'],
  },
  {
    company: 'Aguas Nuevas S.A.',
    role: 'Frontend / SCADA Developer / DBA',
    period: '2019 — 2022',
    bullets: [
      'Unifiqué la telemetría y los SCADA de las 4 empresas del grupo (Aguas Altiplano, Chañar, Araucanía, Magallanes) en una sola plataforma.',
      'Migré más de 50 plantas al nuevo SCADA sobre AVEVA System Platform, incluida la desalinizadora por ósmosis inversa de Iquique.',
      'Construí la app web de visualización con Angular + Spring Boot y entrené a operarios en su uso.',
    ],
    stack: ['AVEVA System Platform', 'Oracle SQL', 'Angular', 'Spring Boot', 'Python', 'Highcharts'],
  },
  {
    company: 'cualautocompro.cl (proyecto personal)',
    role: 'Owner',
    period: '2026',
    bullets: [
      'Catálogo del mercado automotriz chileno con búsqueda, comparación y sharing de comparativas.',
      'Diseño y construyo el ciclo completo: scraping, modelo de datos en Prisma, backend Express, frontend Angular 22.',
    ],
    stack: ['Angular 22', 'Angular Material', 'Express', 'Prisma', 'MySQL', 'Tailwind CSS', 'Playwright'],
  },
];

const EXPERIENCE_EN: CvData['experience'] = [
  {
    company: 'Comunidad de Madrid',
    role: 'Frontend developer',
    period: '2025 — present',
    bullets: [
      'Frontend on a 12-person team for the institutional portal serving 2M visits/month.',
      'Built an accessible component library (combobox, modal with focus trap, keyboard navigation for long lists) that became the internal standard for the regional government\'s next portals.',
      'Optimised SSR with Angular Universal down to TTFB < 200 ms across the 200 most-consulted procedures.',
    ],
    stack: ['Angular', 'micro frontends', 'Capacitor', 'TypeScript', 'PostgreSQL', 'Jenkins'],
  },
  {
    company: 'Banco Santander España (via NTT Data)',
    role: 'Fullstack developer',
    period: 'Apr 2022 — Apr 2025',
    bullets: [
      'Automated credit-backstop management system with a configurable rules engine, transaction scoring, and integration with the bank\'s internal systems, within a joint bank–European Union initiative.',
      'Grew from Angular frontend to owning and deploying backend microservices in Java + Spring Boot on Kubernetes, with autoscaling and zero-downtime deployments.',
    ],
    stack: ['Angular', 'Java', 'Spring Boot', 'Kubernetes'],
  },
  {
    company: 'Aguas Nuevas S.A.',
    role: 'Frontend / SCADA Developer / DBA',
    period: '2019 — 2022',
    bullets: [
      'Unified telemetry and SCADA systems of the 4 companies in the group (Aguas Altiplano, Chañar, Araucanía, Magallanes) into a single platform.',
      'Migrated 50+ plants to the new SCADA on AVEVA System Platform, including the Iquique reverse-osmosis desalination plant.',
      'Built the visualisation web app with Angular + Spring Boot and trained operators in its use.',
    ],
    stack: ['AVEVA System Platform', 'Oracle SQL', 'Angular', 'Spring Boot', 'Python', 'Highcharts'],
  },
  {
    company: 'cualautocompro.cl (personal project)',
    role: 'Owner',
    period: '2026',
    bullets: [
      'Catalog of the Chilean auto market with browsing, searching, and sharing of user-built comparisons.',
      'Design and build the full cycle: scraping layer, data model in Prisma, Express backend, Angular 22 frontend.',
    ],
    stack: ['Angular 22', 'Angular Material', 'Express', 'Prisma', 'MySQL', 'Tailwind CSS', 'Playwright'],
  },
];

const SKILLS_ES: CvData['skills'] = [
  {
    category: 'Frontend',
    items: ['Angular', 'TypeScript', 'RxJS', 'Tailwind CSS', 'Accesibilidad WCAG AA'],
  },
  {
    category: 'Backend',
    items: ['Java', 'Spring Boot', 'Node.js', 'Express', 'REST'],
  },
  {
    category: 'Datos e infra',
    items: ['Kubernetes', 'Oracle SQL', 'MySQL', 'Prisma', 'Docker'],
  },
  {
    category: 'Prácticas',
    items: ['SSR (Angular Universal)', 'SCADA (AVEVA System Platform)', 'Accesibilidad con NVDA / VoiceOver', 'Git', 'SDLC'],
  },
];

const SKILLS_EN: CvData['skills'] = [
  {
    category: 'Frontend',
    items: ['Angular', 'TypeScript', 'RxJS', 'Tailwind CSS', 'WCAG AA accessibility'],
  },
  {
    category: 'Backend',
    items: ['Java', 'Spring Boot', 'Node.js', 'Express', 'REST'],
  },
  {
    category: 'Data & infra',
    items: ['Kubernetes', 'Oracle SQL', 'MySQL', 'Prisma', 'Docker'],
  },
  {
    category: 'Practices',
    items: ['SSR (Angular Universal)', 'SCADA (AVEVA System Platform)', 'Accessibility testing with NVDA / VoiceOver', 'Git', 'SDLC'],
  },
];

const LANGUAGES: CvData['languages'] = [
  { name: 'Español', level: 'Nativo' },
  { name: 'Inglés', level: 'B2 (MCER)' },
];

export const CV: Record<'es' | 'en', CvData> = {
  es: {
    header: HEADER,
    summary:
      'Senior Frontend Developer con +6 años en producción. Angular lead con foco en accesibilidad WCAG AA y sistemas con cientos de miles de usuarios. Cuando hace falta, se mete en backend sin drama.',
    experience: EXPERIENCE_ES,
    education: [
      {
        degree: 'Formación técnica en ingeniería informática',
        note: 'Estudios parciales',
      },
    ],
    skills: SKILLS_ES,
    languages: LANGUAGES,
    referencesNote: 'Referencias disponibles bajo petición',
  },
  en: {
    header: HEADER,
    summary:
      'Senior Frontend Developer with 6+ years in production. Angular lead focused on WCAG AA accessibility and products used by hundreds of thousands of people. When needed, I jump into backend without drama.',
    experience: EXPERIENCE_EN,
    education: [
      {
        degree: 'Technical education in computer engineering',
        note: 'Incomplete studies',
      },
    ],
    skills: SKILLS_EN,
    languages: LANGUAGES,
    referencesNote: 'References available upon request',
  },
};
```

- [ ] **Step 5: Ejecutar spec para confirmar que pasa**

Run: `ng test --watch=false`
Expected: PASS (todos los tests de `cv.data.spec.ts`).

- [ ] **Step 6: Commit**

```bash
git add src/app/cv/data/
git commit -m "feat(cv): add CV data layer with ES + EN source of truth"
```

---

## Task 2: Crear el componente CvComponent (template, estilos y tests)

**Files:**
- Create: `src/app/cv/cv.component.ts`
- Create: `src/app/cv/cv.component.html`
- Create: `src/app/cv/cv.component.css`
- Create: `src/app/cv/cv.component.spec.ts`

**Interfaces:**
- Consumes: `CV` y tipos de `cv.data` (Task 1)
- Produces: componente standalone `CvComponent` con input `lang: 'es' | 'en'` que renderiza header, contacto, resumen, experiencia, educación, skills, idiomas y referencias.

- [ ] **Step 1: Crear spec del componente (test que falla)**

Crear `src/app/cv/cv.component.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { CvComponent } from './cv.component';
import { CV } from './data/cv.data';

function setup(lang: 'es' | 'en') {
  TestBed.configureTestingModule({
    imports: [CvComponent],
  });
  const fixture = TestBed.createComponent(CvComponent);
  fixture.componentRef.setInput('lang', lang);
  fixture.detectChanges();
  return fixture;
}

describe('CvComponent', () => {
  it('renders the name from CV data in ES', () => {
    const fixture = setup('es');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain(CV.es.header.name);
  });

  it('renders the name from CV data in EN', () => {
    const fixture = setup('en');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain(CV.en.header.name);
  });

  it('renders summary section in ES', () => {
    const fixture = setup('es');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain(CV.es.summary.split('.')[0]);
  });

  it('renders all 4 experiences in EN', () => {
    const fixture = setup('en');
    const el = fixture.nativeElement as HTMLElement;
    for (const exp of CV.en.experience) {
      expect(el.textContent).toContain(exp.company);
    }
  });

  it('renders all 4 skills categories in ES', () => {
    const fixture = setup('es');
    const el = fixture.nativeElement as HTMLElement;
    for (const block of CV.es.skills) {
      expect(el.textContent).toContain(block.category);
    }
  });

  it('renders 2 languages', () => {
    const fixture = setup('es');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Español');
    expect(el.textContent).toContain('Inglés');
  });

  it('renders references note', () => {
    const fixture = setup('es');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Referencias disponibles bajo petición');
  });

  it('contains anchor links for contact (mailto/tel/https)', () => {
    const fixture = setup('es');
    const el = fixture.nativeElement as HTMLElement;
    const mailto = el.querySelector('a[href^="mailto:"]');
    const tel = el.querySelector('a[href^="tel:"]');
    const https = el.querySelector('a[href^="https://www.linkedin.com"]');
    expect(mailto).not.toBeNull();
    expect(tel).not.toBeNull();
    expect(https).not.toBeNull();
  });

  it('does not leak EN content in ES view', () => {
    const fixture = setup('es');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).not.toContain('Frontier'); // improbable ES false positive
    expect(el.textContent).not.toContain('Apr 2022'); // fecha solo en EN
  });
});
```

- [ ] **Step 2: Ejecutar spec para confirmar que falla**

Run: `ng test --watch=false`
Expected: FAIL con `Can't resolve all parameters for CvComponent` (componente no existe).

- [ ] **Step 3: Crear el componente**

Crear `src/app/cv/cv.component.ts`:

```typescript
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CV } from './data/cv.data';

@Component({
  selector: 'app-cv',
  standalone: true,
  templateUrl: './cv.component.html',
  styleUrl: './cv.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvComponent {
  readonly lang = input.required<'es' | 'en'>();
  protected readonly data = computed(() => CV[this.lang()]);
}
```

- [ ] **Step 4: Crear el template**

Crear `src/app/cv/cv.component.html`:

```html
@let d = data();

<header class="header">
  <h1 class="name">{{ d.header.name }}</h1>
  <div class="accent-line"></div>
  <ul class="contact-line" aria-label="Datos de contacto">
    @for (item of d.header.contact; track item.href) {
      <li>
        <a [href]="item.href">{{ item.value }}</a>
      </li>
    }
  </ul>
</header>

<section class="section">
  <h2 class="section-title">{{ lang() === 'es' ? 'Resumen' : 'Summary' }}</h2>
  <p class="summary">{{ d.summary }}</p>
</section>

<section class="section">
  <h2 class="section-title">{{ lang() === 'es' ? 'Experiencia profesional' : 'Professional experience' }}</h2>
  @for (exp of d.experience; track exp.company + exp.period) {
    <article class="experience-row">
      <div class="experience-meta">
        <div class="experience-company">{{ exp.company }}</div>
        <div class="experience-period">{{ exp.period }}</div>
      </div>
      <div class="experience-body">
        <div class="experience-role">{{ exp.role }}</div>
        <ul class="experience-bullets">
          @for (bullet of exp.bullets; track bullet) {
            <li>{{ bullet }}</li>
          }
        </ul>
        @if (exp.stack && exp.stack.length > 0) {
          <div class="experience-stack"><strong>Stack:</strong> {{ exp.stack?.join(' · ') }}</div>
        }
      </div>
    </article>
  }
</section>

<section class="section">
  <h2 class="section-title">{{ lang() === 'es' ? 'Educación' : 'Education' }}</h2>
  <ul class="education-list">
    @for (edu of d.education; track edu.degree) {
      <li>
        {{ edu.degree }}@if (edu.note) { <span class="education-note"> — {{ edu.note }}</span> }
      </li>
    }
  </ul>
</section>

<section class="section">
  <h2 class="section-title">{{ lang() === 'es' ? 'Habilidades técnicas' : 'Technical skills' }}</h2>
  @for (block of d.skills; track block.category) {
    <div class="skill-block">
      <span class="skill-category">{{ block.category }}:</span>
      {{ block.items.join(' · ') }}
    </div>
  }
</section>

<section class="section">
  <h2 class="section-title">{{ lang() === 'es' ? 'Idiomas' : 'Languages' }}</h2>
  <ul class="languages-list">
    @for (langItem of d.languages; track langItem.name) {
      <li>{{ langItem.name }} — {{ langItem.level }}</li>
    }
  </ul>
</section>

<footer class="refs-note">{{ d.referencesNote }}</footer>
```

- [ ] **Step 5: Crear los estilos print-friendly**

Crear `src/app/cv/cv.component.css`:

```css
@page {
  size: A4 portrait;
  margin: 0;
}

:host {
  display: block;
  width: 210mm;
  min-height: 297mm;
  padding: 12mm;
  box-sizing: border-box;
  font-family: 'Archivo', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  color: #0a0a0a;
  background: #ffffff;
  font-size: 9.5pt;
  line-height: 1.4;
}

.header {
  margin-bottom: 4mm;
}

.name {
  margin: 0;
  font-size: 22pt;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.1;
}

.accent-line {
  height: 1.5pt;
  background: #1f2937;
  margin: 2mm 0 3mm;
}

.contact-line {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 4mm;
  font-size: 8.5pt;
  color: #4b5563;
}

.contact-line li {
  display: inline;
}

.contact-line a {
  color: inherit;
  text-decoration: none;
}

.contact-line a:hover {
  text-decoration: underline;
}

.section {
  margin-top: 4mm;
}

.section-title {
  font-size: 10.5pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 1.5mm;
  border-bottom: 0.5pt solid #d1d5db;
  padding-bottom: 0.8mm;
}

.summary {
  margin: 0;
  font-size: 9.5pt;
}

.experience-row {
  display: grid;
  grid-template-columns: 48mm 1fr;
  gap: 4mm;
  margin-bottom: 2.5mm;
  page-break-inside: avoid;
}

.experience-meta {
  font-size: 8.5pt;
  color: #4b5563;
}

.experience-company {
  font-weight: 600;
  color: #111827;
}

.experience-period {
  color: #6b7280;
}

.experience-role {
  font-weight: 600;
  margin-bottom: 0.8mm;
}

.experience-bullets {
  margin: 0;
  padding-left: 4mm;
  font-size: 9pt;
}

.experience-bullets li {
  margin-bottom: 0.5mm;
}

.experience-stack {
  margin-top: 0.8mm;
  font-size: 8.5pt;
  color: #4b5563;
}

.education-list,
.languages-list {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 9.5pt;
}

.education-note {
  color: #6b7280;
}

.skill-block {
  margin-bottom: 1mm;
  font-size: 9pt;
}

.skill-category {
  font-weight: 600;
}

.refs-note {
  margin-top: 4mm;
  text-align: center;
  font-size: 8.5pt;
  color: #6b7280;
}
```

- [ ] **Step 6: Ejecutar spec para confirmar que pasa**

Run: `ng test --watch=false`
Expected: PASS (todos los tests de `cv.component.spec.ts` y `cv.data.spec.ts`).

- [ ] **Step 7: Commit**

```bash
git add src/app/cv/cv.component.ts src/app/cv/cv.component.html src/app/cv/cv.component.css src/app/cv/cv.component.spec.ts
git commit -m "feat(cv): add standalone CvComponent with template, styles, and tests"
```

---

## Task 3: Wire CV routes en Angular Router

**Files:**
- Create: `src/app/app.routes.ts`
- Create: `src/app/cv/cv.routes.ts`
- Modify: `src/app/app.config.ts`
- Modify: `src/app/app.ts`
- Modify: `src/app/app.html`

**Interfaces:**
- Consumes: `CvComponent` (Task 2)
- Produces: rutas `/es/cv` y `/en/cv` activas con la app actual en la ruta raíz.

- [ ] **Step 1: Crear archivo de rutas de la app**

Crear `src/app/app.routes.ts`:

```typescript
import type { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: ':lang/cv',
    loadChildren: () => import('./cv/cv.routes').then((m) => m.CV_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
```

- [ ] **Step 2: Crear archivo de rutas del CV**

Crear `src/app/cv/cv.routes.ts`:

```typescript
import type { Routes } from '@angular/router';
import { CvComponent } from './cv.component';

export const CV_ROUTES: Routes = [
  { path: '', component: CvComponent },
];
```

> Nota: el `:lang` ya está en la ruta padre. El componente lee `lang` vía `ActivatedRoute.paramMap` (próximo paso).

- [ ] **Step 3: Crear página Home que envuelve el contenido actual**

Eliminamos los componentes del template del App y los movemos a un componente `HomePage`. Esto es necesario porque Router necesita un `<router-outlet>` en algún lugar.

Crear `src/app/pages/home/home.page.ts`:

```typescript
import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { About } from '../../components/about/about';
import { ProjectsSection } from '../../components/projects-section/projects-section';
import { ProjectDialog } from '../../components/project-dialog/project-dialog';
import { TranslationPipe } from '../../i18n/translation.pipe';
import { PROJECTS } from '../../data/projects';
import type { Project } from '../../models/project';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Hero,
    About,
    ProjectsSection,
    ProjectDialog,
    TranslationPipe,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
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

Crear `src/app/pages/home/home.page.html`:

```html
<a
  href="#main"
  class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
>
  {{ 'skipLink' | t }}
</a>

<main id="main" tabindex="-1">
  <app-hero />
  <app-about />
  <app-projects-section [projects]="projects" (openDialog)="openDialog($event)" />
</main>

<app-project-dialog [project]="dialogProject()" (closeDialog)="closeDialog()" />
```

Copiar `src/app/app.css` a `src/app/pages/home/home.page.css` (o dejar vacío si solo había estilos del shell).

- [ ] **Step 4: Modificar `app.ts` para usar RouterOutlet y leer lang de la ruta**

Modificar `src/app/app.ts`:

```typescript
import { Component, effect, inject } from '@angular/core';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { TranslationService } from './i18n/translation.service';
import { SeoService } from './seo/seo.service';
import {
  buildBreadcrumb,
  buildCreativeWork,
  buildPerson,
  buildWebSite,
} from './seo/json-ld.builder';
import { PROJECTS } from './data/projects';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly i18n = inject(TranslationService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    effect(() => {
      void this.i18n.setLang(this.i18n.lang()).then(() => {
        this.seo.setMeta({
          title: this.i18n.t('meta.title'),
          description: this.i18n.t('meta.description'),
        });
        this.seo.setCanonical('https://patriciomanquepillan.com/');
        this.seo.setStructuredData(buildPerson(), 'person');
        this.seo.setStructuredData(buildWebSite(), 'website');
        const breadcrumb = buildBreadcrumb();
        if (breadcrumb) {
          this.seo.setStructuredData(breadcrumb, 'breadcrumb');
        }
        for (const project of PROJECTS) {
          this.seo.setStructuredData(buildCreativeWork(project), `project-${project.id}`);
        }
      });
    });
  }
}
```

- [ ] **Step 5: Modificar `app.html` para que use router-outlet**

Modificar `src/app/app.html`:

```html
<app-header />
<router-outlet />
<app-footer />
```

- [ ] **Step 6: Modificar `cv.component.ts` para leer lang de ActivatedRoute**

Modificar `src/app/cv/cv.component.ts`:

```typescript
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { CV } from './data/cv.data';

@Component({
  selector: 'app-cv',
  standalone: true,
  templateUrl: './cv.component.html',
  styleUrl: './cv.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly lang = toSignal(
    this.route.parent!.paramMap.pipe(map((p) => (p.get('lang') as 'es' | 'en') ?? 'es')),
    { initialValue: 'es' as 'es' | 'en' },
  );
  protected readonly data = computed(() => CV[this.lang()]);
}
```

- [ ] **Step 7: Modificar `app.config.ts` para proveer router**

Modificar `src/app/app.config.ts`:

```typescript
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { APP_ROUTES } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      APP_ROUTES,
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
    ),
  ],
};
```

- [ ] **Step 8: Verificar build manual**

Run: `npm run build`
Expected: build OK, sin errores de tipos.

- [ ] **Step 9: Levantar dev server y verificar rutas en navegador**

Run: `npm start`
Visitar manualmente: `http://localhost:4200/` (debe mostrar el portafolio) y `http://localhost:4200/es/cv` (debe mostrar el CV en español).

Detener el servidor con Ctrl+C.

- [ ] **Step 10: Ejecutar tests para asegurar que nada se rompió**

Run: `ng test --watch=false`
Expected: PASS (todos los tests previos + los del CV).

- [ ] **Step 11: Commit**

```bash
git add src/app/app.routes.ts src/app/cv/cv.routes.ts src/app/app.config.ts src/app/app.ts src/app/app.html src/app/cv/cv.component.ts src/app/pages/
git commit -m "feat(cv): wire CV routes /:lang/cv via Angular Router"
```

---

## Task 4: Instalar puppeteer y crear script de generación de PDFs

**Files:**
- Modify: `package.json`
- Create: `scripts/generate-cv.mjs`

**Interfaces:**
- Consumes: build output en `dist/portafolio/browser/`; rutas `/es/cv` y `/en/cv` (Task 3)
- Produces: archivos `dist/portafolio/browser/cv-es.pdf` y `cv-en.pdf`

- [ ] **Step 1: Instalar puppeteer**

Run:
```bash
npm install --save-dev puppeteer --no-fund --no-audit
```
Expected: instalación de puppeteer y descarga de Chromium (~300 MB). El archivo `package.json` se actualiza con `"puppeteer": "..."` en `devDependencies`.

- [ ] **Step 2: Crear el script de generación**

Crear `scripts/generate-cv.mjs`:

```javascript
#!/usr/bin/env node
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist', 'portafolio', 'browser');
const PORT = Number(process.env.CV_PORT ?? 4321);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

function startStaticServer(rootDir, port) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0]);
        let filePath = path.join(rootDir, urlPath);
        if (!filePath.startsWith(rootDir)) {
          res.writeHead(403);
          res.end('forbidden');
          return;
        }
        if (urlPath.endsWith('/')) filePath = path.join(filePath, 'index.html');
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, 'index.html');
        }
        if (!fs.existsSync(filePath)) {
          // Fallback to index.html for SPA routing
          filePath = path.join(rootDir, 'index.html');
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
      } catch (err) {
        res.writeHead(500);
        res.end(String(err));
      }
    });
    server.on('error', reject);
    server.listen(port, () => resolve(server));
  });
}

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* not ready */
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`Server no respondió en ${timeoutMs}ms: ${url}`);
}

function assertBuildExists() {
  const indexPath = path.join(DIST, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error(
      `\n[generate-cv] No se encontró ${indexPath}.\n` +
        `Ejecuta primero: npm run build\n`,
    );
    process.exit(1);
  }
}

async function generate(lang) {
  const url = `http://127.0.0.1:${PORT}/${lang}/cv`;
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForSelector('app-cv', { timeout: 10000 });
    // Pequeña espera extra para que carguen las fonts
    await new Promise((r) => setTimeout(r, 300));
    const outPath = path.join(DIST, `cv-${lang}.pdf`);
    await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    const stat = fs.statSync(outPath);
    console.log(`[generate-cv] cv-${lang}.pdf escrito: ${(stat.size / 1024).toFixed(1)} KB`);
    if (stat.size < 10 * 1024) {
      console.warn(
        `[generate-cv] ⚠️ cv-${lang}.pdf parece sospechosamente pequeño (${stat.size} bytes)`,
      );
    }
    return outPath;
  } finally {
    await browser.close();
  }
}

async function main() {
  assertBuildExists();
  const server = await startStaticServer(DIST, PORT);
  console.log(`[generate-cv] servidor estático en http://127.0.0.1:${PORT}`);
  try {
    await waitForServer(`http://127.0.0.1:${PORT}/`);
    for (const lang of ['es', 'en']) {
      await generate(lang);
    }
    console.log('[generate-cv] ✅ CVs generados correctamente.');
  } finally {
    server.close();
  }
}

main().catch((err) => {
  console.error('[generate-cv] ❌ Error generando CVs:', err);
  process.exit(2);
});
```

- [ ] **Step 3: Verificar manualmente el script**

Run:
```bash
npm run build
node scripts/generate-cv.mjs
```
Expected:
- Servidor estático arranca en puerto 4321
- Puppeteer navega a `/es/cv` y `/en/cv`
- Mensajes: `[generate-cv] cv-es.pdf escrito: NN.N KB` y `[generate-cv] cv-en.pdf escrito: NN.N KB`
- Mensaje final: `[generate-cv] ✅ CVs generados correctamente.`
- Archivos `dist/portafolio/browser/cv-es.pdf` y `cv-en.pdf` existen

- [ ] **Step 4: Verificar PDFs visualmente**

Run:
```bash
open dist/portafolio/browser/cv-es.pdf
open dist/portafolio/browser/cv-en.pdf
```
Expected: ambos PDFs se abren, caben en 1 página A4, tipografía Archivo renderiza, links activos. Si algo no se ve bien, ajustar CSS en `cv.component.css` y re-ejecutar `node scripts/generate-cv.mjs`.

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-cv.mjs package.json package-lock.json
git commit -m "feat(cv): add Puppeteer script to generate /cv-{es,en}.pdf from build output"
```

---

## Task 5: Agregar scripts npm `cv` y `build:full`

**Files:**
- Modify: `package.json`

**Interfaces:**
- Consumes: `scripts/generate-cv.mjs` (Task 4)
- Produces: scripts npm `cv` (solo genera PDFs) y `build:full` (build + PDFs)

- [ ] **Step 1: Modificar `package.json` para agregar scripts**

Modificar la sección `scripts` de `package.json`:

```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "build:full": "npm run build && npm run cv",
    "cv": "node scripts/generate-cv.mjs",
    "test": "ng test",
    "favicon": "node scripts/generate-favicon.mjs",
    "og": "node scripts/generate-og.mjs"
  }
}
```

- [ ] **Step 2: Verificar scripts**

Run:
```bash
npm run cv --dry-run
```
(o simplemente `npm run cv` si ya existe el build)

Expected: el script genera los PDFs sin re-buildear.

Run:
```bash
npm run build:full
```
Expected: `ng build` corre, luego `node scripts/generate-cv.mjs` corre, y ambos PDFs están en `dist/portafolio/browser/`.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore(cv): add npm scripts cv and build:full"
```

---

## Task 6: Actualizar README y verificación end-to-end

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: nada
- Produces: README documenta los nuevos scripts y cómo regenerar los PDFs del CV.

- [ ] **Step 1: Agregar sección de CV al README**

Modificar `README.md`, agregar después de la sección "Building":

```markdown
## Generating CV PDFs

The "Download CV" buttons in the hero and footer link to `/cv-es.pdf` and `/cv-en.pdf`. These PDFs are not committed to the repo — they are generated at build time.

To regenerate just the PDFs (after editing CV data in `src/app/cv/data/cv.data.ts`):

```bash
npm run build
npm run cv
```

Or run the full build + CV generation in one command:

```bash
npm run build:full
```

The script uses Puppeteer with the bundled Chromium. On first install it downloads ~300 MB. Set `PUPPETEER_SKIP_DOWNLOAD=true` if you have a system Chrome and want to use it instead.

The CV is rendered from an Angular component (`src/app/cv/`) and printed to single-page A4 PDFs at `dist/portafolio/browser/cv-es.pdf` and `dist/portafolio/browser/cv-en.pdf`.
```

- [ ] **Step 2: Verificación end-to-end final**

Run:
```bash
npm test -- --watch=false
npm run build:full
ls -la dist/portafolio/browser/cv-*.pdf
```

Expected:
- Todos los tests pasan (incluyendo los nuevos del CV)
- Build sin errores
- `build:full` imprime ambos PDFs con tamaño > 10 KB
- `ls` muestra `cv-es.pdf` y `cv-en.pdf`

- [ ] **Step 3: Verificación visual final**

Run:
```bash
open dist/portafolio/browser/cv-es.pdf
open dist/portafolio/browser/cv-en.pdf
```

Validar:
- 1 página A4 cada uno (sin overflow)
- Tipografía Archivo (no fallback a sans-serif del sistema)
- Links clickables (mailto, tel, linkedin, github, cualautocompro.cl)
- Contenido en idioma correcto
- Sin foto, sin ubicación
- Sección de habilidades con 4 categorías
- Sección de idiomas con Español nativo e Inglés B2

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs(cv): document npm scripts for CV PDF generation"
```

---

## Self-Review Checklist

Antes de declarar el plan completo, verifica:

- [ ] **Cobertura del spec:** Cada requisito del spec tiene al menos una tarea.
  - Idiomas ES + EN → Task 1, 2, 3, 4 ✓
  - 1 página A4 → Task 2 (CSS), Task 4 (`preferCSSPageSize`) ✓
  - Layout una columna densa → Task 2 (template) ✓
  - Sin foto, sin ubicación → Task 1 (datos) ✓
  - Componente Angular + Puppeteer → Tasks 2, 3, 4 ✓
  - Tests unitarios → Tasks 1, 2 ✓
  - Tests de humo → Task 4 (sanity check tamaño) ✓
  - Manejo de errores → Task 4 (`assertBuildExists`, try/catch) ✓
  - `build:full` encadena build + CV → Task 5 ✓
  - Documentación → Task 6 ✓

- [ ] **Sin placeholders:** `grep -E "TBD|TODO|FIXME" plan` → ninguno.

- [ ] **Consistencia de tipos:** `CvData`, `CvContact`, `CvExperience`, etc. se usan consistentemente a través de Tasks 1, 2, 3, 6.

- [ ] **Consistencia de nombres:** `CvComponent`, `cv-{es,en}.pdf`, `CV_ROUTES`, `APP_ROUTES` consistentes en todas las tasks.

- [ ] **Rutas correctas:** `/es/cv` y `/en/cv` (con `/:lang/cv` como path padre en Task 3).