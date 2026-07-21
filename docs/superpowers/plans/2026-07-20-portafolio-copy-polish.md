# Pulido editorial del portafolio — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar un pulido editorial sistemático (7 sweeps + SEO) sobre los textos del portafolio para producir una pieza de élite ante reclutadores senior/CTOs y revisores académicos, sin alterar estructura, dependencias ni diseño visual.

**Architecture:** 8 commits incrementales (uno por sweep + 1 SEO), cada uno con sus tests actualizados. Los sweeps se aplican en cascada — tras cada uno se revisan los anteriores. Cambios solo en strings: ninguna refactorización de componentes, signals, CSS o tipados.

**Tech Stack:** Angular 22 (standalone components, signals, OnPush), TypeScript, Vitest, Angular Universal (SSR), JSON-LD (schema.org), i18n vía JSON cargado por `TranslationService`.

## Global Constraints

Estos aplican a cada task — copiados verbatim del spec `2026-07-20-portafolio-copy-polish-design.md`.

- **Voz objetivo:** Senior técnico sereno, conciso y directo. Sin coloquialismos ni jerga decorativa. Claims cuantificados cuando posible; cualificados con honestidad cuando no.
- **Audiencia dual:** Reclutadores senior/CTOs/headhunters + revisores académicos. Mismo registro sirve a ambas.
- **Preservar:** Placeholders en keys i18n (`{years}`, `{title}`, `{company}`); estructura de datos en `projects.ts` (tipos `Project`, `ProjectLetter` intactos); esqueletos HTML/CSS/Tailwind; nombres (`SITE_NAME`, `EXPERIENCE_ES`, `stack`, etc.).
- **Cartas de recomendación NO se reescriben** — son documentos firmados por Michael Antonio Bórquez y Tiago Joel Da Silva Monteiro. Solo se actúa sobre `shortDescription`, `body` (no carta), `imageAlt`.
- **Sin cambios visuales**, sin refactors de CSS/Tailwind, sin nuevas dependencias, sin nuevos idiomas.
- **Cada commit incluye `npm test` en verde y `npm run build` sin errores nuevos.**
- **Convención de commit:** `copy(sweep N): <descripción corta>` para 1–7; `seo: meta + json-ld + hreflang` para 8.
- **Cascada:** tras cada sweep, releer los anteriores; tras Sweep 6, revisar 1 y 4; tras Sweep 7, recorrido completo.

---

## Task 1 — Sweep 1: Claridad

**Files:**
- Modify: `public/i18n/es.json`
- Modify: `public/i18n/en.json`
- Modify: `src/app/cv/data/cv.data.ts`
- Test: `src/app/components/hero/hero.spec.ts`
- Test: `src/app/components/about/about.spec.ts`

**Objetivo:** Que el lector entienda sin releer. Eliminar pronombres ambiguos, hedging vacío, frases que dicen dos cosas.

- [ ] **Step 1: Editar `public/i18n/es.json`**

Reemplazos literales (mantener keys y placeholders intactos):

```json
{
  "hero.subtitle": "Soy Patricio Manquepillan, desarrollador frontend con foco en Angular y TypeScript. Estos son los productos en los que más he crecido en los últimos años — cada uno con su historia y su responsable firmando lo que aprendí ahí.",
}
```
→
```json
  "hero.subtitle": "Soy Patricio Manquepillan, desarrollador frontend con foco en Angular y TypeScript. Estos proyectos resumen los productos donde he crecido en los últimos años. Cada uno incluye una carta del responsable que supervisó el trabajo.",
```

```json
  "about.paragraph2": "Me obsesionan dos cosas y media. Que la UI se sienta bien al usarla. Que el código envejezca bien. Y que las decisiones técnicas queden justificadas para el siguiente que las lea.",
```
→
```json
  "about.paragraph2": "Tres prioridades guían mi trabajo. Que la interfaz se sienta bien al usarla. Que el código envejezca bien. Y que las decisiones técnicas queden justificadas para el siguiente que las lea.",
```

```json
  "about.paragraph3": "Hoy trabajo como frontend lead en proyectos de Angular. Cuando hace falta, me meto en backend sin drama.",
```
→
```json
  "about.paragraph3": "Trabajo como frontend lead en proyectos de Angular. Cuando hace falta, participo en el backend con el mismo nivel de rigor.",
```

```json
  "projects.subtitle": "Cada uno con la carta de recomendación de quien me supervisó.",
```
→
```json
  "projects.subtitle": "Cada proyecto incluye una carta de recomendación firmada por el responsable que supervisó el trabajo.",
```

- [ ] **Step 2: Editar `public/i18n/en.json`**

```json
  "hero.subtitle": "I'm Patricio Manquepillan, a frontend developer focused on Angular and TypeScript. These are the products I've grown the most on in the last few years — each with its story and its accountable lead signing off on what I learned there.",
```
→
```json
  "hero.subtitle": "I'm Patricio Manquepillan, a frontend developer focused on Angular and TypeScript. These projects summarize the products where I've grown the most in the last few years. Each one includes a letter from the lead who supervised the work.",
```

```json
  "about.paragraph2": "I'm obsessed with two and a half things. That the UI feels good to use. That the code ages well. And that technical decisions stay justified for whoever reads them next.",
```
→
```json
  "about.paragraph2": "Three priorities guide my work. That the interface feels good to use. That the code ages well. And that technical decisions stay justified for whoever reads them next.",
```

```json
  "about.paragraph3": "I currently work as a frontend lead on Angular projects. When needed, I jump into backend without drama.",
```
→
```json
  "about.paragraph3": "I work as a frontend lead on Angular projects. When needed, I take part in the backend with the same standard of rigour.",
```

```json
  "projects.subtitle": "Each one with the recommendation letter from the person who supervised me.",
```
→
```json
  "projects.subtitle": "Each project includes a recommendation letter signed by the lead who supervised the work.",
```

- [ ] **Step 3: Editar `src/app/cv/data/cv.data.ts`**

Reemplazar el `summary` ES:
```ts
    summary:
      'Senior Frontend Developer con +6 años en producción. Angular lead con foco en accesibilidad WCAG AA y sistemas con cientos de miles de usuarios. Cuando hace falta, se mete en backend sin drama.',
```
→
```ts
    summary:
      'Senior Frontend Developer con +6 años en producción. Angular lead con foco en accesibilidad WCAG AA y sistemas con cientos de miles de usuarios. Cuando hace falta, participa en el backend con el mismo nivel de rigor.',
```

