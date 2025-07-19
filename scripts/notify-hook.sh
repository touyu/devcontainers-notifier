#!/bin/bash

# Claude Code Hook Script for Dev Containers Notifier

# Get the hook type from the first argument (if provided)
HOOK_TYPE="${1:-generic}"

# Construct the notification message
case "$HOOK_TYPE" in
  "NOTIFICATION")
    MESSAGE="Claude Codeからの通知"
    ;;
  "STOP")
    MESSAGE="Claude Codeの処理が完了しました"
    ;;
  *)
    MESSAGE="Claude Code: $HOOK_TYPE"
    ;;
esac

# Send notification via HTTP to the extension's server
curl -X POST http://host.docker.internal:3456/notify \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"$MESSAGE\"}" \

# Continue with the original hook behavior
exit 0