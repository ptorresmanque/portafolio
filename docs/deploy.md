# Deploy to cPanel

This document explains how the CI/CD pipeline is configured and how to operate it.

## How it works

Every push to `main` triggers a GitHub Actions workflow that:

1. Builds the Angular app with Node 22 (`npm ci` + `npm run build`)
2. Cleans the staging directory and transfers the static output via `appleboy/scp-action@v1` (which uses `tar` over SSH internally) to `~/public_html_new/` on the server
3. Runs the swap script (`.github/scripts/deploy.sh`) on the server via `appleboy/ssh-action@v1` to atomically promote the staging directory to live
3. (The swap script in step 2 handles the rest: renames `_htaccess` to `.htaccess`, archives the previous `~/public_html/` into `~/releases/<UTC-ISO-timestamp>/`, promotes `~/public_html_new/` to `~/public_html/`, and prunes old releases keeping the most recent 3.)

> **Important:** Each deploy replaces the entire `~/public_html/` directory. Files uploaded manually through cPanel File Manager or another channel—including `cgi-bin/` and `.well-known/acme-challenge/`—will be deleted from the live site. This pipeline assumes `public_html` contains only the generated Angular build, consistent with the earlier confirmation that it is currently empty. Persistent files must live elsewhere or be included in the build.

## Required GitHub Secrets

Configure in **Settings → Secrets and variables → Actions → New repository secret**:

| Name | Value |
|---|---|
| `CPANEL_SSH_KEY` | Full contents of `~/.ssh/cpanel_deploy` (the private key) — **must have an empty passphrase** |
| `CPANEL_SSH_USER` | `kbkbsuzc` |
| `CPANEL_SSH_HOST` | `patriciomanquepillan.com` |
| `CPANEL_SSH_PORT` | `54327` |

To get the key contents:

```bash
cat ~/.ssh/cpanel_deploy
```

Copy the entire output (including the `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----` lines) into the `CPANEL_SSH_KEY` secret value.

> **The private key must not have a passphrase.** The workflow invokes `ssh` and `appleboy/ssh-action` with `BatchMode=yes` and no passphrase — a passphrase-protected key would fail. To remove the passphrase from your local key (without regenerating it, so the public key and the server's `authorized_keys` stay unchanged):
>
> ```bash
> ssh-keygen -p -f ~/.ssh/cpanel_deploy
> # Enter current passphrase, then press Enter twice for the new (empty) passphrase
> ```
>
> Then re-paste the updated key contents into the `CPANEL_SSH_KEY` secret.

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

- `bash`, `flock` and `lslocks` (from `util-linux`), `find` (GNU), `date` (GNU), and `tar` (GNU) must be available on the server's `$PATH`.
- The public key corresponding to `~/.ssh/cpanel_deploy` (the private key pasted into the `CPANEL_SSH_KEY` GitHub Secret) must be listed in `~/.ssh/authorized_keys` on the server.

> **Why not `rsync` / `scp`?** The pipeline uses a `tar` archive piped over SSH instead of `rsync` or `scp`. `rsync` is not installed on this hosting account and cPanel users cannot install system packages; using `tar` (always present) avoids the host-side dependency. The full build is transferred on every deploy — fine for a portfolio site (~200KB).

Verify on the server before the first deploy:

```bash
# On the server, check these are available:
which bash ssh tar flock lslocks find date

# Confirm the public key for cpanel_deploy is listed here:
cat ~/.ssh/authorized_keys

# Local fingerprint (run on your workstation) should match a public key on the server:
ssh-keygen -l -f ~/.ssh/cpanel_deploy.pub
```

## First-time setup on a fresh server

If `~/public_html` does not exist yet, the first deploy will create it via the script's promote step. The script also creates `~/releases/` if it doesn't exist.

## Troubleshooting

### Workflow fails at "Clean staging on server", "Sync build to staging", or "Atomic swap and prune"

- **`Permission denied (publickey)`**: confirms `CPANEL_SSH_USER`, `CPANEL_SSH_HOST`, or `CPANEL_SSH_PORT` is wrong, or the public key for `CPANEL_SSH_KEY` is not in `~/.ssh/authorized_keys` on the server. Verify with `ssh -p 54327 kbkbsuzc@patriciomanquepillan.com` from your workstation.
- **`Load key "...": invalid format`** or **`not a valid key`**: the private key in `CPANEL_SSH_KEY` is corrupted (extra/missing newline, truncated). Re-paste the full contents of `~/.ssh/cpanel_deploy`, including header/footer lines.
- **Connection hangs / times out**: the server's firewall may be blocking GitHub Actions runner IPs. Confirm the server is reachable from your workstation first.
- **The existence of `~/.deploy.lock` is harmless when no deploy holds it**; the lock is attached to an open file descriptor, not the file's existence. Do not delete it. If a deploy appears hung, use `lslocks | grep .deploy.lock` to check whether a process currently holds the lock.
- **Staging `~/public_html_new/` is wiped and repopulated on every deploy**, so stale staging left by a failed deploy is overwritten on the next successful run.
- Verify disk space: `df -h ~`.

### Host key verification (optional hardening)

The pipeline currently relies on `appleboy/ssh-action`'s default host key behavior (it skips verification). To harden against MITM on the first connection, set the `fingerprint:` parameter in the workflow's ssh-action steps to the server's `SHA256:...` fingerprint and store it as a `CPANEL_SSH_FINGERPRINT` secret. Get the fingerprint once with:

```bash
ssh-keyscan -t ed25519 -p 54327 patriciomanquepillan.com 2>/dev/null | ssh-keygen -lf -
```

The output includes the fingerprint, e.g. `256 SHA256:abc123... user@host (ED25519)` — copy the `SHA256:abc123...` value.

### Site shows the old version after deploy

- Hard refresh (Cmd+Shift+R) — the index.html has `no-cache` so this should always pick up new versions.
- Check the workflow ran successfully (Actions tab).
- SSH in and verify `ls -la ~/public_html` shows recent timestamps.

### Build fails with "_htaccess missing from build output"

- Confirm the file exists at `public/_htaccess` (with underscore, not dot).
- Run `npm run build` locally and check `dist/portafolio/browser/_htaccess`.