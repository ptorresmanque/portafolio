# CV descargable en formato Harvard — Diseño

**Fecha:** 2026-07-20
**Estado:** Aprobado
**Contexto:** El portafolio ya tiene dos botones ("Descargar CV" en hero, "CV (ES)" / "CV (EN)" en footer) que apuntan a `/cv-es.pdf` y `/cv-en.pdf`, pero los archivos no existen. Este spec cierra ese hueco generando dos CVs de 1 página A4 en formato Harvard a partir de un componente Angular renderizado con Puppeteer.

## 1. Objetivo

Generar dos archivos PDF (`/cv-es.pdf` y `/cv-en.pdf`) que sean la versión descargable y compartible del CV de Patricio Manquepillan, en formato Harvard clásico (1 página A4, una columna densa, educación + experiencia + skills + idiomas + referencias), generados de forma reproducible en el build del portafolio.

## 2. Decisiones de alcance

| Decisión | Elección | Motivo |
|---|---|---|
| Idiomas | Español + inglés (dos PDFs) | Mantiene contrato actual de los botones del hero y footer |
| Páginas | 1 página A4 por idioma | Estilo Harvard clásico; el contenido cabe en 1 página con la densidad elegida |
| Layout | Una columna densa | Maximiza densidad en 1 página; encaja con perfil senior con experiencia amplia |
| Foto | No incluir | Estilo Harvard clásico; evita sesgos visuales |
| Educación | "Formación técnica en ingeniería informática (estudios parciales)" | Usuario eligió educación parcial genérica sin institución ni años |
| Generación | Componente Angular + script Puppeteer post-build | Encaja con el stack, con el spec previo de "mejora completa", y permite una sola fuente de verdad (el componente) editable |
| Datos personales | Email, teléfono, LinkedIn, GitHub, sitio | Sin ubicación por privacidad (decisión del usuario) |

## 3. Arquitectura y archivos

### Archivos nuevos

```
src/app/cv/
  cv.component.ts          ← standalone component (selector: app-cv)
  cv.component.html        ← template único con @if (lang === 'es') condicionales
  cv.component.css         ← estilos print-friendly (A4, 1 página)
  cv.routes.ts             ← rutas /es/cv y /en/cv
  cv.component.spec.ts     ← tests del componente (render ES/EN, i18n)
src/app/cv/data/
  cv.data.ts               ← fuente de verdad con contenido ES + EN
  cv.data.spec.ts          ← tests de integridad de datos
scripts/
  generate-cv.mjs          ← script Puppeteer post-build
```

### Archivos modificados

- `package.json`: agrega `"cv": "node scripts/generate-cv.mjs"` y `"build:full": "npm run build && npm run cv"`
- `angular.json`: ajusta el builder `build` para que encadene el script `generate-cv.mjs` tras la generación de bundles (configuración `architect.build.configurations.production.postbuild` o equivalente; si no es soportado por el builder, se documenta el flujo `build:full`)

> **Decisión final sobre el encadenamiento:** el builder `@angular/build` v22 no soporta un hook `postbuild` nativo de forma estable. Se opta por el script npm `build:full` que encadena `ng build` + `node scripts/generate-cv.mjs`. El script npm `cv` se mantiene como entrada independiente para regenerar los PDFs sin re-buildear Angular.

### Archivos generados (no commiteados al repo)

- `dist/portafolio/browser/cv-es.pdf`
- `dist/portafolio/browser/cv-en.pdf`

## 4. Componente Angular (`CvComponent`)

### Inputs

- `lang: 'es' | 'en'` — vía `ActivatedRoute` param `lang`

### Selector

- `app-cv` (sigue la convención del proyecto)

### Datos

El componente lee de `cv.data.ts`, que exporta:

```ts
export interface CvData {
  header: {
    name: string;
    contact: { label: string; value: string; href: string }[];
    tagline: string;
  };
  summary: string;
  experience: {
    company: string;
    role: string;
    period: string;
    location?: string;
    bullets: string[];
    stack?: string[];
  }[];
  education: { degree: string; institution?: string; period?: string; note?: string }[];
  skills: { category: string; items: string[] }[];
  languages: { name: string; level: string }[];
  referencesNote: string;
}

export const CV: Record<'es' | 'en', CvData> = { es: {...}, en: {...} };
```

