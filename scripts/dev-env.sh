#!/usr/bin/env bash
# Source this file from the project checkout. Does not change HOME or CODEX_HOME.
SPIDERBOX_REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
export PATH="$SPIDERBOX_REPO_ROOT/node_modules/.bin:$PATH"
export GSTACK_ROOT="$SPIDERBOX_REPO_ROOT/.agents/skills/gstack"
export GSTACK_STATE_ROOT="$SPIDERBOX_REPO_ROOT/.cache/gstack-state"
export BUN_INSTALL_CACHE_DIR="$SPIDERBOX_REPO_ROOT/.cache/bun"
export XDG_CONFIG_HOME="$SPIDERBOX_REPO_ROOT/.cache/xdg-config"
export XDG_CACHE_HOME="$SPIDERBOX_REPO_ROOT/.cache/xdg-cache"
export SUPERPOWERS_DISABLE_TELEMETRY=1
if command -v chromium >/dev/null 2>&1; then
  export CHROMIUM_PATH="$(command -v chromium)"
  export GSTACK_CHROMIUM_PATH="$CHROMIUM_PATH"
fi
# Container-local fixture QA only: gstack supports this for hosts without a SUID sandbox.
# Do not use imported real browser sessions with this setting.
if [ "${SPIDERBOX_LOCAL_BROWSER:-0}" = 1 ]; then
  export GSTACK_CHROMIUM_NO_SANDBOX=1
fi
mkdir -p "$GSTACK_STATE_ROOT" "$XDG_CONFIG_HOME" "$XDG_CACHE_HOME"
