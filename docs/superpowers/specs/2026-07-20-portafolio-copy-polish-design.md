# Pulido editorial del portafolio — Diseño

**Fecha:** 2026-07-20
**Estado:** Aprobado
**Contexto:** El portafolio tiene textos con coloquialismos, claims vagos y mezcla inconsistente de español/inglés. La audiencia objetivo (reclutadores senior, CTOs, headhunters y revisores académicos) exige rigor compartido. Este spec aplica un pulido editorial sistemático sin alterar estructura, dependencias ni diseño visual.

## 1. Contexto y motivación

El portafolio de Patricio Manquepillan es la pieza de presentación profesional principal. Hoy presenta tres problemas que afectan su credibilidad ante audiencia exigente:

1. **Coloquialismos** que rebajan el registro: "me meto en backend sin drama", "lo que más disfruté", "obsesionan dos cosas y media", "su responsable firmando lo que aprendí ahí".
2. **Claims vagos sin cuantificar**: "estos son los productos en los que más he crecido", descripciones que no aterrizan lo construido ni su impacto.
3. **Mezcla inconsistente ES/EN**: algunos textos solo están en español; la cobertura bilingüe es desigual.

La audiencia es dual pero convergente en exigencia:

- **Reclutadores senior / CTOs / headhunters / equipos hiring** — escanean en 30–60 segundos. Buscan seniority real, claims concretos, claridad sobre qué hizo y dónde.
- **Revisores académicos** (papers, conferencias, investigación) — leen con más cuidado. Esperan hedging honesto, metodologías nombradas con precisión, claims apoyados o cualificados.

El objetivo es producir un portafolio que funcione como pieza de élite para ambas audiencias sin sacrificar autenticidad ni voz.

## 2. Audiencia dual

### Audiencia principal: industria técnica

CTOs, headhunters, engineering managers, reclutadores senior de producto. Filtros que aplican al leer:

- Seniority real verificable (años + responsabilidades + escala).
- Stack moderno y actual (Angular 22, SSR, accesibilidad WCAG AA).
- Impacto cuantificable (usuarios, latencia, cobertura, integraciones).
- Compatibilidad cultural y de comunicación.

### Audiencia secundaria: ámbito académico

Profesores, comités de conferencias, revisores de journals o workshops técnicos. Filtros:

- Rigor metodológico en lo que se describe como investigación o exploración.
- Hedging honesto ("explores", "approaches") cuando hay exploración; firmeza cuando hay datos.
- Claims apoyados o cualificados, no inflados.
- Nomenclatura técnica correcta (WCAG AA, no "accesibilidad").

### Implicación para la voz

La voz profesional sobria sirve a ambas audiencias. La coloquial no sirve a ninguna. La precisión técnica con cuantificación sirve a industria; el hedging preciso sirve a academia. La solución es un solo registro: **senior técnico sereno, conciso y directo**, con claims cuantificados o cualificados.

## 3. Perfil de voz objetivo

| Dimensión | Objetivo |
|---|---|
| Registro | Profesional maduro, sin coloquialismos ni jerga decorativa |
| Claims | Cuantificados siempre que sea posible; si no, cualificados con honestidad |
| Voz | Primera persona sobria en cartas/About; impersonal en CV |
| Emoción | Contenida — orgullo por el trabajo bien hecho, no por la persona |
| Jerga | Permitida cuando es precisa (WCAG AA, SSR, SCADA); eliminada cuando es decorativa |
| Hedging | "Approaches", "explores" en academia; firme cuando hay datos concretos |
| Densidad | Alta — cada frase lleva información; cero filler |
| Longitud | Concisa — sin expandir; lo que sobra se corta |

**Cambios concretos de registro:**

- "me meto en backend sin drama" → acción directa, sin dramatización
- "lo que más disfruté" → qué se construyó y por qué importa
- "obsesionan dos cosas y media" → qué se persigue y con qué método
- "estos son los productos en los que más he crecido" → qué productos y qué se aprendió
- Primera persona cálida/coloquial → primera persona sobria y directa

## 4. Inventario de textos

### Archivos en alcance

| Archivo | Contenido |
|---|---|
| `public/i18n/es.json` | Textos UI completos en español |
| `public/i18n/en.json` | Textos UI completos en inglés |
| `src/app/data/projects.ts` | `shortDescription`, `body`, `letter.paragraphs`, `imageAlt`, `localized.en` |
| `src/app/cv/data/cv.data.ts` | `EXPERIENCE_ES/EN`, `SKILLS_ES/EN`, summary, education, languages |
| `src/app/cv/cv.component.html` | Headers hardcoded ("Resumen"/"Summary", "Stack:", etc.) |
| `src/index.html` | `<title>`, meta description, OG tags |
| `src/app/seo/seo.service.ts` | `SITE_NAME`, meta descriptions por ruta |
| `src/app/seo/json-ld.builder.ts` | JSON-LD Person, WebSite, breadcrumbs |
| `src/app/components/header/header.html` | Subheader "/ developer" |
| `src/app/components/about/about.ts` | Array `stack` (solo etiquetas de tono, no nombres técnicos) |