Reemplazar el `summary` EN:
```ts
    summary:
      'Senior Frontend Developer with 6+ years in production. Angular lead focused on WCAG AA accessibility and products used by hundreds of thousands of people. When needed, I jump into backend without drama.',
```
→
```ts
    summary:
      'Senior Frontend Developer with 6+ years in production. Angular lead focused on WCAG AA accessibility and products used by hundreds of thousands of people. When needed, I take part in the backend with the same standard of rigour.',
```

- [ ] **Step 4: Actualizar aserciones en `hero.spec.ts`**

Reemplazar el bloque `ES['hero.subtitle']`:
```ts
  'hero.subtitle': 'Soy Patricio Manquepillan, desarrollador frontend con foco en Angular y TypeScript.',
```
(permanece igual — solo cambia el valor largo)

Reemplazar la aserción larga en español:
```ts
    expect(root.textContent).toContain('Soy Patricio Manquepillan');
```
→
```ts
    expect(root.textContent).toContain('Soy Patricio Manquepillan');
    expect(root.textContent).toContain('carta del responsable que supervisó el trabajo');
```

Reemplazar la aserción análoga en EN:
```ts
    expect(root.textContent).toContain("I'm Patricio Manquepillan");
```
→
```ts
    expect(root.textContent).toContain("I'm Patricio Manquepillan");
    expect(root.textContent).toContain('letter from the lead who supervised the work');
```

- [ ] **Step 5: Actualizar aserciones en `about.spec.ts`**

En el bloque `ES` actualizar `about.paragraph2` y `about.paragraph3`:
```ts
  'about.paragraph2':
    'Me obsesionan dos cosas y media. Que la UI se sienta bien al usarla. Que el código envejezca bien. Y que las decisiones técnicas queden justificadas para el siguiente que las lea.',
  'about.now': 'Ahora liderando frontend en un portal con 2M visitas/mes y WCAG AA estricto.',
  'about.paragraph3':
    'Hoy trabajo como frontend lead en proyectos de Angular. Cuando hace falta, me meto en backend sin drama.',
```
→
```ts
  'about.paragraph2':
    'Tres prioridades guían mi trabajo. Que la interfaz se sienta bien al usarla. Que el código envejezca bien. Y que las decisiones técnicas queden justificadas para el siguiente que las lea.',
  'about.now': 'Ahora liderando frontend en un portal con 2M visitas/mes y WCAG AA estricto.',
  'about.paragraph3':
    'Trabajo como frontend lead en proyectos de Angular. Cuando hace falta, participo en el backend con el mismo nivel de rigor.',
```

En el bloque `EN` análogo:
```ts
  'about.paragraph2':
    "I'm obsessed with two and a half things. That the UI feels good to use. That the code ages well. And that technical decisions stay justified for whoever reads them next.",
  'about.now': 'Now leading frontend on a portal with 2M visits/month and strict WCAG AA.',
  'about.paragraph3':
    'I currently work as a frontend lead on Angular projects. When needed, I jump into backend without drama.',
```
→
```ts
  'about.paragraph2':
    "Three priorities guide my work. That the interface feels good to use. That the code ages well. And that technical decisions stay justified for whoever reads them next.",
  'about.now': 'Now leading frontend on a portal with 2M visits/month and strict WCAG AA.',
  'about.paragraph3':
    'I work as a frontend lead on Angular projects. When needed, I take part in the backend with the same standard of rigour.',
```

Actualizar las aserciones que aún referencian los textos antiguos:
```ts
    expect(root.textContent).toContain('Me obsesionan dos cosas y media.');
```
→
```ts
    expect(root.textContent).toContain('Tres prioridades guían mi trabajo.');
```

```ts
    expect(root.textContent).toContain(
      'Hoy trabajo como frontend lead en proyectos de Angular.',
    );
```
→
```ts
    expect(root.textContent).toContain(
      'Trabajo como frontend lead en proyectos de Angular.',
    );
```

```ts
    expect(root.textContent).toContain("I'm obsessed with two and a half things.");
```
→
```ts
    expect(root.textContent).toContain('Three priorities guide my work.');
```

```ts
    expect(root.textContent).toContain(
      'I currently work as a frontend lead on Angular projects.',
    );
```
→
```ts
    expect(root.textContent).toContain(
      'I work as a frontend lead on Angular projects.',
    );
```

- [ ] **Step 6: Verificar build y tests**

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && npm test -- --run 2>&1 | tail -50
```
Esperado: todos los tests en verde.

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && npm run build 2>&1 | tail -30
```
Esperado: build sin errores.

- [ ] **Step 7: Commit**

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && git add public/i18n/es.json public/i18n/en.json src/app/cv/data/cv.data.ts src/app/components/hero/hero.spec.ts src/app/components/about/about.spec.ts && git commit -m "copy(sweep 1): clarity pass — remove ambiguity and split two-idea sentences"
```

---

## Task 2 — Sweep 2: Voz y tono

**Files:**
- Modify: `public/i18n/es.json`
- Modify: `public/i18n/en.json`
- Modify: `src/app/data/projects.ts`
- Modify: `src/app/components/header/header.html`
- Test: `src/app/components/hero/hero.spec.ts`
- Test: `src/app/components/about/about.spec.ts`
- Test: `src/app/components/project-dialog/project-dialog.spec.ts`

**Objetivo:** Un único registro de principio a fin. Eliminar coloquialismos restantes; unificar primera persona sobria en About/cartas; impersonal en CV.

- [ ] **Step 1: Editar `public/i18n/es.json`**

```json
  "about.paragraph1": "Llevo {years} años en producción, con cientos de usuarios en los productos donde he trabajado. Empecé unificando los SCADA de cuatro sanitarias chilenas, después me fui al área de Capital de Banco Santander a automatizar backstops crediticios en Java y Spring Boot sobre Kubernetes, y ahora estoy en un portal institucional con WCAG AA estricto. En mis tiempos libres armo cualautocompro.cl, un comparador del mercado automotriz chileno.",
```
→
```json
  "about.paragraph1": "Llevo {years} años en producción, con cientos de miles de usuarios en los productos donde he trabajado. Empecé unificando los SCADA de cuatro sanitarias chilenas, después me trasladé al área de Capital de Banco Santander para automatizar backstops crediticios en Java y Spring Boot sobre Kubernetes, y hoy lidero frontend en un portal institucional con WCAG AA estricto. En paralelo mantengo cualautocompro.cl, un comparador del mercado automotriz chileno.",
```

```json
  "footer.tagline": "Construyendo productos web que se sienten bien al usarlos.",
