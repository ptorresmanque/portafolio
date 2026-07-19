# CI/CD Deploy to cPanel — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up automatic deployment of the Angular portfolio to cPanel hosting via SSH on every push to `main`, with release history for rollback.

**Architecture:** GitHub Actions builds the Angular app with Node 22, transfers the static output via rsync over SSH using a dedicated deploy key, and atomically swaps a staging directory (`public_html_new`) with the live `public_html`, archiving the previous live into a timestamped releases folder and pruning old releases.

**Tech Stack:** GitHub Actions, Node 22, npm, Angular 22, rsync, SSH, bash

## Global Constraints

- Angular 22 (already in `package.json`)
- Build output path: `dist/portafolio/browser/` (do not change)
- SSH target: `kbkbsuzc@patriciomanquepillan.com:54327` (values stored in GitHub Secrets)
- Keep last 3 releases in `~/releases/`
- Public site served from `~/public_html/`
- Use `public/_htaccess` (underscore prefix) so Angular's `**/*` asset glob copies it; remote deploy script renames it to `.htaccess`
- No changes to `package.json`, `angular.json`, or anything under `src/`
- Required GitHub Secrets: `CPANEL_SSH_KEY`, `CPANEL_SSH_USER` (value: `kbkbsuzc`), `CPANEL_SSH_HOST` (value: `patriciomanquepillan.com`), `CPANEL_SSH_PORT` (value: `54327`)

---

## File Structure

| File | Responsibility |
|---|---|
| `public/_htaccess` | Apache config template (cache, compression, security headers) shipped with the build |
| `.github/scripts/deploy.sh` | Remote bash script: renames `_htaccess`, swaps staging into live, archives previous, prunes |
| `.github/workflows/deploy.yml` | GitHub Actions workflow: build + rsync + swap |
| `docs/deploy.md` | Operator documentation: secrets, manual trigger, rollback, troubleshooting |

---

## Task 1: Apache configuration template (`public/_htaccess`)

**Files:**
- Create: `public/_htaccess`

This file ships with the build and is renamed to `.htaccess` by the deploy script on the server.

**Interfaces:**
- Consumes: nothing
- Produces: a file that, when placed as `.htaccess` in `~/public_html/`, configures Apache for caching, compression, and security headers

- [ ] **Step 1: Create the file**

Write to `public/_htaccess`:

```apache
# Cache hashed assets (Angular appends content hashes; safe to cache for 1 year)
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
</IfModule>

# Hashed assets cache-control (explicit, in case mod_expires missing)
<FilesMatch "\.(js|css|woff2?|svg|png|jpe?g|webp)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# index.html must always be fresh
<FilesMatch "^index\.html$">
  Header set Cache-Control "no-cache, must-revalidate"
  Header unset ETag
</FilesMatch>

# Security headers
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css
  AddOutputFilterByType DEFLATE application/javascript application/json
  AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Disable directory listing
Options -Indexes

# Default start page
DirectoryIndex index.html
```

- [ ] **Step 2: Build and verify the file is copied**

Run:
```bash
npm run build
```

Expected: build succeeds. Then:
```bash
ls -la dist/portafolio/browser/_htaccess
```

Expected: file exists. If it does not, check that the filename starts with underscore (not a dot) so Angular's `**/*` glob picks it up.

- [ ] **Step 3: Commit**

```bash
git add public/_htaccess
git commit -m "feat(deploy): add Apache config template for cache, compression, security headers"
```

---

## Task 2: Remote deploy script (`.github/scripts/deploy.sh`)

**Files:**
- Create: `.github/scripts/deploy.sh`

This script runs on the server after rsync completes. It promotes staging to live and prunes old releases.

**Interfaces:**
- Consumes:
  - `RELEASES_TO_KEEP` env var (default `3`)
  - `~/public_html_new/` directory populated by rsync (must contain `index.html`)
  - Optional `~/public_html/` directory (may not exist on first deploy)
- Produces:
  - `~/public_html/` (the live site)
  - `~/releases/<UTC-ISO-timestamp>/` archives
  - Staging directory no longer exists after success

- [ ] **Step 1: Create the file**

