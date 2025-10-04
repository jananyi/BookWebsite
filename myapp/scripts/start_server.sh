#!/bin/bash
set -e

DEST="/home/ec2-user/notes-app"
cd $DEST

# Start with pm2 if installed (preferred), else fallback to nohup
if command -v pm2 >/dev/null 2>&1; then
  # stop if running, then start
  pm2 delete notes-app || true
  pm2 start npm --name "notes-app" -- start
  pm2 save
else
  # fallback: run in background (simple demo)
  pkill -f "node index.js" || true
  nohup npm start > /tmp/notes-app.log 2>&1 &
fi