```
→
```json
  "footer.tagline": "Construyo productos web que se sienten bien al usarlos.",
```

- [ ] **Step 2: Editar `public/i18n/en.json`**

```json
  "about.paragraph1": "I've spent {years} years in production, with hundreds of users in the products I've worked on. I started by unifying the SCADA systems of four Chilean water utilities, then moved to Banco Santander's Capital area to automate credit backstops in Java and Spring Boot on Kubernetes, and now I'm at an institutional portal with strict WCAG AA. In my free time I build cualautocompro.cl, a comparator for the Chilean automotive market.",
```
→
```json
  "about.paragraph1": "I've spent {years} years in production, with hundreds of thousands of users across the products I've worked on. I started by unifying the SCADA systems of four Chilean water utilities, then moved to Banco Santander's Capital area to automate credit backstops in Java and Spring Boot on Kubernetes, and today I lead frontend on an institutional portal with strict WCAG AA. In parallel I maintain cualautocompro.cl, a comparator for the Chilean automotive market.",
```

```json
  "footer.tagline": "Building web products that feel good to use.",
```
→
```json
  "footer.tagline": "I build web products that feel good to use.",
```

- [ ] **Step 3: Editar `src/app/data/projects.ts` — proyecto `cualautocompro-cl`**

Reemplazar el `body` ES:
```ts
    body: `cualautocompro.cl es mi proyecto personal. Una herramienta para analizar el mercado automotriz chileno y ayudar a quien va a comprar un vehículo a elegir mejor. Permite revisar, buscar y comparar modelos y versiones de todas las marcas que se venden en Chile, y compartir comparativas con otros usuarios.

Como único responsable técnico, participé en todo el ciclo: modelé el dominio en Prisma sobre MySQL, construí el backend en Express + TypeScript con autenticación vía Passport (Google y Apple), y el frontend en Angular 22 con Angular Material. Diseñé una capa de scraping propio que mantiene el catálogo al día y un motor de ranker configurable para ponderar versiones según distintos criterios.

Lo que más disfruté fue el modelo de comparativas. Cada usuario arma su comparación, la comparte con un slug, y otros pueden consultarla o extenderla. Un buen análisis se convierte, de paso, en tráfico orgánico para el producto.`,
```
→
```ts
    body: `cualautocompro.cl es mi proyecto personal. Una herramienta para analizar el mercado automotriz chileno y ayudar a quien va a comprar un vehículo a elegir mejor. Permite revisar, buscar y comparar modelos y versiones de todas las marcas que se venden en Chile, y compartir comparativas con otros usuarios.

Como único responsable técnico, participé en todo el ciclo: modelé el dominio en Prisma sobre MySQL, construí el backend en Express + TypeScript con autenticación vía Passport (Google y Apple), y el frontend en Angular 22 con Angular Material. Diseñé una capa de scraping propio que mantiene el catálogo al día y un motor de ranker configurable para ponderar versiones según distintos criterios.

El modelo de comparativas es la pieza central del producto. Cada usuario arma su comparación, la comparte mediante un slug, y otros pueden consultarla o extenderla. Un análisis sólido se convierte, de paso, en tráfico orgánico para el producto.`,
```

Reemplazar el `body` EN dentro de `localized.en`:
```ts
        body: `cualautocompro.cl is my personal project. A tool for analyzing the Chilean auto market and helping anyone who's about to buy a vehicle make a better choice. It lets you browse, search, and compare models and trims from every brand sold in Chile, and share the comparisons you build with other users.

As the sole technical owner I worked the full cycle: modeled the domain in Prisma over MySQL, built the backend in Express + TypeScript with Passport authentication (Google and Apple), and the frontend in Angular 22 with Angular Material. I designed a custom scraping layer that keeps the catalog up to date and a configurable ranker engine for weighting trims against different criteria.

The bit I enjoyed most was the comparison model. Each user builds a comparison, shares it via a slug, and others can view or extend it. A solid analysis becomes, on the way, organic traffic for the product.`,
```
→
```ts
        body: `cualautocompro.cl is my personal project. A tool for analyzing the Chilean auto market and helping anyone who's about to buy a vehicle make a better choice. It lets you browse, search, and compare models and trims from every brand sold in Chile, and share the comparisons you build with other users.

As the sole technical owner I worked the full cycle: modeled the domain in Prisma over MySQL, built the backend in Express + TypeScript with Passport authentication (Google and Apple), and the frontend in Angular 22 with Angular Material. I designed a custom scraping layer that keeps the catalog up to date and a configurable ranker engine for weighting trims against different criteria.

The comparison model is the central piece of the product. Each user builds a comparison, shares it via a slug, and others can view or extend it. A solid analysis becomes, on the way, organic traffic for the product.`,
```

- [ ] **Step 4: Editar `src/app/components/header/header.html`**

Reemplazar el subheader hardcoded:
```html
      <span class="ml-1 hidden font-sans text-xs font-normal text-secondary sm:inline">/ developer</span>
```
→
```html
      <span class="ml-1 hidden font-sans text-xs font-normal text-secondary sm:inline">/ senior frontend</span>
```

- [ ] **Step 5: Actualizar aserciones en `hero.spec.ts`**

No requiere cambios (el hero no cambió strings en este sweep).

- [ ] **Step 6: Actualizar aserciones en `about.spec.ts`**

En el bloque `ES`, actualizar `about.paragraph1`:
```ts
  'about.paragraph1':
    'Llevo {years} años en producción, con cientos de usuarios en los productos donde he trabajado.',
```
→
```ts
  'about.paragraph1':
    'Llevo {years} años en producción, con cientos de miles de usuarios en los productos donde he trabajado.',
```

Y la aserción correspondiente:
```ts
    expect(root.textContent).toContain(`Llevo ${yearsOfExperience()} años en producción`);
```
(permanece — solo verifica el inicio)

En el bloque `EN`, análogo:
```ts
  'about.paragraph1':
    "I've spent {years} years in production, with hundreds of users in the products I've worked on.",
```
→
```ts
  'about.paragraph1':
    "I've spent {years} years in production, with hundreds of thousands of users across the products I've worked on.",