Write to `.github/scripts/deploy.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

KEEP="${RELEASES_TO_KEEP:-3}"
HOME_DIR="$HOME"
STAGING="$HOME_DIR/public_html_new"
LIVE="$HOME_DIR/public_html"
RELEASES_DIR="$HOME_DIR/releases"
TS="$(date -u +%Y-%m-%dT%H-%M-%S)"

log() { echo "[deploy $TS] $*"; }

# 1. Rename _htaccess to .htaccess in staging
if [ -f "$STAGING/_htaccess" ]; then
  mv "$STAGING/_htaccess" "$STAGING/.htaccess"
  log "renamed _htaccess -> .htaccess"
fi

# 2. Safety check: staging must contain index.html
if [ ! -f "$STAGING/index.html" ]; then
  log "ERROR: staging missing index.html, aborting before swap"
  exit 1
fi

# 3. Ensure releases directory exists
mkdir -p "$RELEASES_DIR"

# 4. Archive current live to releases/<timestamp>
if [ -d "$LIVE" ]; then
  mv "$LIVE" "$RELEASES_DIR/$TS"
  log "archived current live -> releases/$TS"
else
  log "no existing public_html, first deploy"
fi

# 5. Promote staging to live
mv "$STAGING" "$LIVE"
log "promoted staging -> public_html"

# 6. Prune old releases (keep newest KEEP)
cd "$RELEASES_DIR"
COUNT=$(find . -maxdepth 1 -mindepth 1 -type d | wc -l | tr -d ' ')
if [ "$COUNT" -gt "$KEEP" ]; then
  REMOVE=$(find . -maxdepth 1 -mindepth 1 -type d -printf '%T@ %p\n' | sort -n | head -n -"$KEEP" | awk '{print $2}')
  for d in $REMOVE; do
    log "pruning release: $d"
    rm -rf -- "$d"
  done
fi

log "deploy complete"
```

- [ ] **Step 2: Make the script executable**

Run:
```bash
chmod +x .github/scripts/deploy.sh
```

Expected: no output. Verify with `ls -la .github/scripts/deploy.sh` — first column should include `x`.

- [ ] **Step 3: Run shellcheck**

Run:
```bash
shellcheck .github/scripts/deploy.sh
```

Expected: no output (exit code 0). If `shellcheck` is not installed, install it first: `brew install shellcheck` (macOS) or `apt-get install shellcheck` (Linux).

If shellcheck reports issues, fix them and re-run until clean.

- [ ] **Step 4: Local smoke test (failure path)**

Create a temporary fake home directory and verify the script aborts when staging is missing `index.html`:

Run:
```bash
TMP=$(mktemp -d)
mkdir -p "$TMP/public_html_new"
cd "$TMP"
HOME="$TMP" bash /path/to/repo/.github/scripts/deploy.sh
echo "Exit code: $?"
rm -rf "$TMP"
```

Expected output: `[deploy <timestamp>] ERROR: staging missing index.html, aborting before swap` and `Exit code: 1`.

- [ ] **Step 5: Local smoke test (success path)**

Run a full success path test in a fake home:

```bash
TMP=$(mktemp -d)
mkdir -p "$TMP/public_html_new"
echo "<html><body>hello</body></html>" > "$TMP/public_html_new/index.html"
touch "$TMP/public_html_new/_htaccess"
echo "old content" > "$TMP/public_html/index.html"

HOME="$TMP" RELEASES_TO_KEEP=2 bash /path/to/repo/.github/scripts/deploy.sh

echo "--- staging after ---"
ls -la "$TMP/public_html_new" 2>&1 || echo "(absent, expected)"
echo "--- live after ---"
ls -la "$TMP/public_html"
echo "--- releases ---"
ls -la "$TMP/releases"

rm -rf "$TMP"
```

Expected:
- Output contains `renamed _htaccess -> .htaccess`, `archived current live -> releases/<ts>`, `promoted staging -> public_html`, `deploy complete`
- `$TMP/public_html_new` does not exist
- `$TMP/public_html/index.html` contains `hello`
- `$TMP/releases/` has exactly 1 directory
- `$TMP/public_html/.htaccess` exists

- [ ] **Step 6: Commit**

```bash
git add .github/scripts/deploy.sh
git commit -m "feat(deploy): add remote script for atomic swap and release pruning"
```

---