### Preservar obligatoriamente

- Placeholders en keys i18n: `{years}`, `{title}`, `{company}` (no añadir ni eliminar)
- Estructura de datos de `projects.ts` (tipos `Project`, `ProjectLetter` intactos)
- Esqueletos HTML/CSS/Tailwind (no cambiar marcas ni clases)
- Convenciones de nombres (`SITE_NAME`, `EXPERIENCE_ES`, `stack`, etc.)

### Tests a actualizar (aserciones, no lógica)

| Test | Aserciones a actualizar |
|---|---|
| `src/app/app.spec.ts` | Textos del hero, about, footer |
| `src/app/components/hero/hero.spec.ts` | Subtítulo, CTAs |
| `src/app/components/about/about.spec.ts` | Descripción, stack |
| `src/app/cv/data/cv.data.spec.ts` | Conteos, keywords en bullets, summary |
| `src/app/cv/cv.component.spec.ts` | Headers renderizados, idioma condicional |
| `src/app/components/project-card/project-card.spec.ts` | Títulos, descripciones cortas |
| `src/app/components/project-dialog/project-dialog.spec.ts` | Descripción, body, carta |
| `src/app/seo/seo.service.spec.ts` | `SITE_NAME`, descripciones |
| `src/app/seo/json-ld.builder.spec.ts` | `@type`, `name`, `jobTitle`, `knowsAbout`, `alumniOf` |

## 5. Los 7 sweeps aplicados — guía operativa

Cada sweep modifica textos con criterio explícito. Tras cada sweep se vuelve a verificar los anteriores (cascada). Las prioridades reflejan que academia exige más rigor en prueba y especificidad.

### Sweep 1 — Claridad (ALTA)

**Objetivo:** el lector entiende sin releer.

Operación:

- Eliminar pronombres ambiguos.
- Quitar hedging vacío ("básicamente", "en realidad", "de hecho").
- Reestructurar frases que dicen dos cosas.
- Verificar regla de una idea por sección y "you/reader rule" (escribir hacia el lector cuando aplica; primera persona sobria en About y cartas).

Salida esperada: cada frase se entiende a primera lectura.

### Sweep 2 — Voz y tono (ALTA)

**Objetivo:** un único registro de principio a fin.

Operación:

- Eliminar coloquialismos: "sin drama", "lo que más disfruté", "obsesionan", "firmando lo que aprendí ahí", "estos son los productos en los que más he crecido".
- Eliminar mezcla casual ↔ corporate sin transición.
- Unificar primera persona sobria en About/cartas.
- Mantener impersonal en CV.

Salida esperada: la voz suena a la misma persona en cada sección.

### Sweep 3 — So What (ALTA)

**Objetivo:** cada claim lleva al lector a "y eso importa porque…".

Operación:

- Por cada bullet de experiencia, añadir el puente de impacto: "Construí X" → "Construí X, lo que redujo Y a Z".
- Por cada capacidad listada en About, anclar a un producto o resultado del CV.
- Eliminar claims cuyo "so what" sea vacío.

Salida esperada: ningún claim flota; cada uno aterriza en una consecuencia concreta.

### Sweep 4 — Prueba (CRÍTICA para academia)

**Objetivo:** todo claim cuantificable o cualificable.

Operación:

- Reemplazar "muchos usuarios" → número concreto o rango honesto.
- Reemplazar "mejora de rendimiento" → métrica con unidad.
- Añadir fecha o período cuando el dato lo requiera.
- Si no hay dato: cualificar con honestidad ("used in production since…", "scaled to…").

Salida esperada: un revisor académico no encuentra claims sin respaldo.

### Sweep 5 — Especificidad (CRÍTICA para academia)

**Objetivo:** los detalles son concretos, no genéricos.

Operación:

- Reemplazar verbos vagos: "mejorar" → "reducir", "aumentar", "consolidar".
- Sustituir "varias plataformas" por número o nombres propios.
- Sustituir "stack moderno" por stack enumerado.
- Eliminar adjetivos que no añaden información.

Salida esperada: copy que no podría aplicarse a cualquier otro candidato.

### Sweep 6 — Emoción contenida (BAJA)

**Objetivo:** orgullo por el trabajo, no por la persona.

Operación selectiva (no en toda la copy):

- Permitido: orgullo sobrio por construir un sistema accesible que se volvió estándar, por llevar +50 plantas al nuevo SCADA.
- No permitido: "I'm passionate about…", "I love building…", "obsesionan dos cosas y media".
- Tras este sweep, revisar Sweep 1 (claridad) y Sweep 4 (prueba).

Salida esperada: emoción calibrada — el trabajo habla, la persona no se exhibe.

### Sweep 7 — Fricción / CTA (BAJA)

**Objetivo:** eliminar barreras que aún queden.

Operación:

- Verificar que el email de contacto es el correcto y está visible.
- Verificar que los CTAs "Descargar CV (ES/EN)" funcionan con los PDFs generados por el spec previo.
- Verificar que los enlaces a GitHub/LinkedIn/proyectos están visibles y sin fricción.

Salida esperada: el recorrido del visitante profesional no encuentra fricción.