```

- [ ] **Step 7: Actualizar aserciones en `project-dialog.spec.ts`**

El test del EN letter usa `localized?.en?.letter?.paragraphs?.[0]` y `letter?.paragraphs?.[0]`. Las cartas firmadas NO se modifican (decisión del spec). Las únicas cadenas que cambiaron en `projects.ts` son `body` de cualautocompro-cl — pero ese proyecto es `personal` y no tiene `letter`, así que el test del letter no se ve afectado. No requiere cambios.

- [ ] **Step 8: Verificar build y tests**

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && npm test -- --run 2>&1 | tail -50
```
Esperado: todos los tests en verde.

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && npm run build 2>&1 | tail -30
```
Esperado: build sin errores.

- [ ] **Step 9: Commit**

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && git add public/i18n/es.json public/i18n/en.json src/app/data/projects.ts src/app/components/header/header.html src/app/components/about/about.spec.ts && git commit -m "copy(sweep 2): voice and tone — remove colloquialisms, unify register"
```

---

## Task 3 — Sweep 3: So What

**Files:**
- Modify: `src/app/cv/data/cv.data.ts`
- Modify: `public/i18n/es.json`
- Modify: `public/i18n/en.json`
- Test: `src/app/cv/data/cv.data.spec.ts`
- Test: `src/app/cv/cv.component.spec.ts`
- Test: `src/app/components/about/about.spec.ts`

**Objetivo:** Cada claim lleva al lector a "y eso importa porque…". Añadir el puente de impacto a bullets de experiencia y reescribir el About con anclaje a resultados del CV.

- [ ] **Step 1: Reescribir `EXPERIENCE_ES` en `src/app/cv/data/cv.data.ts`**

Reemplazar el bloque `EXPERIENCE_ES` completo:

```ts
const EXPERIENCE_ES: CvData['experience'] = [
  {
    company: 'Comunidad de Madrid (vía NTT Data España)',
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
```
→
```ts
const EXPERIENCE_ES: CvData['experience'] = [
  {
    company: 'Comunidad de Madrid (vía NTT Data España)',
    role: 'Frontend developer',
    period: '2025 — actualidad',
    bullets: [
      'Frontend en un equipo de 12 personas en el portal institucional con 2M visitas/mes, donde cada cambio toca la experiencia de ciudadanía a escala regional.',
      'Construí una librería accesible (combobox, modal con focus trap, navegación por teclado) que se convirtió en estándar interno, lo que redujo el costo de accesibilidad en los siguientes portales del gobierno regional.',
      'Optimicé SSR con Angular Universal hasta TTFB < 200 ms en los 200 trámites más consultados, lo que impacta directamente SEO y tasa de abandono en flujos críticos.',
    ],
    stack: ['Angular', 'micro front ends', 'Capacitor', 'TypeScript', 'PostgreSQL', 'Jenkins'],
  },
  {
    company: 'Banco Santander España (vía NTT Data)',
    role: 'Fullstack developer',
    period: 'abr 2022 — abr 2025',
    bullets: [
      'Sistema automatizado de backstops crediticios con motor de reglas configurable, scoring e integración con sistemas internos, dentro de iniciativa conjunta del banco con la Unión Europea — el motor que decide qué operaciones requieren cobertura adicional.',
      'Evolucioné de frontend Angular a gestionar y desplegar microservicios backend en Java + Spring Boot sobre Kubernetes, lo que entrega escalado automático y despliegues sin downtime en una plataforma regulada.',
    ],
    stack: ['Angular', 'Java', 'Spring Boot', 'Kubernetes'],
  },
  {
    company: 'Aguas Nuevas S.A.',
    role: 'Frontend / SCADA Developer / DBA',
    period: '2019 — 2022',
    bullets: [
      'Unifiqué la telemetría y los SCADA de las 4 empresas del grupo (Aguas Altiplano, Chañar, Araucanía, Magallanes), lo que centralizó la operación que antes estaba fragmentada en versiones obsoletas y sin parches.',
      'Migré más de 50 plantas al nuevo SCADA sobre AVEVA System Platform, incluida la desalinizadora por ósmosis inversa de Iquique — datos en vivo que hoy sostienen decisiones operativas 24/7.',
      'Construí la app web de visualización con Angular + Spring Boot y entrené a operarios en su uso, cerrando el ciclo entre dato y operación en planta.',
    ],
    stack: ['AVEVA System Platform', 'Oracle SQL', 'Angular', 'Spring Boot', 'Python', 'Highcharts'],
  },
  {
    company: 'cualautocompro.cl (proyecto personal)',
    role: 'Owner',
    period: '2026',
    bullets: [
      'Catálogo del mercado automotriz chileno con búsqueda, comparación y sharing de comparativas — un comparador que se vuelve contenido compartible.',
      'Diseño y construyo el ciclo completo: scraping, modelo de datos en Prisma, backend Express, frontend Angular 22 — cada decisión de arquitectura pasa por ser mantenible solo.',
    ],
    stack: ['Angular 22', 'Angular Material', 'Express', 'Prisma', 'MySQL', 'Tailwind CSS', 'Playwright'],
  },
];
```

- [ ] **Step 2: Reescribir `EXPERIENCE_EN` en `src/app/cv/data/cv.data.ts`**

Reemplazar el bloque `EXPERIENCE_EN` completo:

```ts
const EXPERIENCE_EN: CvData['experience'] = [
  {
    company: 'Community of Madrid (via NTT Data España)',
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
```
→
```ts
const EXPERIENCE_EN: CvData['experience'] = [
  {
    company: 'Community of Madrid (via NTT Data España)',
    role: 'Frontend developer',
    period: '2025 — present',
    bullets: [
      'Frontend on a 12-person team for the institutional portal serving 2M visits/month, where each change reaches citizens at a regional scale.',
      'Built an accessible component library (combobox, modal with focus trap, keyboard navigation for long lists) that became the internal standard, lowering the accessibility cost for the regional government\'s next portals.',
      'Optimised SSR with Angular Universal down to TTFB < 200 ms across the 200 most-consulted procedures, directly improving SEO and abandonment in critical flows.',
    ],
    stack: ['Angular', 'micro frontends', 'Capacitor', 'TypeScript', 'PostgreSQL', 'Jenkins'],
  },
  {
    company: 'Banco Santander España (via NTT Data)',
    role: 'Fullstack developer',
    period: 'Apr 2022 — Apr 2025',
    bullets: [
      'Automated credit-backstop management system with a configurable rules engine, transaction scoring, and integration with the bank\'s internal systems, within a joint bank–European Union initiative — the engine that decides which transactions require additional coverage.',
      'Grew from Angular frontend to owning and deploying backend microservices in Java + Spring Boot on Kubernetes, delivering autoscaling and zero-downtime deployments on a regulated platform.',
    ],
    stack: ['Angular', 'Java', 'Spring Boot', 'Kubernetes'],
  },
  {
    company: 'Aguas Nuevas S.A.',
    role: 'Frontend / SCADA Developer / DBA',
    period: '2019 — 2022',
    bullets: [
      'Unified telemetry and SCADA systems of the 4 companies in the group (Aguas Altiplano, Chañar, Araucanía, Magallanes), centralising operations that had been fragmented across outdated, unpatched versions.',
      'Migrated 50+ plants to the new SCADA on AVEVA System Platform, including the Iquique reverse-osmosis desalination plant — live data that today underpins 24/7 operational decisions.',
      'Built the visualisation web app with Angular + Spring Boot and trained operators in its use, closing the loop between data and on-site operation.',
    ],
    stack: ['AVEVA System Platform', 'Oracle SQL', 'Angular', 'Spring Boot', 'Python', 'Highcharts'],
  },
  {
    company: 'cualautocompro.cl (personal project)',
    role: 'Owner',
    period: '2026',
    bullets: [
      'Catalog of the Chilean auto market with browsing, searching, and sharing of user-built comparisons — a comparator that doubles as shareable content.',
      'Design and build the full cycle: scraping layer, data model in Prisma, Express backend, Angular 22 frontend — every architectural decision passes the solo-maintainability test.',
    ],
    stack: ['Angular 22', 'Angular Material', 'Express', 'Prisma', 'MySQL', 'Tailwind CSS', 'Playwright'],
  },
];
```

