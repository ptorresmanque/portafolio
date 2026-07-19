# Mejora completa del portafolio — Design Spec

**Fecha:** 2026-07-19
**Estado:** Aprobado por el usuario (pendiente review del spec escrito)
**Dominio:** `https://patriciomanquepillan.com`
**Stack actual:** Angular 22 standalone + Tailwind v4, SPA estática en cPanel vía GitHub Actions

---

## 1. Contexto y objetivos

### Situación actual

El portafolio de Patricio Manquepillan es una SPA Angular 22 de una sola página, deployada a cPanel vía GitHub Actions. Tiene estructura clara (Header → Hero → About → Projects → Footer), 4 proyectos con cartas de recomendación visibles en modal, sin enrutamiento, sin i18n, sin prerender, sin JSON-LD, sin sitemap, sin analytics. Está en español.

### Objetivos

Convertir el portafolio en una pieza competitiva para captar **empleo remoto bien pagado** y **clientes freelance**, maximizando discoverability en búsqueda clásica (Google) y en LLMs (ChatGPT, Perplexity, Claude), con rendimiento accesible y contenido bilingüe.

### No-objetivos

- No se agrega Angular Router. La navegación entre secciones sigue siendo con anchors.
- No se reescribe visualmente. La identidad actual (Archivo + Space Grotesk, paleta, layout) se mantiene.
- No se migra a otro framework ni hosting.
- No se agrega blog ni formulario de contacto (fuera de alcance para esta mejora).

---

## 2. Decisiones de alcance tomadas con el usuario

| Decisión | Elección |
|---|---|
| Dimensión de la mejora | Plan completo e integral (SEO + contenido + performance + accesibilidad + arquitectura) |
| Objetivo principal | Empleo + freelance (mixto) |
| Idioma | Bilingüe ES + EN con hreflang (sin URLs separadas) |
| Arquitectura de rutas | Mantener SPA con modal (sin Router) |
| Rendering | SSG con prerender (`@angular/ssr`) |
| Contenido nuevo | Solo CV descargable (PDF ES + PDF EN) |
| Enfoque | A. Incremental sólido (recomendado) |

---

## 3. Arquitectura y stack

### Lo que se mantiene

- Angular 22 standalone components + signals
- Tailwind v4 sin frameworks de UI
- SPA con modal para detalle de proyectos
- Deploy a cPanel vía GitHub Actions (pipeline en `.github/workflows/`)
- Idioma base: español

### Lo que se agrega al stack

| Capa | Cambio | Justificación |
|---|---|---|
| Rendering | `@angular/ssr` en modo **prerender** | HTML completo en `index.html` → mejor LCP y SEO sin cambiar el hosting estático |
| i18n | `TranslationService` (signals) + `TranslationPipe` + JSON `es.json`/`en.json` en `public/i18n/` | Sin Router: persistencia en `localStorage`, detección por `navigator.language` |
| SEO | `Meta` + `Title` services de Angular, `SeoService` que inyecta JSON-LD, `sitemap.xml` y `robots.txt` en `public/` | Cobertura completa de search engines y LLMs |
| Imágenes | `sharp` (ya presente) → generar AVIF/WebP responsive | Reduce LCP drásticamente |
| Fuentes | Self-host de Archivo + Space Grotesk como subset WOFF2 con `font-display: swap` | Eliminar Google Fonts elimina render-blocking + problema de privacidad |
| Analytics | Plausible (~$9/mes) o Umami self-hosted | Cero cookies, sin banner de consentimiento |
| CV | PDF generado a build-time con Puppeteer + página web que es fuente de verdad | Compartible, descargable, en dos idiomas |

### Nuevas dependencias npm

- `@angular/ssr` (prerender)
- `puppeteer` (devDependency, generación de CV)
- `@types/puppeteer` (devDependency)

Sin otras dependencias nuevas: TranslationPipe, LangToggle, SeoService son custom.

---

## 4. i18n ES/EN sin Router

### Patrón

SPA single-URL. Idioma persistido en cliente. Default: español.

### Flujo

1. **Bootstrap:** `TranslationService` lee en orden: `localStorage['preferred-lang']` → `navigator.language.slice(0, 2)` → `'es'` (fallback).
2. **Signal global:** `lang = signal<'es' | 'en'>('es')`. Cualquier componente lo lee vía `TranslationPipe` o `t('key')` del servicio.
3. **Toggle:** `LangToggle` component en el header. Al cambiar: actualiza el signal, persiste en `localStorage`, actualiza `<html lang>`, `<title>` y meta description vía `effect()`.
4. **Carga de JSON:** `fetch('/i18n/<lang>.json')` lazy la primera vez, cacheado en memoria. Cada archivo pesa ~5 KB.
5. **Estructura de traducciones:** objeto plano `Record<string, string>` sin anidamiento profundo (mantiene simple la búsqueda).