## Task 3: GitHub Actions workflow (`.github/workflows/deploy.yml`)

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes:
  - Secrets: `CPANEL_SSH_KEY`, `CPANEL_SSH_USER`, `CPANEL_SSH_HOST`, `CPANEL_SSH_PORT`
  - Script: `.github/scripts/deploy.sh` (consumed via `bash -s`)
- Produces: a deploy run on every push to `main`

- [ ] **Step 1: Create the file**

Write to `.github/workflows/deploy.yml`:

```yaml
name: Deploy to cPanel

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: deploy-cpanel
  cancel-in-progress: false

permissions:
  contents: read

jobs:
  deploy:
    name: Build and deploy
    runs-on: ubuntu-latest
    timeout-minutes: 10
    env:
      RELEASES_TO_KEEP: "3"
      NODE_VERSION: "22"

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Verify _htaccess is in build output
        run: test -f dist/portafolio/browser/_htaccess || (echo "::error::_htaccess missing from build output" && exit 1)

      - name: Setup SSH key
        uses: webfactory/ssh-agent@v1
        with:
          ssh-private-key: ${{ secrets.CPANEL_SSH_KEY }}

      - name: Add host to known_hosts
        run: |
          mkdir -p ~/.ssh
          ssh-keyscan -p "${{ secrets.CPANEL_SSH_PORT }}" \
            -H "${{ secrets.CPANEL_SSH_HOST }}" >> ~/.ssh/known_hosts

      - name: Sync to staging on server
        run: |
          rsync -avz --delete \
            -e "ssh -p ${{ secrets.CPANEL_SSH_PORT }}" \
            dist/portafolio/browser/ \
            "${{ secrets.CPANEL_SSH_USER }}@${{ secrets.CPANEL_SSH_HOST }}:public_html_new/"

      - name: Atomic swap and prune
        run: |
          ssh -p "${{ secrets.CPANEL_SSH_PORT }}" \
            "${{ secrets.CPANEL_SSH_USER }}@${{ secrets.CPANEL_SSH_HOST }}" \
            "RELEASES_TO_KEEP='${{ env.RELEASES_TO_KEEP }}' bash -s" \
            < .github/scripts/deploy.sh
```

- [ ] **Step 2: Validate YAML syntax**

Run:
```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy.yml'))" && echo "YAML OK"
```

Expected: `YAML OK`.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat(deploy): add GitHub Actions workflow for automatic cPanel deploy"
```

---

## Task 4: Operator documentation (`docs/deploy.md`)

**Files:**
- Create: `docs/deploy.md`

- [ ] **Step 1: Create the file**

Write to `docs/deploy.md`:

````markdown
# Deploy to cPanel

This document explains how the CI/CD pipeline is configured and how to operate it.

## How it works

Every push to `main` triggers a GitHub Actions workflow that:

1. Builds the Angular app with Node 22 (`npm ci` + `npm run build`)
2. Transfers the static output via rsync over SSH to `~/public_html_new/` on the server
3. Runs a remote script that:
   - Renames `_htaccess` to `.htaccess` in the staging directory
   - Archives the current `~/public_html/` into `~/releases/<UTC-ISO-timestamp>/`
   - Promotes `~/public_html_new/` to `~/public_html/`
   - Prunes old releases, keeping the most recent 3

## Required GitHub Secrets

Configure in **Settings → Secrets and variables → Actions → New repository secret**:

| Name | Value |
|---|---|
| `CPANEL_SSH_KEY` | Full contents of `~/.ssh/cpanel_deploy` (the private key) |
| `CPANEL_SSH_USER` | `kbkbsuzc` |
| `CPANEL_SSH_HOST` | `patriciomanquepillan.com` |
| `CPANEL_SSH_PORT` | `54327` |

To get the key contents:

```bash
cat ~/.ssh/cpanel_deploy
```

Copy the entire output (including the `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----` lines) into the secret value.

## Triggering a manual deploy

1. Go to the **Actions** tab in GitHub
2. Select **Deploy to cPanel** in the left sidebar
3. Click **Run workflow** → **Run workflow**

## Server structure

```
~/
├── public_html/                # Live site
└── releases/
    ├── 2026-07-19T10-30-45/   # Previous releases (oldest pruned automatically)
    ├── 2026-07-18T15-03-22/
    └── ...