### Template (HTML)

Estructura una columna:

```
[Header]
  Nombre (h1, 22pt, bold)
  Línea de contacto (icono + valor, bullets, 8.5pt)

[Resumen] (2-3 líneas, 9.5pt)

[Experiencia profesional] (h2 11pt uppercase tracked)
  Por cada item:
    grid de 2 columnas: izquierda (empresa + período, 8.5pt gris) | derecha (rol + bullets + stack, 9.5pt)

[Educación] (h2 11pt uppercase tracked)
  Una línea: "Formación técnica en ingeniería informática (estudios parciales)"

[Habilidades técnicas] (h2 11pt uppercase tracked)
  4 bloques inline:
    Categoría: items separados por comas

[Idiomas] (h2 11pt uppercase tracked)
  Español — Nativo | Inglés — B2 (MCER)

[Referencias] (centrado, 8.5pt, gris)
  Disponibles bajo petición
```

## 5. Estilos (`cv.component.css`)

```css
@page { size: A4 portrait; margin: 0; }

:host {
  /* A4 portrait, 12mm margins */
  width: 210mm;
  min-height: 297mm;
  padding: 12mm;
  box-sizing: border-box;
  font-family: 'Archivo', system-ui, sans-serif;
  color: #0a0a0a;
  background: #ffffff;
  font-size: 9.5pt;
  line-height: 1.4;
  display: block;
}

.name { font-size: 22pt; font-weight: 700; letter-spacing: -0.01em; }
.accent-line { height: 2px; background: #1f2937; margin: 4mm 0 6mm; }
.contact-line { font-size: 8.5pt; color: #4b5563; display: flex; gap: 6mm; flex-wrap: wrap; }
.section-title { font-size: 11pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin: 5mm 0 2mm; border-bottom: 0.5pt solid #d1d5db; padding-bottom: 1mm; }
.experience-row { display: grid; grid-template-columns: 50mm 1fr; gap: 4mm; margin-bottom: 3mm; page-break-inside: avoid; }
.experience-meta { font-size: 8.5pt; color: #4b5563; }
.experience-bullets { margin: 0; padding-left: 4mm; }
.experience-bullets li { margin-bottom: 1mm; }
.skill-block { margin-bottom: 1.5mm; }
.skill-category { font-weight: 600; }
.refs-note { text-align: center; font-size: 8.5pt; color: #6b7280; margin-top: 5mm; }
```

Notas:
- Usa Archivo, que ya está self-hosteado y subsetado en `public/fonts/`
- Sin emojis ni iconos decorativos; tipografía consistente
- `page-break-inside: avoid` en cada fila de experiencia para no romper entre páginas

## 6. Contenido del CV (fuente de verdad `cv.data.ts`)

### Datos comunes (ES y EN)

**Header:**
- Nombre: Patricio Emanuel Manquepillan Torres
- Contacto:
  - Email: patriciomanquepillantorres@gmail.com (mailto:)
  - Teléfono: +56 962575863 (tel:)
  - LinkedIn: www.linkedin.com/in/patricio-manquepillan-torres
  - GitHub: github.com/ptorresmanque
  - Web: cualautocompro.cl

**Resumen (ES):**
"Senior Frontend Developer con +6 años en producción. Angular lead con foco en accesibilidad WCAG AA y sistemas con cientos de miles de usuarios. Cuando hace falta, se mete en backend sin drama."

**Resumen (EN):**
"Senior Frontend Developer with 6+ years in production. Angular lead focused on WCAG AA accessibility and products used by hundreds of thousands of people. When needed, I jump into backend without drama."

**Experiencia (orden cronológico inverso):**