### Estructura de archivos

```
public/i18n/
├── es.json
└── en.json
src/app/i18n/
├── translation.service.ts
├── translation.pipe.ts
└── lang-toggle.component.ts
```

### Ejemplo de uso en template

```html
<h1>{{ 'hero.title.line1' | t }}<br />
<span class="text-accent">{{ 'hero.title.highlight' | t }}</span><br />
{{ 'hero.title.line2' | t }}</h1>
```

### Hreflang (sin Router)

```html
<link rel="alternate" hreflang="es" href="https://patriciomanquepillan.com/" />
<link rel="alternate" hreflang="en" href="https://patriciomanquepillan.com/" />
<link rel="alternate" hreflang="x-default" href="https://patriciomanquepillan.com/" />
```

Ambos idiomas comparten URL. Google infiere el contenido desde el HTML renderizado (idioma por defecto: es). Patrón aceptado por Google para sitios single-page multi-idioma.

### Lo que se traduce

- Copy visible (hero, about, projects, footer)
- Meta description y OG descriptions
- JSON-LD strings (alt texts, roles, descriptions)
- CV PDF: dos archivos `cv-es.pdf` y `cv-en.pdf`, elegidos según el idioma activo al hacer click

### Lo que NO se traduce

- URLs (siguen siendo `#proyectos`, `#sobre-mi`)
- Nombres propios de empresas (Aguas Nuevas, Santander, NTT Data, Comunidad de Madrid)
- Tecnologías (Angular, TypeScript, AVEVA, etc.)
- Identificadores de proyectos en eventos analytics (`telemetria-2-0` siempre en ese slug)

---

## 5. SEO técnico

### Meta tags dinámicos

Inyectados vía `Meta` + `Title` services de Angular, actualizados con `effect()` cuando cambia el idioma:

```html
<title>{{ t('meta.title') }} — Patricio Manquepillan</title>
<meta name="description" content="{{ t('meta.description') }}" />
<meta name="author" content="Patricio Manquepillan" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<link rel="canonical" href="https://patriciomanquepillan.com/" />
<meta name="theme-color" content="#2563EB" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://patriciomanquepillan.com/" />
<meta property="og:title" content="{{ t('meta.title') }}" />
<meta property="og:description" content="{{ t('meta.description') }}" />
<meta property="og:image" content="https://patriciomanquepillan.com/og-default.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="es_CL" />
<meta property="og:locale:alternate" content="en_US" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{{ t('meta.title') }}" />
<meta name="twitter:description" content="{{ t('meta.description') }}" />
<meta name="twitter:image" content="https://patriciomanquepillan.com/og-default.png" />
```

### JSON-LD estructurado

Inyectado por `SeoService` como `<script type="application/ld+json">`. Cuatro bloques:

**1) Person (identidad):**
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Patricio Manquepillan",
  "jobTitle": "Senior Frontend Developer",
  "url": "https://patriciomanquepillan.com",
  "sameAs": [
    "https://github.com/ptorresmanque",
    "https://www.linkedin.com/in/patriciomanquepillan"
  ],
  "knowsAbout": ["Angular", "TypeScript", "SCADA", "WCAG", "Kubernetes"],
  "worksFor": [...]
}
```

**2) WebSite (sitio raíz):**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://patriciomanquepillan.com",
  "name": "Patricio Manquepillan — Portafolio",
  "inLanguage": ["es", "en"]
}
```

**3) CreativeWork por proyecto** (con `review` anidada = la carta de recomendación):
```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Telemetría 2.0",
  "author": {"@type": "Person", "name": "Patricio Manquepillan"},
  "review": {
    "@type": "Review",
    "author": {"@type": "Person", "name": "Michael Bórquez"},
    "reviewBody": "..."
  }
}
```

**4) BreadcrumbList:**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://patriciomanquepillan.com/" }
  ]
}
```

### sitemap.xml

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
  </url>
  <url>
    <loc>https://patriciomanquepillan.com/cv-en.pdf</loc>
  </url>
</urlset>
```

### robots.txt

```
User-agent: *
Allow: /

Sitemap: https://patriciomanquepillan.com/sitemap.xml
```

### OG image

