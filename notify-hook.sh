#!/bin/bash

# Claude Code Hook Script for DevContainer Notify

# Get the hook type from the first argument (if provided)
HOOK_TYPE="${1:-generic}"

# Construct the notification message
MESSAGE="Claude Code hook triggered: $HOOK_TYPE"

# Send notification via HTTP to the extension's server
curl -X POST http://localhost:3456/notify \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"$MESSAGE\"}" \
  --silent --fail || true

# Continue with the original hook behavior
exit 0