- [ ] **Step 3: Editar `public/i18n/es.json` — `about.paragraph1`**

```json
  "about.paragraph1": "Llevo {years} años en producción, con cientos de miles de usuarios en los productos donde he trabajado. Empecé unificando los SCADA de cuatro sanitarias chilenas, después me trasladé al área de Capital de Banco Santander para automatizar backstops crediticios en Java y Spring Boot sobre Kubernetes, y hoy lidero frontend en un portal institucional con WCAG AA estricto. En paralelo mantengo cualautocompro.cl, un comparador del mercado automotriz chileno.",
```
→
```json
  "about.paragraph1": "Llevo {years} años en producción, con cientos de miles de usuarios en los productos donde he trabajado. Empecé unificando los SCADA de cuatro sanitarias chilenas —el resultado fue centralizar operación que estaba fragmentada en versiones obsoletas—, después me trasladé al área de Capital de Banco Santander para automatizar backstops crediticios en Java y Spring Boot sobre Kubernetes, plataforma que escaló sin downtime en producción regulada, y hoy lidero frontend en un portal institucional con WCAG AA estricto que sirve 2M visitas al mes. En paralelo mantengo cualautocompro.cl, un comparador del mercado automotriz chileno donde la comparativa es también contenido compartible.",
```

- [ ] **Step 4: Editar `public/i18n/en.json` — `about.paragraph1`**

```json
  "about.paragraph1": "I've spent {years} years in production, with hundreds of thousands of users across the products I've worked on. I started by unifying the SCADA systems of four Chilean water utilities, then moved to Banco Santander's Capital area to automate credit backstops in Java and Spring Boot on Kubernetes, and today I lead frontend on an institutional portal with strict WCAG AA. In parallel I maintain cualautocompro.cl, a comparator for the Chilean automotive market.",
```
→
```json
  "about.paragraph1": "I've spent {years} years in production, with hundreds of thousands of users across the products I've worked on. I started by unifying the SCADA systems of four Chilean water utilities —centralising operations that had been fragmented across outdated versions— then moved to Banco Santander's Capital area to automate credit backstops in Java and Spring Boot on Kubernetes, a platform that scaled without downtime in a regulated production environment, and today I lead frontend on an institutional portal with strict WCAG AA that serves 2M visits a month. In parallel I maintain cualautocompro.cl, a comparator for the Chilean automotive market where every comparison doubles as shareable content.",
```

- [ ] **Step 5: Actualizar tests**

`cv.data.spec.ts` solo verifica conteos y paridad — sigue pasando sin cambios.

`cv.component.spec.ts` verifica que `CV.es.summary.split('.')[0]` esté presente y que `Apr 2022` no leak en ES. No requiere cambios (no cambiamos summary ni periods).

`about.spec.ts` actualiza el bloque `ES` (sólo el inicio, la verificación `toContain` sigue siendo sobre el inicio):

```ts
  'about.paragraph1':
    'Llevo {years} años en producción, con cientos de miles de usuarios en los productos donde he trabajado.',
```
(permanece, ya fue actualizado en el Sweep 2).

Y `EN`:
```ts
  'about.paragraph1':
    "I've spent {years} years in production, with hundreds of thousands of users across the products I've worked on.",
```
(permanece).

- [ ] **Step 6: Verificar build y tests**

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && npm test -- --run 2>&1 | tail -50
```
Esperado: todos los tests en verde.

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && npm run build 2>&1 | tail -30
```
Esperado: build sin errores.

- [ ] **Step 7: Commit**

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && git add src/app/cv/data/cv.data.ts public/i18n/es.json public/i18n/en.json && git commit -m "copy(sweep 3): so what — anchor each claim to its impact"
```

---

## Task 4 — Sweep 4: Prueba (cuantificación)

**Files:**
- Modify: `public/i18n/es.json`
- Modify: `public/i18n/en.json`
- Test: `src/app/components/about/about.spec.ts`

**Objetivo:** Todo claim cuantificable o cualificable. Eliminar vaguedad numérica. Sin sobreactuar: si no hay dato concreto, cualificar honestamente.

- [ ] **Step 1: Editar `public/i18n/es.json`**

```json
  "hero.credentials": "+6 años en producción · Angular lead en Banco Santander · WCAG AA en Comunidad de Madrid",
```
(permanece — ya está cuantificado con datos concretos)

```json
  "meta.description": "Senior Frontend Developer con +6 años en producción. Angular lead en Banco Santander, WCAG AA en Comunidad de Madrid. Disponible para remoto y freelance.",
```
→
```json
  "meta.description": "Senior Frontend Developer con +6 años en producción. Angular lead en Banco Santander (2022–2025) y desarrollador frontend en Comunidad de Madrid (2025–actualidad). WCAG AA en producción desde 2025.",
```

```json
  "meta.ogDescription": "Senior Frontend Developer. Angular, TypeScript, accesibilidad WCAG AA. Disponible para remoto y freelance.",
```
→
```json
  "meta.ogDescription": "Senior Frontend Developer. Angular, TypeScript, WCAG AA. Portal institucional con 2M visitas/mes. Disponible para remoto y freelance.",
