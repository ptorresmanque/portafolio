# Deploy to cPanel

This document explains how the CI/CD pipeline is configured and how to operate it.

## How it works

Every push to `main` triggers a GitHub Actions workflow that:

1. Builds the Angular app with Node 22 (`npm ci` + `npm run build`)
2. Cleans the staging directory and transfers the static output via `scp` over SSH to `~/public_html_new/` on the server
3. Runs a remote script that:
   - Renames `_htaccess` to `.htaccess` in the staging directory
   - Archives the current `~/public_html/` into `~/releases/<UTC-ISO-timestamp>/`
   - Promotes `~/public_html_new/` to `~/public_html/`
   - Prunes old releases, keeping the most recent 3

> **Important:** Each deploy replaces the entire `~/public_html/` directory. Files uploaded manually through cPanel File Manager or another channel—including `cgi-bin/` and `.well-known/acme-challenge/`—will be deleted from the live site. This pipeline assumes `public_html` contains only the generated Angular build, consistent with the earlier confirmation that it is currently empty. Persistent files must live elsewhere or be included in the build.

## Required GitHub Secrets

Configure in **Settings → Secrets and variables → Actions → New repository secret**:

| Name | Value |
|---|---|
| `CPANEL_SSH_KEY` | Full contents of `~/.ssh/cpanel_deploy` (the private key) |
| `CPANEL_SSH_KEY_PASSPHRASE` | The passphrase of that private key (if any) |
| `CPANEL_SSH_USER` | `kbkbsuzc` |
| `CPANEL_SSH_HOST` | `patriciomanquepillan.com` |
| `CPANEL_SSH_PORT` | `54327` |

To get the key contents:

```bash
cat ~/.ssh/cpanel_deploy
```

Copy the entire output (including the `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----` lines) into the `CPANEL_SSH_KEY` secret value.

If `~/.ssh/cpanel_deploy` has a passphrase, run this to retrieve it (the passphrase you type to unlock the key is **not** stored anywhere — you need to remember it):

```bash
ssh-keygen -y -f ~/.ssh/cpanel_deploy   # asks for passphrase; if it asks, one exists
```

Store that passphrase as the `CPANEL_SSH_KEY_PASSPHRASE` secret. The workflow uses `SSH_ASKPASS` to unlock the key non-interactively inside the runner.

> **If you change the passphrase later**, update the `CPANEL_SSH_KEY_PASSPHRASE` secret to match. The private key file (`CPANEL_SSH_KEY`) does not change.

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

SSH into the server and run this safe procedure. It acquires the same lock as automatic deploys and verifies the target release before moving the current live site.

```bash
# 1. Acquire the same deploy lock so no automatic deploy runs concurrently
LOCK="$HOME/.deploy.lock"
exec 9>"$LOCK"
flock 9

# 2. List available releases (oldest to newest)
ls -1 ~/releases

# 3. Verify the target release exists BEFORE moving anything
ls -d ~/releases/<target-timestamp>  # must succeed

# 4. Move current live out of the way
mv ~/public_html ~/releases/broken-$(date -u +%Y-%m-%dT%H-%M-%S)

# 5. Restore the target release
mv ~/releases/<target-timestamp> ~/public_html

# Lock auto-releases when this SSH session ends
```

`<target-timestamp>` is the directory name from step 2 you want to restore (for example `2026-07-19T10-30-45`). Step 3 is the safety check — if the directory doesn't exist, fix the name and re-check rather than running step 4.

## Server prerequisites

Before the first deploy can succeed, the server must already meet these requirements. These are server-side prerequisites (already in place on standard cPanel Linux hosts), not GitHub-side:

- `bash`, `flock` and `lslocks` (from `util-linux`), `find` (GNU), and `date` (GNU) must be available on the server's `$PATH`.
- `scp` (from OpenSSH) must be available — it is installed alongside `ssh` on virtually every Linux host.
- The public key corresponding to `~/.ssh/cpanel_deploy` (the private key pasted into the `CPANEL_SSH_KEY` GitHub Secret) must be listed in `~/.ssh/authorized_keys` on the server.

> **Why not `rsync`?** The pipeline uses `scp` instead of `rsync` because `rsync` is not installed on this hosting account and cPanel users cannot install system packages. `scp` transfers the full build on every deploy — fine for a portfolio site (~200KB) and avoids the host-side dependency.

Verify on the server before the first deploy:

```bash
# On the server, check these are available:
which bash scp ssh flock lslocks find date

# Confirm the public key for cpanel_deploy is listed here:
cat ~/.ssh/authorized_keys

# Local fingerprint (run on your workstation) should match a public key on the server:
ssh-keygen -l -f ~/.ssh/cpanel_deploy.pub
```

## First-time setup on a fresh server

If `~/public_html` does not exist yet, the first deploy will create it via the script's promote step. The script also creates `~/releases/` if it doesn't exist.

## Troubleshooting

### Workflow fails at "Setup SSH agent with passphrase"

- **`ssh-add` still prompts**: confirms `CPANEL_SSH_KEY_PASSPHRASE` is missing or wrong. Confirm the secret exists with the exact passphrase (including any spaces or special characters).
- **`Bad passphrase` / `Permission denied (publickey)` further down**: the key was loaded but ssh-add rejected the passphrase. Re-check the secret value.
- **`Load key "...": invalid format`**: the private key in `CPANEL_SSH_KEY` is corrupted (extra/missing newline, truncated). Re-paste the full contents of `~/.ssh/cpanel_deploy`.
- Confirm the `CPANEL_SSH_KEY` secret contains the full private key, including header/footer lines.
- Confirm the public key corresponding to `~/.ssh/cpanel_deploy` is listed in `~/.ssh/authorized_keys` on the server.

### Workflow fails at "Add host to known_hosts"

- Verify `CPANEL_SSH_HOST` and `CPANEL_SSH_PORT` are correct.
- Try connecting manually: `ssh -p 54327 kbkbsuzc@patriciomanquepillan.com`.

### Workflow fails at "Clean staging on server" or "Sync to staging on server"

- The existence of `~/.deploy.lock` is harmless when no deploy holds it; the lock is attached to an open file descriptor, not to the file's existence. Do not delete it. If a deploy appears hung, use `lslocks | grep .deploy.lock` to check whether a process currently holds the lock.
- Staging `~/public_html_new/` is wiped and repopulated on every deploy (`rm -rf` then `scp`), so stale staging left by a failed deploy is overwritten on the next successful run.
- Verify disk space: `df -h ~`.

### Site shows the old version after deploy

- Hard refresh (Cmd+Shift+R) — the index.html has `no-cache` so this should always pick up new versions.
- Check the workflow ran successfully (Actions tab).
- SSH in and verify `ls -la ~/public_html` shows recent timestamps.

### Build fails with "_htaccess missing from build output"

- Confirm the file exists at `public/_htaccess` (with underscore, not dot).
- Run `npm run build` locally and check `dist/portafolio/browser/_htaccess`.