- `og-default.png` 1200×630, generado con `sharp` al build, incluyendo nombre + título + un detalle visual de marca.
- OG por proyecto: opcional (no se hace en este plan; los OG dinámicos con cambio de meta por modal no son efectivos para crawlers sociales porque previsualizan la URL, no el estado del DOM).

---

## 6. Performance (Core Web Vitals)

### LCP (target < 2.5s)

- **Prerender:** HTML completo en el primer byte.
- **Self-host de fuentes:** Archivo + Space Grotesk descargadas, subset con `glyphhanger` o `fonttools`, servidas desde `/fonts/` con `Cache-Control: public, max-age=31536000, immutable`.
- **`<link rel="preload">`** para Archivo 700 (la fuente del H1), `as="font" type="font/woff2" crossorigin`.
- **`font-display: swap`** en `@font-face`.
- **Imágenes:** AVIF + fallback WebP con `sharp`, responsive `srcset` (640w, 1024w, 1600w), `loading="lazy"` excepto la LCP, `fetchpriority="high"` en la LCP.

### INP (target < 200ms)

- Solo interacciones: toggle de idioma, abrir/cerrar modal, scroll suave a anchors.
- Modal con `<dialog>` nativo (focus trap y `Esc` gratis).
- Sin tareas pesadas en handlers.

### CLS (target < 0.1)

- `width` y `height` explícitos en todas las imágenes.
- Reserva de espacio del modal.
- No inyectar contenido above-the-fold después del load.

### Bundle

- `@angular/ssr` agrega ~30 KB gz (aceptable).
- TranslationPipe (~1 KB), LangToggle y SeoService son custom y livianos.
- Verificar con `ng build --stats-json` + `source-map-explorer`.

### _htaccess

Revisar y actualizar:

- `Cache-Control: public, max-age=31536000, immutable` en assets con hash (Angular ya emite hashes).
- `Cache-Control: no-cache` en `index.html`.
- Compresión brotli/gzip habilitada.
- Headers de seguridad básicos (X-Content-Type-Options, Referrer-Policy).

---

## 7. Accesibilidad (WCAG 2.1 AA)

### Estructura semántica

- Un solo `<h1>` (ya está).
- Landmarks: `<header>`, `<main>`, `<footer>`, `<section aria-labelledby>`.
- **Skip link** al inicio: `<a href="#main" class="sr-only focus:not-sr-only">Saltar al contenido / Skip to content</a>`.

### Modal

- Usar `<dialog>` nativo en vez de `<div role="dialog">`.
- `aria-labelledby` apuntando al título del proyecto.
- Focus trap y cierre con `Esc` nativos.
- Al cerrar, devolver foco al trigger que lo abrió (guardar `document.activeElement` antes de abrir).

### Contraste y color

- Auditar `text-secondary` sobre `background` → 4.5:1 mínimo en texto normal, 3:1 en texto grande.
- Botón "Escríbeme": revisar contraste del `border-border`.
- Focus visible con `focus-visible:ring-2 ring-accent ring-offset-2`.

### Movimiento

- Respetar `prefers-reduced-motion: reduce` → desactivar transiciones de hover y animaciones de entrada.

### Idioma

- `<html lang>` dinámico vía `effect()` cuando cambia el idioma.
- `aria-label` en el LangToggle con el nombre completo del idioma ("Español" / "English").

### Teclado

- Tab order lógico.
- Modal: primer elemento focusable recibe foco al abrir; shift-tab desde el primero cierra el modal.

### Auditoría

- Lighthouse Accessibility ≥ 95.
- axe DevTools: 0 violaciones serias.
- NVDA + Firefox smoke test.

---

## 8. Contenido y copy

### Hero

**Cambios:**

- Agregar debajo del subtítulo una **línea de credenciales comprimida** (ES): *"+6 años en producción · Angular lead en Banco Santander · WCAG AA en Comunidad de Madrid"*.
- Reordenar CTAs: primario **"Ver proyectos"**, secundario **"Descargar CV"** (PDF), terciario (más sutil) **"Escríbeme"** como link en header.

### About

- Agregar al final una línea **"Ahora"** (ES): *"Ahora liderando frontend en un portal con 2M visitas/mes y WCAG AA estricto."*
- Mantener el resto tal cual (el copy actual es sólido).

### Projects (cards y modal)

- Agregar badges en las cards: tipo (`Trabajo` / `Personal`) y año.
- En el modal, después del `body`, agregar **3 highlights cortos en bullets** extraídos de la carta (no reemplazar la carta, complementarla).
- Ejemplo Telemetría 2.0:
  - Unificó 4 SCADA independientes en una plataforma web
  - 50+ plantas migradas, incluida la desalinizadora de Iquique
  - Stack: AVEVA · Oracle · Angular · Spring Boot · Python