```

```json
  "about.paragraph1": "Llevo {years} años en producción, con cientos de miles de usuarios en los productos donde he trabajado. Empecé unificando los SCADA de cuatro sanitarias chilenas —el resultado fue centralizar operación que estaba fragmentada en versiones obsoletas—, después me trasladé al área de Capital de Banco Santander para automatizar backstops crediticios en Java y Spring Boot sobre Kubernetes, plataforma que escaló sin downtime en producción regulada, y hoy lidero frontend en un portal institucional con WCAG AA estricto que sirve 2M visitas al mes. En paralelo mantengo cualautocompro.cl, un comparador del mercado automotriz chileno donde la comparativa es también contenido compartible.",
```
(ya fue reescrito en Sweep 3 con cifras concretas — permanece)

- [ ] **Step 2: Editar `public/i18n/en.json`**

```json
  "hero.credentials": "6+ years in production · Angular lead at Banco Santander · WCAG AA at Comunidad de Madrid",
```
(permanece)

```json
  "meta.description": "Senior Frontend Developer with 6+ years in production. Angular lead at Banco Santander, WCAG AA at Comunidad de Madrid. Open to remote and freelance.",
```
→
```json
  "meta.description": "Senior Frontend Developer with 6+ years in production. Angular lead at Banco Santander (2022–2025) and frontend developer at Comunidad de Madrid (2025–present). WCAG AA in production since 2025.",
```

```json
  "meta.ogDescription": "Senior Frontend Developer. Angular, TypeScript, WCAG AA accessibility. Open to remote and freelance.",
```
→
```json
  "meta.ogDescription": "Senior Frontend Developer. Angular, TypeScript, WCAG AA. Institutional portal with 2M visits/month. Open to remote and freelance.",
```

- [ ] **Step 3: Actualizar aserciones en `about.spec.ts`**

Las aserciones en `about.spec.ts` no dependen del meta.description (esos tests no testean la página home). El test `meta.ogDescription` no tiene aserción directa en el spec de about.spec. No requiere cambios.

- [ ] **Step 4: Verificar build y tests**

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && npm test -- --run 2>&1 | tail -50
```
Esperado: todos los tests en verde.

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && npm run build 2>&1 | tail -30
```
Esperado: build sin errores.

- [ ] **Step 5: Commit**

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && git add public/i18n/es.json public/i18n/en.json && git commit -m "copy(sweep 4): proof — quantify or qualify every meta claim"
```

---

## Task 5 — Sweep 5: Especificidad

**Files:**
- Modify: `public/i18n/es.json`
- Modify: `public/i18n/en.json`
- Modify: `src/app/data/projects.ts`
- Modify: `src/app/cv/data/cv.data.ts`
- Test: `src/app/components/about/about.spec.ts`
- Test: `src/app/components/project-dialog/project-dialog.spec.ts`

**Objetivo:** Detalles concretos en lugar de vagos. Reemplazar verbos genéricos, enumerar stack cuando aplica, eliminar adjetivos que no añaden información.

- [ ] **Step 1: Editar `public/i18n/es.json`**

```json
  "hero.badge": "Disponible para nuevos proyectos",
```
(permanece — es concreto)

```json
  "dialog.escToClose": "Pulsa",
```
(permanece — forma parte del atajo "Pulsa Esc")

```json
  "footer.copy": "© {year}. Hecho con Angular 22 y Tailwind v4, sin frameworks de UI.",
```
(permanece — stack enumerado)

- [ ] **Step 2: Editar `public/i18n/en.json`**

```json
  "hero.badge": "Available for new projects",
```
(permanece)

```json
  "dialog.escToClose": "Press",
```
(permanece)

```json
  "footer.copy": "© {year}. Built with Angular 22 and Tailwind v4, no UI frameworks.",
```
(permanece)

- [ ] **Step 3: Editar `src/app/data/projects.ts` — `imageAlt` cualautocompro**

Reemplazar el `imageAlt` ES:
```ts
    imageAlt: 'Captura del homepage de cualautocompro.cl: hero, comparativa Toyota Corolla vs Mazda CX-5 y sección de features',
```
→
```ts
    imageAlt: 'Captura del homepage de cualautocompro.cl: hero con buscador, comparativa Toyota Corolla vs Mazda CX-5 con columnas de especificaciones y precios, y sección de features con badges de marcas',
```

Reemplazar el `imageAlt` EN:
```ts
        imageAlt: 'Screenshot of cualautocompro.cl homepage: hero, Toyota Corolla vs Mazda CX-5 comparison, and features section',
```
→
```ts
        imageAlt: 'Screenshot of cualautocompro.cl homepage: hero with search bar, Toyota Corolla vs Mazda CX-5 comparison with spec and price columns, and features section with brand badges',
```

- [ ] **Step 4: Editar `src/app/cv/data/cv.data.ts` — `SKILLS_ES` y `SKILLS_EN`**

Reemplazar la categoría "Prácticas" para que nombre herramientas y no solo categorías:

```ts
  {
    category: 'Prácticas',
    items: ['SSR (Angular Universal)', 'SCADA (AVEVA System Platform)', 'Accesibilidad con NVDA / VoiceOver', 'Git', 'SDLC'],
  },
```
→
```ts
  {
    category: 'Prácticas',
    items: ['SSR con Angular Universal', 'SCADA sobre AVEVA System Platform', 'Accesibilidad verificada con NVDA y VoiceOver', 'Git', 'SDLC', 'Pruebas E2E con Playwright'],
  },
```

```ts
  {
    category: 'Practices',
    items: ['SSR (Angular Universal)', 'SCADA (AVEVA System Platform)', 'Accessibility testing with NVDA / VoiceOver', 'Git', 'SDLC'],
  },
```
→
```ts
  {
    category: 'Practices',
    items: ['SSR with Angular Universal', 'SCADA on AVEVA System Platform', 'Accessibility verified with NVDA and VoiceOver', 'Git', 'SDLC', 'End-to-end testing with Playwright'],
  },
```

- [ ] **Step 5: Actualizar tests**

`about.spec.ts` — no cambia (los items de stack en `about.ts` se mantienen como badges de tecnologías, son enumeraciones).

`project-dialog.spec.ts` — los `imageAlt` se validan a través del render. El spec testea que no aparezca "Lo que cambió" y "What changed", pero no verifica el contenido específico del imageAlt (que se carga como atributo de `<img>`, no en `textContent`). Verificar que el render no rompe:

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && npm test -- --run src/app/components/project-dialog/project-dialog.spec.ts 2>&1 | tail -20
```

- [ ] **Step 6: Verificar build y tests**

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && npm test -- --run 2>&1 | tail -50
```
Esperado: todos los tests en verde.

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && npm run build 2>&1 | tail -30
```
Esperado: build sin errores.

- [ ] **Step 7: Commit**

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && git add public/i18n/es.json public/i18n/en.json src/app/data/projects.ts src/app/cv/data/cv.data.ts && git commit -m "copy(sweep 5): specificity — replace vague labels with concrete enumerations"
```