### Cascada entre sweeps

Tras cada sweep (1–7), revisar los sweeps anteriores:

- Tras Sweep 2, releer Sweep 1.
- Tras Sweep 3, releer 1–2.
- Tras Sweep 4, releer 1–3.
- Tras Sweep 5, releer 1–4.
- Tras Sweep 6, releer 1 y 4 (riesgo de inflar emoción pierde claridad y prueba).
- Tras Sweep 7, recorrido completo 1–6.

## 6. Paso 8 — Revisión SEO post-sweeps

SEO al servicio del contenido. Sin keyword stuffing. Lo que se optimiza es la coherencia entre lo que el sitio dice y lo que los motores pueden leer.

### Cambios SEO

| Archivo | Cambio |
|---|---|
| `src/index.html` | `<title>` y `<meta name="description">` alineados con la voz final; OG tags (`og:title`, `og:description`, `og:type`, `og:url`, `og:locale`) y Twitter card |
| `src/index.html` | `<link rel="alternate" hreflang="es" href="…/es">` y `hreflang="en" href="…/en">`; `x-default` |
| `src/app/seo/seo.service.ts` | `SITE_NAME` y descripciones por ruta sincronizadas con la nueva copy |
| `src/app/seo/json-ld.builder.ts` | JSON-LD `Person` con `jobTitle`, `knowsAbout`, `alumniOf`, `sameAs`; `WebSite` con `inLanguage`; breadcrumbs si aplica |

### Reglas

- Sin añadir keywords redundantes al texto visible.
- Descriptions ≤ 160 caracteres, alineadas con la voz sobria.
- `knowsAbout` poblado con el stack del CV (Angular, TypeScript, RxJS, etc.).
- `alumniOf` queda vacío si no se nombra institución (decisión previa del usuario: "Formación técnica en ingeniería informática (estudios parciales)" sin institución).
- `sameAs` con LinkedIn, GitHub, sitio.

## 7. Estrategia de commits

8 commits totales para mantener granularidad y revertiribilidad:

1. **Sweep 1 — Claridad**: reescritura eliminando ambigüedades y frases compuestas.
2. **Sweep 2 — Voz y tono**: eliminación de coloquialismos, unificación de registro.
3. **Sweep 3 — So What**: añadir puentes de impacto a bullets de experiencia y About.
4. **Sweep 4 — Prueba**: cuantificar o cualificar todos los claims.
5. **Sweep 5 — Especificidad**: reemplazar vagos por concretos.
6. **Sweep 6 — Emoción contenida**: orgullo sobrio donde aplique.
7. **Sweep 7 — Fricción**: revisar CTAs, enlaces, email, CVs.
8. **SEO**: meta tags, OG, hreflang, JSON-LD.

Convención de mensaje: `copy(sweep N): <descripción corta>` para 1–7; `seo: meta + json-ld + hreflang` para 8.

Cada commit actualiza los tests correspondientes y mantiene `npm test` en verde.

## 8. Criterios de aceptación

- `npm test` en verde tras cada sweep.
- `npm run build` sin errores ni warnings nuevos.
- `npm run build:full` regenera los PDFs del CV con la nueva copy.
- Búsqueda manual: ningún coloquialismo del inventario original sobrevive.
- Búsqueda manual: cada claim de bullets de experiencia aterriza en un "so what".
- JSON-LD valida en el Schema Markup Validator.
- `<title>` y meta description únicos por ruta y por idioma.

## 9. Tests a actualizar

Plantilla: tras cada sweep, ajustar aserciones de los tests afectados. No añadir tests nuevos (fuera de alcance). No eliminar cobertura existente.

Mapeo de tests por sweep (orientativo):

- Sweeps 1–2 afectan a todos los tests (cambios de cadena).
- Sweeps 3–5 afectan especialmente a `cv.data.spec.ts`, `project-card.spec.ts`, `project-dialog.spec.ts`, `about.spec.ts`.
- Sweeps 6–7 afectan a `hero.spec.ts` y a `app.spec.ts`.
- SEO afecta a `seo.service.spec.ts` y `json-ld.builder.spec.ts`.

## 10. Fuera de alcance

- Cambios visuales, refactors de CSS/Tailwind.
- Refactors estructurales (componentes, servicios, signals).
- Nuevas secciones o componentes.
- Nuevas dependencias npm.
- Nuevos idiomas.
- Cambio de stack o migraciones técnicas.
- Reescritura del CV más allá de los textos (layout, formato Harvard ya definido en spec previo).

## 11. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Reescritura bilingüe pierde paridad semántica | Cada sweep incluye verificación cruzada ES↔EN; tests de paridad en `cv.data.spec.ts` |
| Hedging excesivo suena dubitativo para industria | Calibrar por sección: firme en CV, hedging solo donde hay exploración real |
| Emoción contenida puede parecer plana | Permitir orgullo sobrio por trabajo concreto; no por la persona |
| SEO adds keyword stuffing | Limitar SEO a tags y structured data; no añadir keywords al copy visible |
| Tests quedan desactualizados tras cambios de cadena | Actualizar aserciones en el mismo commit que cada sweep |