```

## Rollback

SSH into the server and run:

```bash
cd ~
mv public_html "releases/broken-$(date -u +%Y-%m-%dT%H-%M-%S)"
mv releases/<previous-timestamp> public_html
```

For example:

```bash
mv releases/2026-07-19T10-30-45 public_html
```

Replace `<previous-timestamp>` with the name of the directory in `~/releases/` you want to restore.

## First-time setup on a fresh server

If `~/public_html` does not exist yet, the first deploy will create it via the script's promote step. The script also creates `~/releases/` if it doesn't exist.

## Troubleshooting

### Workflow fails at "Setup SSH key"

- Confirm the `CPANEL_SSH_KEY` secret contains the full private key, including header/footer lines.
- Confirm the corresponding public key is in `~/.ssh/authorized_keys` on the server (named `cpanel_deploy`).

### Workflow fails at "Add host to known_hosts"

- Verify `CPANEL_SSH_HOST` and `CPANEL_SSH_PORT` are correct.
- Try connecting manually: `ssh -p 54327 kbkbsuzc@patriciomanquepillan.com`.

### Workflow fails at "Sync to staging on server"

- Check that `~/public_html_new` is writable and not locked from a previous failed deploy (if so, delete it on the server and retry).
- Verify disk space: `df -h ~`.

### Site shows the old version after deploy

- Hard refresh (Cmd+Shift+R) — the index.html has `no-cache` so this should always pick up new versions.
- Check the workflow ran successfully (Actions tab).
- SSH in and verify `ls -la ~/public_html` shows recent timestamps.

### Build fails with "_htaccess missing from build output"

- Confirm the file exists at `public/_htaccess` (with underscore, not dot).
- Run `npm run build` locally and check `dist/portafolio/browser/_htaccess`.
````

- [ ] **Step 2: Commit**

```bash
git add docs/deploy.md
git commit -m "docs: add deploy documentation with secrets setup, rollback, troubleshooting"
```

---

## Task 5: End-to-end validation (no commits)

This task verifies everything is wired up correctly before the user pushes to GitHub and configures secrets.

- [ ] **Step 1: Verify all files exist**

Run:
```bash
ls -la public/_htaccess .github/workflows/deploy.yml .github/scripts/deploy.sh docs/deploy.md
```

Expected: all four files listed, no "No such file or directory" errors.

- [ ] **Step 2: Confirm script is executable**

Run:
```bash
test -x .github/scripts/deploy.sh && echo "executable: OK" || echo "executable: MISSING"
```

Expected: `executable: OK`.

- [ ] **Step 3: Build locally and verify htaccess is copied**

Run:
```bash
npm run build && ls dist/portafolio/browser/_htaccess
```

Expected: build succeeds, file path printed.

- [ ] **Step 4: Re-run shellcheck on the deploy script**

Run:
```bash
shellcheck .github/scripts/deploy.sh
```

Expected: no output.

- [ ] **Step 5: Re-validate workflow YAML**

Run:
```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy.yml'))" && echo "YAML OK"
```

Expected: `YAML OK`.

- [ ] **Step 6: Review git history**

Run:
```bash
git log --oneline -10
```

Expected: four commits ahead of the original state, in this order:
1. `feat(deploy): add Apache config template for cache, compression, security headers`
2. `feat(deploy): add remote script for atomic swap and release pruning`
3. `feat(deploy): add GitHub Actions workflow for automatic cPanel deploy`
4. `docs: add deploy documentation with secrets setup, rollback, troubleshooting`

---

## After the plan completes

The user (not the agent) must perform these manual steps to go live:

1. **Push the repo to GitHub** (remote not yet configured):
   ```bash
   git remote add origin git@github.com:<user>/<repo>.git
   git push -u origin main
   ```

2. **Configure the 4 GitHub Secrets** as documented in `docs/deploy.md`.

3. **Trigger the first deploy** either by pushing another commit or using **Run workflow** in the Actions tab.

4. **Verify on the server**:
   ```bash
   ssh -p 54327 kbkbsuzc@patriciomanquepillan.com
   ls -la ~/public_html
   ls -la ~/releases
   ```
   Confirm `public_html` has the built files. On the first deploy, `releases/` exists but is empty because there is no previous `public_html` to archive. Subsequent deploys create timestamped release entries.