---

## Task 6 — Sweep 6: Emoción contenida

**Files:**
- Modify: `public/i18n/es.json`
- Modify: `public/i18n/en.json`
- Test: `src/app/components/hero/hero.spec.ts`
- Test: `src/app/components/about/about.spec.ts`

**Objetivo:** Orgullo sobrio por el trabajo concreto. Sin "I'm passionate", sin "me obsesionan". Tras este paso revisar Sweep 1 (claridad) y Sweep 4 (prueba).

- [ ] **Step 1: Editar `public/i18n/es.json` — `hero.subtitle`**

El subtitle ya fue reescrito en Sweep 1 a un registro sobrio. Este sweep verifica que no quede emoción exhibida:

```json
  "hero.subtitle": "Soy Patricio Manquepillan, desarrollador frontend con foco en Angular y TypeScript. Estos proyectos resumen los productos donde he crecido en los últimos años. Cada uno incluye una carta del responsable que supervisó el trabajo.",
```
(permanece — ya es sobrio)

- [ ] **Step 2: Editar `public/i18n/en.json` — `hero.subtitle`**

```json
  "hero.subtitle": "I'm Patricio Manquepillan, a frontend developer focused on Angular and TypeScript. These projects summarize the products where I've grown the most in the last few years. Each one includes a letter from the lead who supervised the work.",
```
(permanece — ya es sobrio)

- [ ] **Step 3: Verificar orgullo sobrio en `about.paragraph1`**

El párrafo ya fue reescrito en Sweep 3 anclando orgullo en cifras (50+ plantas, 2M visitas/mes). Permanecer. Solo verificar en consola:

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && grep -n "obsesion\|disfruté\|disfruto\|emocion\|love\|passionate" public/i18n/es.json public/i18n/en.json src/app/data/projects.ts src/app/cv/data/cv.data.ts || echo "CLEAN"
```
Esperado: `CLEAN` o solo coincidencias legítimas (p.ej. "passionate" en carta firmada — debe estar intacto).

- [ ] **Step 4: Tests**

No requieren cambios (no se introdujeron strings nuevos; los sweeps anteriores ya ajustaron aserciones).

- [ ] **Step 5: Verificar build y tests**

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && npm test -- --run 2>&1 | tail -50
```
Esperado: todos los tests en verde.

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && npm run build 2>&1 | tail -30
```
Esperado: build sin errores.

- [ ] **Step 6: Commit**

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && git add public/i18n/es.json public/i18n/en.json && git commit -m "copy(sweep 6): restrained emotion — sober pride anchored in shipped work"
```

---

## Task 7 — Sweep 7: Fricción / CTA

**Files:**
- Modify: `public/i18n/es.json`
- Modify: `public/i18n/en.json`
- (no test changes expected)

**Objetivo:** Eliminar barreras. Email visible, CTAs claros, enlaces a GitHub/LinkedIn/proyectos funcionando.

- [ ] **Step 1: Verificar email visible y CTAs claros**

El email aparece en:
- `nav.email`: `patriciomanquepillantorres@gmail.com` (header)
- `about.paragraph1` (referencia indirecta al producto)
- CV header

El CV (ES/EN) está enlazado desde:
- Hero: `hero.cta.cv` → `/cv-es.pdf` o `/cv-en.pdf`
- Footer: `footer.cvLink` y `footer.cvLinkEn`

Verificación manual de que el patrón existe:

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && grep -n "mailto\|cv-es.pdf\|cv-en.pdf" src/app/components/hero/hero.ts src/app/components/footer/footer.html src/app/components/header/header.html 2>&1 | head -20
```
Esperado: presencia de los tres enlaces.

- [ ] **Step 2: Editar `public/i18n/es.json` — `hero.cta.contact`**

```json
  "hero.cta.contact": "Escríbeme",
```
(permanece — es directo y sobrio)

- [ ] **Step 3: Editar `public/i18n/en.json` — `hero.cta.contact`**

```json
  "hero.cta.contact": "Email me",
```
(permanece — es directo y sobrio)

- [ ] **Step 4: Verificar build y tests**

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && npm test -- --run 2>&1 | tail -50
```
Esperado: todos los tests en verde.

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && npm run build 2>&1 | tail -30
```
Esperado: build sin errores.

- [ ] **Step 5: Commit**

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && git add public/i18n/es.json public/i18n/en.json && git commit -m "copy(sweep 7): friction — verify email, CVs, and external links remain visible"
```

---

## Task 8 — SEO post-sweeps

**Files:**
- Modify: `src/index.html`
- Modify: `src/app/seo/seo.service.ts`
- Modify: `src/app/seo/json-ld.builder.ts`
- Test: `src/app/seo/seo.service.spec.ts`
- Test: `src/app/seo/json-ld.builder.spec.ts`

**Objetivo:** Coherencia entre lo que el sitio dice y lo que los motores pueden leer. Sin keyword stuffing.

- [ ] **Step 1: Editar `src/index.html`**

Reemplazar las tres etiquetas `hreflang` y añadir el `<title>` y la `<meta name="description">` alineados:

```html
  <title>Portafolio — Patricio Manquepillan</title>
```
→
```html
  <title>Patricio Manquepillan — Senior Frontend Developer · Angular · WCAG AA</title>
  <meta name="description" content="Senior Frontend Developer con +6 años en producción. Angular, TypeScript, accesibilidad WCAG AA. Portal institucional con 2M visitas/mes.">
```

```html
  <link rel="alternate" hreflang="es" href="https://patriciomanquepillan.com/">
  <link rel="alternate" hreflang="en" href="https://patriciomanquepillan.com/">
  <link rel="alternate" hreflang="x-default" href="https://patriciomanquepillan.com/">
```
→
```html
  <link rel="canonical" href="https://patriciomanquepillan.com/">
  <link rel="alternate" hreflang="es" href="https://patriciomanquepillan.com/?lang=es">
  <link rel="alternate" hreflang="en" href="https://patriciomanquepillan.com/?lang=en">
  <link rel="alternate" hreflang="x-default" href="https://patriciomanquepillan.com/">
```

