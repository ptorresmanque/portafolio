# CI/CD deploy a cPanel — Diseño

**Fecha:** 2026-07-19
**Estado:** Aprobado

## Objetivo

Desplegar automáticamente el portafolio Angular (SPA estática) en el hosting cPanel cada vez que se hace `push` a `main`, usando SSH con clave dedicada y conservando historial de releases para rollback.

## Contexto

- Proyecto: `portafolio` (Angular 22, standalone components, sin SSR, sin Angular Router)
- Build output: `dist/portafolio/browser/`
- Runtime: 100% estático, sin secrets ni variables de entorno
- Hosting destino: cPanel con acceso SSH
- Clave SSH ya configurada en el servidor con nombre `cpanel_deploy` (`~/.ssh/cpanel_deploy`)
- Repositorio: GitHub (aún sin remoto configurado, debe agregarse)
- Branch principal: `main`

## Decisiones de diseño

### 1. Plataforma CI: GitHub Actions

Workflow en `.github/workflows/deploy.yml`. Trigger en `push` a `main`.

### 2. Pipeline

```
push a main
  ↓
[1] actions/checkout@v4
[2] actions/setup-node@v4 (node-version: 22, cache: npm)
[3] npm ci
[4] npm run build  →  dist/portafolio/browser/
[5] webfactory/ssh-agent@v1 (carga CPANEL_SSH_KEY)
[6] ssh-keyscan CPANEL_SSH_HOST  >>  ~/.ssh/known_hosts
[7] rsync dist/portafolio/browser/ → user@host:~/public_html_new/
[8] SSH: ejecutar .github/scripts/deploy.sh
       · cd ~/public_html_new && mv _htaccess .htaccess
       · cd ~ && mv public_html → releases/<timestamp>/
       · mv public_html_new → public_html
       · podar releases manteniendo las últimas 3
```

### 3. Estrategia de deploy: staging + swap atómico

El nuevo release se transfiere primero a `public_html_new/`. Sólo si rsync termina OK se ejecuta el script remoto que:
1. Mueve el `public_html` actual a `releases/<timestamp>/`
2. Renombra `public_html_new` a `public_html`

Si rsync falla, `public_html_new` queda incompleto y no se promueve. El sitio en producción sigue intacto.

### 4. Estructura en el servidor

```
~/
├── public_html/              ← sitio en producción
└── releases/
    ├── 2026-07-19-103045/
    ├── 2026-07-18-150322/
    └── 2026-07-17-090000/   ← (las más viejas se eliminan automáticamente)
```

### 5. Rollback manual

```bash
ssh user@host 'cd ~ && mv public_html releases/broken-$(date +%s) && mv releases/<timestamp-anterior> public_html'
```

### 6. Secrets requeridos en GitHub

| Nombre | Valor | Descripción |
|---|---|---|
| `CPANEL_SSH_KEY` | (contenido de `~/.ssh/cpanel_deploy`) | Clave privada SSH |
| `CPANEL_SSH_USER` | `kbkbsuzc` | Usuario SSH del servidor cPanel |
| `CPANEL_SSH_HOST` | `patriciomanquepillan.com` | Hostname del servidor |
| `CPANEL_SSH_PORT` | `54327` | Puerto SSH personalizado |

### 7. .htaccess

Crear `public/_htaccess` (Angular copia automáticamente todo `public/**/*` al output, pero el glob estándar puede excluir archivos que empiezan con `.`). El workflow rsync lo renombra a `.htaccess` en el servidor durante el deploy.

Contenido:
- `Cache-Control: public, max-age=31536000, immutable` para `*.js`, `*.css`, `*.woff2`, `*.woff`, `*.svg`, `*.png`, `*.jpg`, `*.webp`
- `Cache-Control: no-cache, must-revalidate` para `index.html`
- Headers de seguridad: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`
- Compresión gzip/brotli para `text/*`, `application/javascript`, `application/json`, `image/svg+xml`

Renombrado en deploy: el script remoto hace `mv _htaccess .htaccess` después del rsync.

### 8. Variables del workflow

| Variable | Default | Descripción |
|---|---|---|
| `RELEASES_TO_KEEP` | `3` | Número de releases históricos a conservar |
| `NODE_VERSION` | `22` | Versión de Node para el build |

## Archivos a crear

| Ruta | Propósito |
|---|---|
| `.github/workflows/deploy.yml` | Workflow principal |
| `.github/scripts/deploy.sh` | Script de rotación remota (idempotente): renombra `_htaccess`, mueve release, poda |
| `public/_htaccess` | Configuración Apache (renombrada a `.htaccess` en el servidor por el script de deploy) |

## Archivos a NO tocar

- `package.json` — usa `npm run build` ya existente
- `angular.json` — usa config ya existente
- `src/` — sin cambios

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| MITM al conectar SSH | `ssh-keyscan` agrega el host a `known_hosts` antes de conectar |
| Deploy deja sitio roto | Swap atómico: nuevo release primero en `public_html_new` |
| Llave SSH comprometida | Clave dedicada sólo a este deploy (ya configurada en servidor) |
| Disco lleno por releases antiguas | Poda automática mantiene últimas 3 |
| Build rompe por cache npm | `cache: npm` acelera, `npm ci` asegura lockfile exacto |

## Out of scope

- Tests automatizados en CI (se ejecutan localmente; agregar después si se desea)
- Build para staging/preview environments
- Notificaciones Slack/Discord (GitHub ya envía email a watchers)
- Hardening adicional de la clave SSH en `authorized_keys` (la clave ya está configurada en el servidor según el usuario)

## Verificación post-implementación

1. Push de prueba a `main` → workflow corre sin errores
2. Verificar `~/public_html` en servidor tiene archivos actualizados
3. Verificar `~/releases/` contiene el release anterior
4. Hacer un cambio, push, confirmar nuevo release en `releases/` y viejo en backup
5. Probar rollback manual y verificar que sitio vuelve a versión anterior