---

## 9. CV descargable

### Estrategia

Dos PDFs estáticos servidos desde `/cv-es.pdf` y `/cv-en.pdf`.

### Fuente de verdad

- Componente Angular (`src/app/cv/cv.component.ts` + `cv.template.html`) que renderiza el CV en una vista web. Esta vista es la fuente de verdad (más fácil de mantener que editar HTML de PDF directamente).
- La vista web no se enlaza públicamente; solo se usa para generar el PDF.

### Generación al build

- Script Node: `scripts/generate-cv.mjs`.
- Usa Puppeteer (headless Chrome) para renderizar la vista web del CV a PDF con `@page { size: A4; margin: 1.5cm }`.
- Salida: `dist/portafolio/browser/cv-es.pdf` y `cv-en.pdf`.

### Estructura del CV (1 página A4 cada idioma)

1. Nombre + rol + tagline
2. Contacto (email · LinkedIn · GitHub · portafolio)
3. Resumen profesional (3 líneas)
4. Experiencia (4 proyectos con bullets de impacto, mismos highlights del modal)
5. Stack técnico (Frontend, Backend, Datos, Herramientas)
6. Formación (breve)
7. Idiomas (Español nativo, Inglés profesional)

### Botones en la web

- Hero: "Descargar CV" (botón secundario, descarga `cv-{lang}.pdf`).
- Footer: link pequeño "CV (ES)" / "CV (EN)".

### Accesibilidad del PDF

Puppeteer con `<html lang>` correcto y `printBackground: true`. Los PDFs generados con Chrome tienen tags de estructura básicos.

---

## 10. Analytics

### Opción recomendada

**Plausible** (~$9/mes, ~$90/año). Alternativa gratuita: Umami self-hosted.

### Implementación

- Script async inyectado en `index.html` (compatible con prerender) o vía `SeoService` con `Renderer2`.
- Dominio configurado en Plausible.
- Sin banner de cookies (no usa cookies ni datos personales → GDPR-friendly).

### Eventos custom

```js
// Proyecto abierto
plausible('project_open', { props: { project: 'telemetria-2-0' } })

// CV descargado
plausible('cv_download', { props: { lang: 'es' } })

// Click en contacto
plausible('contact_click', { props: { channel: 'email' } })

// Toggle de idioma
plausible('lang_switch', { props: { from: 'es', to: 'en' } })
```

### Lo que NO se trackea

Nada personal. Nada de scroll depth. Nada de heatmaps.

---

## 11. Polish visual y animaciones

### Tipografía y espaciado

- Escala tipográfica más definida: `text-display` (Archivo 700, tracking -0.02em), `text-body` (Space Grotesk 400). Para tags técnicos (tecnologías, badges), usar la misma familia con peso medio (`font-medium tracking-tight`) para no introducir una tercera fuente.
- Escala de espaciado consistente en múltiplos de 4px (ya está en Tailwind v4).
- Mejorar el ritmo vertical entre secciones.

### Hover y focus states

