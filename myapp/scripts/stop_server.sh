#!/bin/bash
set -e

# Stop pm2 app if present
if command -v pm2 >/dev/null 2>&1; then
  pm2 delete notes-app || true
fi

# Otherwise kill running node process (demo)
pkill -f "node index.js" || true
