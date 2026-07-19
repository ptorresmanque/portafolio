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