Añadir OG tags justo antes de `</head>`:

```html
  <meta property="og:title" content="Patricio Manquepillan — Senior Frontend Developer">
  <meta property="og:description" content="Senior Frontend Developer. Angular, TypeScript, WCAG AA. Portal institucional con 2M visitas/mes.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://patriciomanquepillan.com/">
  <meta property="og:image" content="https://patriciomanquepillan.com/og-default.png">
  <meta property="og:locale" content="es_CL">
  <meta property="og:locale:alternate" content="en_US">
  <meta property="og:site_name" content="Patricio Manquepillan — Portafolio">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Patricio Manquepillan — Senior Frontend Developer">
  <meta name="twitter:description" content="Senior Frontend Developer. Angular, TypeScript, WCAG AA. Portal institucional con 2M visitas/mes.">
  <meta name="twitter:image" content="https://patriciomanquepillan.com/og-default.png">
</head>
```

- [ ] **Step 2: Editar `src/app/seo/seo.service.ts` — `SITE_NAME`**

```ts
const SITE_NAME = 'Patricio Manquepillan — Portafolio';
```
→
```ts
const SITE_NAME = 'Patricio Manquepillan';
```

- [ ] **Step 3: Editar `src/app/seo/json-ld.builder.ts` — `buildPerson` y `buildWebSite`**

Reemplazar `buildPerson`:

```ts
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
```
→
```ts
export function buildPerson(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Patricio Emanuel Manquepillan Torres',
    givenName: 'Patricio Emanuel',
    familyName: 'Manquepillan Torres',
    jobTitle: 'Senior Frontend Developer',
    description:
      'Senior Frontend Developer with 6+ years in production. Angular, TypeScript, WCAG AA accessibility.',
    url: SITE_URL,
    email: 'mailto:patriciomanquepillantorres@gmail.com',
    sameAs: [
      'https://github.com/ptorresmanque',
      'https://www.linkedin.com/in/patriciomanquepillan',
      SITE_URL,
    ],
    knowsAbout: [
      'Angular',
      'TypeScript',
      'RxJS',
      'WCAG AA',
      'Accessibility',
      'SSR',
      'Angular Universal',
      'Kubernetes',
      'Java',
      'Spring Boot',
      'SCADA',
      'AVEVA System Platform',
      'Node.js',
      'Express',
      'Prisma',
      'MySQL',
      'PostgreSQL',
      'Docker',
      'SDLC',
    ],
  };
}
```

Reemplazar `buildWebSite`:

```ts
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
```
→
```ts
export function buildWebSite(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: SITE_URL,
    name: 'Patricio Manquepillan — Portafolio',
    inLanguage: ['es-CL', 'en-US'],
    publisher: {
      '@type': 'Person',
      name: 'Patricio Emanuel Manquepillan Torres',
    },
  };
}
```

- [ ] **Step 4: Actualizar aserciones en `seo.service.spec.ts`**

```ts
  it('setMeta updates title and description', () => {
    service.setMeta({ title: 'Hi', description: 'desc' });
    expect(document.title).toContain('Hi');
    expect(document.title).toContain('Patricio Manquepillan');
```
(la aserción sigue siendo válida con el nuevo SITE_NAME).

- [ ] **Step 5: Actualizar aserciones en `json-ld.builder.spec.ts`**

Reemplazar la aserción de `inLanguage`:

```ts
  it('buildWebSite declares bilingual support', () => {
    const json = buildWebSite();
    expect(json['inLanguage']).toEqual(['es', 'en']);
  });
```
→
```ts
  it('buildWebSite declares bilingual support with locale tags', () => {
    const json = buildWebSite();
    expect(json['inLanguage']).toEqual(['es-CL', 'en-US']);
  });
```

Añadir un test nuevo para `knowsAbout`:

```ts
  it('buildPerson enumerates the stack in knowsAbout', () => {
    const json = buildPerson();
    const knows = json['knowsAbout'] as readonly string[];
    expect(knows).toContain('Angular');
    expect(knows).toContain('TypeScript');
    expect(knows).toContain('WCAG AA');
    expect(knows).toContain('Kubernetes');
    expect(knows).toContain('Spring Boot');
    expect(knows.length).toBeGreaterThanOrEqual(10);
  });
```

- [ ] **Step 6: Verificar build y tests**

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && npm test -- --run 2>&1 | tail -50
```
Esperado: todos los tests en verde.

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && npm run build 2>&1 | tail -30
```
Esperado: build sin errores.

- [ ] **Step 7: Validar JSON-LD contra Schema Markup Validator**

Copiar el output de `buildPerson()` y `buildWebSite()` y validar en https://validator.schema.org/ (verificación manual).

- [ ] **Step 8: Commit**

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && git add src/index.html src/app/seo/seo.service.ts src/app/seo/json-ld.builder.ts src/app/seo/seo.service.spec.ts src/app/seo/json-ld.builder.spec.ts && git commit -m "seo: meta + json-ld + hreflang — align site identity with editorial voice"
```

---

## Verificación final (post-8 commits)

- [ ] **Step 1: Suite completa verde**

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && npm test -- --run 2>&1 | tail -30
```
Esperado: 0 failures.

- [ ] **Step 2: Build SSR verde**

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && npm run build 2>&1 | tail -20
```
Esperado: build sin errores.

- [ ] **Step 3: Regenerar PDF del CV (opcional)**

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && npm run build:full 2>&1 | tail -30
```
Esperado: PDFs regenerados con la nueva copy.

- [ ] **Step 4: Búsqueda de coloquialismos restantes**

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && grep -rn "sin drama\|disfruté\|obsesion\|firmando lo que" public/i18n/ src/app/data/ src/app/cv/ 2>&1 || echo "CLEAN"
```
Esperado: `CLEAN`.

- [ ] **Step 5: Verificar 8 commits en log**

```bash
cd /Users/patriciomanquepillan/Documents/dev/portafolio && git log --oneline -10
```
Esperado: 8 commits con prefijo `copy(sweep N)` o `seo:`.

---

## Notas operativas

- **Tareas en serie:** cada task depende de la anterior (los sweeps son acumulativos). No paralelizar.
- **Revisión post-sweep:** tras commit, releer los archivos modificados en busca de regresiones de sweeps previos (cascada del spec §5).
- **Si un test falla:** ajustar la aserción al texto nuevo en el mismo commit; nunca commit con tests rojos.
- **Si Puppeteer/SSR falla en build:** verificar que no se introdujeron caracteres que rompan JSON (comillas tipográficas, caracteres de control).