- Transición de 200 ms en todos los links y botones.
- Cards de proyecto: leve `translate-y-[-2px]` + sombra sutil al hover.
- Focus ring consistente: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`.

### Animaciones de entrada

- Fade + translate-y sutil en cada sección al entrar en viewport (`IntersectionObserver`, una sola vez).
- Respeta `prefers-reduced-motion: reduce` → estático bajo esa media query.
- Modal: 200 ms scale-in (0.96 → 1) + fade, sin rebote.

### Microdetalles

- Año de copyright dinámico (ya está).
- Cursor pointer en cards interactivas.
- Verificar favicon visible en tab.

### Lo que NO se hace

- Sin parallax, sin scroll-jacking, sin animaciones costosas.
- Sin cambio de paleta ni tipografías.

---

## 12. Plan de implementación (fases)

### Fase 1 — Foundations

1. `TranslationService` + `TranslationPipe` + `LangToggle` + JSON ES/EN
2. `SeoService` con meta + JSON-LD
3. `sitemap.xml` + `robots.txt` en `public/`
4. OG image default generado con sharp
5. Self-host fuentes (subset WOFF2)
6. Refinar copy (credenciales + "ahora" en About + highlights en cards)
7. Skip link + accesibilidad modal (`<dialog>`)

### Fase 2 — SSG y Performance

8. Agregar `@angular/ssr` con prerender en `angular.json`
9. Verificar build, ajustar `provideClientHydration()` si hace falta
10. Optimizar imágenes de proyectos (AVIF/WebP responsive)
11. Revisar `_htaccess` (caching, brotli, no-cache en index.html)

### Fase 3 — CV y Analytics

12. Componente CV con vista web
13. Script `generate-cv.mjs` con Puppeteer
14. Botón "Descargar CV" en hero y footer
15. Plausible + eventos custom

### Fase 4 — Polish y validación

16. Animaciones de entrada con `IntersectionObserver`
17. Auditoría Lighthouse (Performance, SEO, Accessibility, Best Practices) — todos ≥ 90
18. Auditoría axe DevTools — 0 violaciones serias
19. Validar JSON-LD en Google Rich Results Test
20. Validar hreflang en Google Search Console tras deploy
21. Submeter sitemap en Search Console

---

## 13. Estructura de archivos nueva

```
src/
├── app/
│   ├── i18n/
│   │   ├── translation.service.ts
│   │   ├── translation.pipe.ts
│   │   └── lang-toggle.component.ts
│   ├── seo/
│   │   └── seo.service.ts
│   ├── cv/
│   │   ├── cv.component.ts
│   │   ├── cv.template.html
│   │   └── cv.styles.css
│   ├── components/  (existente, sin cambios de ubicación)
│   │   ├── header/
│   │   ├── hero/
│   │   ├── about/
│   │   ├── projects-section/
│   │   ├── project-card/
│   │   ├── project-dialog/  (migrar a <dialog>)
│   │   └── footer/
│   ├── data/
│   │   └── projects.ts  (existente)
│   ├── models/
│   │   └── project.ts  (existente, agregar campo highlights opcional)
│   └── app.ts  (existente, inyectar SeoService y TranslationService)
public/
├── i18n/
│   ├── es.json
│   └── en.json
├── fonts/
│   ├── archivo-*.woff2
│   └── space-grotesk-*.woff2
├── projects/
│   └── (imágenes existentes + versiones AVIF/WebP)
├── og-default.png  (generado)
├── cv-es.pdf  (generado)
├── cv-en.pdf  (generado)
├── sitemap.xml
├── robots.txt
└── (resto existente)
scripts/
├── generate-favicon.mjs  (existente)
├── generate-og.mjs  (nuevo)
└── generate-cv.mjs  (nuevo)
angular.json  (agregar prerender, budgets, ssr builder)
```

---

## 14. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Prerender con Angular 22 + i18n cliente puede tener hydration mismatch | Renderizar el HTML inicial en ES (idioma por defecto) y dejar que el cliente cambie a EN si la preferencia lo indica. Verificar con Playwright después del primer deploy. |
| Puppeteer en CI (GitHub Actions) requiere Chromium | Usar `puppeteer-core` con `apt-get install chromium` o el Chromium que ya viene en runners de GitHub Actions (`@sparticuz/chromium` para serverless). |
| Plausible pago: si el usuario decide no pagar | Documentar fallback a Umami self-hosted o Cloudflare Analytics (gratis si el dominio se mueve a Cloudflare). |
| Sin Router: no se puede compartir URL específica de proyecto | Aceptado por el usuario. Es un trade-off explícito del enfoque A. |
| Self-host de fuentes: el subset puede no incluir caracteres especiales del español | Verificar subset incluye acentos, ñ, ¿, ¡, ü, etc. |

---

## 15. Criterios de aceptación

- [ ] Lighthouse: Performance ≥ 90, SEO = 100, Accessibility ≥ 95, Best Practices ≥ 95.
- [ ] axe DevTools: 0 violaciones serias.
- [ ] Google Rich Results Test: sin errores en JSON-LD.
- [ ] Cambio de idioma actualiza `<html lang>`, `<title>`, meta description y contenido visible.
- [ ] Toggle de idioma persiste entre recargas.
- [ ] Modal abre/cierra con teclado y mouse; foco gestionado correctamente.
- [ ] Imágenes en formato moderno (AVIF/WebP) con `srcset` responsive.
- [ ] Fuentes cargadas localmente sin requests a `fonts.googleapis.com`.
- [ ] HTML prerenderizado contiene el contenido completo (verificable con `curl https://patriciomanquepillan.com/ | grep "Telemetría 2.0"`).
- [ ] `sitemap.xml` y `robots.txt` accesibles y válidos.
- [ ] CV ES y CV EN descargables desde los botones correctos.
- [ ] Eventos de Plausible se disparan en las acciones definidas.
- [ ] Sin regresiones: el sitio se ve y comporta al menos tan bien como antes.
