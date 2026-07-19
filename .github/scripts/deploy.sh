#!/usr/bin/env bash
set -euo pipefail

KEEP="${RELEASES_TO_KEEP:-3}"
HOME_DIR="$HOME"
STAGING="$HOME_DIR/public_html_new"
LIVE="$HOME_DIR/public_html"
RELEASES_DIR="$HOME_DIR/releases"
TS="$(date -u +%Y-%m-%dT%H-%M-%S)"

log() { echo "[deploy $TS] $*"; }

LOCK="$HOME_DIR/.deploy.lock"
exec 9>"$LOCK"
if ! flock -n 9; then
  log "ERROR: another deploy is in progress, aborting"
  exit 1
fi

ARCHIVED_TS=""
# shellcheck disable=SC2154
trap 'rc=$?; if [ -n "$ARCHIVED_TS" ] && [ ! -d "$LIVE" ]; then mv "$RELEASES_DIR/$ARCHIVED_TS" "$LIVE" && log "rolled back: restored releases/$ARCHIVED_TS -> public_html"; fi; exit $rc' EXIT

if [ -f "$STAGING/_htaccess" ]; then
  mv "$STAGING/_htaccess" "$STAGING/.htaccess"
  log "renamed _htaccess -> .htaccess"
fi

if [ ! -f "$STAGING/index.html" ]; then
  log "ERROR: staging missing index.html, aborting before swap"
  exit 1
fi

mkdir -p "$RELEASES_DIR"

if [ -d "$LIVE" ]; then
  mv "$LIVE" "$RELEASES_DIR/$TS"
  log "archived current live -> releases/$TS"
  ARCHIVED_TS="$TS"
else
  log "no existing public_html, first deploy"
fi

mv "$STAGING" "$LIVE"
log "promoted staging -> public_html"

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