1. **Comunidad de Madrid** — Frontend developer · 2025 — actualidad
   - Frontend en un equipo de 12 personas en el portal institucional con 2M visitas/mes
   - Construí una librería accesible (combobox, modal con focus trap, navegación por teclado) que se convirtió en estándar interno
   - Optimicé SSR con Angular Universal hasta TTFB < 200 ms en los 200 trámites más consultados
   - Stack: Angular, micro front ends, Capacitor, TypeScript, PostgreSQL, Jenkins

2. **Banco Santander España (vía NTT Data)** — Fullstack developer · abr 2022 — abr 2025
   - Sistema automatizado de backstops crediticios con motor de reglas configurable y reporting regulatorio (iniciativa conjunta con la UE)
   - Evolucioné de frontend Angular a gestionar y desplegar microservicios backend en Java + Spring Boot
   - Plataforma sobre Kubernetes con escalado automático y despliegues sin downtime
   - Stack: Angular, Java, Spring Boot, Kubernetes

3. **Aguas Nuevas S.A.** — Frontend / SCADA Developer / DBA · 2019 — 2022
   - Unifiqué la telemetría y los SCADA de 4 empresas del grupo (Aguas Altiplano, Chañar, Araucanía, Magallanes) en una sola plataforma
   - Migré más de 50 plantas al nuevo SCADA sobre AVEVA System Platform, incluida la desalinizadora de Iquique
   - Construí la app web de visualización con Angular + Spring Boot y entrené a operarios en su uso
   - Stack: AVEVA System Platform, Oracle SQL, Angular, Spring Boot, Python, Highcharts

4. **cualautocompro.cl (proyecto personal)** — Owner · 2026
   - Catálogo del mercado automotriz chileno con búsqueda, comparación y sharing de comparativas
   - Diseño y construyo el ciclo completo: scraping, modelo de datos, backend, frontend
   - Stack: Angular 22, Angular Material, Express, Prisma, MySQL, Tailwind CSS, Playwright

(Las versiones EN son traducción fiel, manteniendo fechas y métricas.)

**Educación:**
- ES: "Formación técnica en ingeniería informática (estudios parciales)"
- EN: "Technical education in computer engineering (incomplete studies)"

**Habilidades técnicas (comunes ES y EN, etiquetas traducidas):**

ES:
- Frontend: Angular, TypeScript, RxJS, Tailwind CSS, accesibilidad WCAG AA
- Backend: Java, Spring Boot, Node.js, Express, REST
- Datos e infra: Kubernetes, Oracle SQL, MySQL, Prisma, Docker
- Prácticas: SSR (Angular Universal), SCADA (AVEVA System Platform), accesibilidad con NVDA / VoiceOver, Git, SDLC

EN:
- Frontend: Angular, TypeScript, RxJS, Tailwind CSS, WCAG AA accessibility
- Backend: Java, Spring Boot, Node.js, Express, REST
- Data & infra: Kubernetes, Oracle SQL, MySQL, Prisma, Docker
- Practices: SSR (Angular Universal), SCADA (AVEVA System Platform), accessibility testing with NVDA / VoiceOver, Git, SDLC

**Idiomas (comunes):**
- Español — Nativo
- Inglés — B2 (MCER)

**Referencias:**
- ES: "Disponibles bajo petición"
- EN: "References available upon request"

## 7. Script de generación (`scripts/generate-cv.mjs`)

### Flujo

1. Verificar que `dist/portafolio/browser/index.html` existe. Si no, `console.error` + `process.exit(1)` con mensaje: "Ejecuta `npm run build` antes de generar el CV."
2. Lanzar un servidor estático simple sobre `dist/portafolio/browser/` en puerto aleatorio (o 4321 fijo).
3. Esperar a que el server responda (timeout 30s, polling cada 200ms).
4. Lanzar Puppeteer (`puppeteer-core` con `executablePath` de Chrome del sistema, o `puppeteer` con Chromium descargado).
5. Para cada idioma (`es`, `en`):
   - `page.goto('http://localhost:4321/<lang>/cv', { waitUntil: 'networkidle0' })`
   - Esperar `await page.waitForSelector('app-cv')`
   - Esperar 200ms extra para que carguen fonts (Archivo).
   - `await page.pdf({ path: 'dist/portafolio/browser/cv-<lang>.pdf', format: 'A4', printBackground: true, margin: { top: '0', right: '0', bottom: '0', left: '0' }, preferCSSPageSize: true })`
