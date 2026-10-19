#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
node -e 'if (process.versions.node.split(".")[0] !== "24") throw new Error("Node.js 24 requis")'
npm ci --cache /workspace/.cache/npm
mkdir -p .cache
npm run skills:setup > .cache/skills-setup.log 2>&1
npm run skills:status
npm run build
npm test