6. Extraer texto de cada PDF con `pdf-parse` o `pdfjs-dist` y verificar keywords ("Patricio", "Angular", "Comunidad de Madrid", "Santander", etc.).
7. Cerrar Puppeteer y el server estático.
8. Reportar tamaño de cada PDF en consola. Si < 10 KB, `console.warn` y `process.exit(2)`.

### Dependencias nuevas

- `puppeteer` (devDependency, ~300 MB con Chromium)

### Limitaciones conocidas

- En CI (sin Chrome), el script puede usar `puppeteer` con Chromium descargado o requerir variable `CHROME_PATH`.
- Si el build se hace en un host sin permisos para ejecutar Chromium, documentar fallback con `chrome-headless-shell`.

## 8. Rutas

```
/es/cv → renderiza CvComponent con lang='es'
/en/cv → renderiza CvComponent con lang='en'
```

Las rutas son internas (no se enlazan desde la navegación del portafolio). Sirven solo al script Puppeteer. Sin embargo, son accesibles si alguien las escribe en el browser (útil para debug).

## 9. Verificación

### Tests unitarios (Vitest)

- `cv.component.spec.ts`:
  - Renderiza con `lang='es'` y verifica que el header, contacto, secciones, experiencia aparecen en español
  - Renderiza con `lang='en'` y verifica lo mismo en inglés
  - Verifica que la versión ES no contiene las keywords de la versión EN y viceversa (sanity check i18n)
- `cv.data.spec.ts`:
  - Verifica que `CV.es` y `CV.en` tienen 4 entradas de experiencia
  - Verifica que ninguna entrada tiene campos vacíos críticos (empresa, rol, período, al menos 1 bullet)
  - Verifica que las skills tienen 4 categorías en cada idioma
  - Verifica que ambos idiomas comparten la misma cantidad de items en skills, languages, experience

### Tests de humo del script

- El script `generate-cv.mjs` verifica post-generación:
  - Ambos archivos existen en `dist/portafolio/browser/cv-{es,en}.pdf`
  - Tamaño > 10 KB
  - Texto extraído contiene keywords esperadas

### Verificación manual final

- Abrir ambos PDFs en un visor y validar visualmente:
  - Caben en 1 página A4 sin overflow
  - Links activos (mailto:, tel:, linkedin, github, cualautocompro.cl)
  - Tipografía Archivo renderiza correctamente (no fallback a sans-serif del sistema)

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Puppeteer descarga ~300 MB de Chromium en `npm install` | Documentar en README; ofrecer variable `PUPPETEER_SKIP_DOWNLOAD=true` para hosts con Chrome propio |
| Fuentes Archivo no cargan a tiempo al generar PDF | Espera explícita `networkidle0` + 200ms extra antes de `page.pdf()` |
| Cambiar el contenido requiere re-build completo | Aceptable: el CV se regenera solo en release; el flujo dev sigue siendo editar `cv.data.ts` y refrescar `/es/cv` |
| PDFs no se commitean al repo (se generan) | Documentado en `.gitignore` (`dist/`) y en spec; el deploy debe correr `build:full` |
| Contenido se vuelve outdated respecto al portafolio | Sincronización manual: revisar `cv.data.ts` cada vez que se actualicen proyectos en `src/app/data/projects.ts` |
| Educación parcial genérica puede parecer vaga | Es lo que el usuario eligió explícitamente; alternativa futura: añadir formación online relevante (cursos, etc.) si los hay |

## 11. Out of scope

- No se hace CV multi-página ni carta de presentación adjunta
- No se rediseñan los botones existentes (mantener "Descargar CV" en hero y "CV (ES)" / "CV (EN)" en footer tal como están)
- No se añade vista web pública del CV (las rutas `/es/cv` y `/en/cv` existen pero no se enlazan desde la navegación)
- No se sube a sobre de LinkedIn ni se integra con APIs externas