#!/bin/bash

# https://docs.anthropic.com/en/docs/claude-code/hooks#userpromptsubmit-input

# Read JSON from stdin and store it in a variable.
input=$(cat)

EVENT=$(echo "$input" | jq -r '.hook_event_name')

# Check event type and handle accordingly
if [ "$EVENT" = "PreToolUse" ]; then
    # Handle PreToolUse event
    TOOL_NAME=$(echo "$input" | jq -r '.tool_name // "unknown"')
    FILE_PATH=$(echo "$input" | jq -r '.tool_input.file_path // ""')
    
    if [ -n "$FILE_PATH" ]; then
        MESSAGE="[$EVENT] Tool: $TOOL_NAME - File: $(basename "$FILE_PATH")"
    else
        MESSAGE="[$EVENT] Tool: $TOOL_NAME"
    fi
    
elif [ "$EVENT" = "PostToolUse" ]; then
    # Handle PostToolUse event
    TOOL_NAME=$(echo "$input" | jq -r '.tool_name // "unknown"')
    SUCCESS=$(echo "$input" | jq -r '.tool_response.success // true')
    
    if [ "$SUCCESS" = "true" ]; then
        MESSAGE="[$EVENT] Tool completed: $TOOL_NAME"
    else
        MESSAGE="[$EVENT] Tool failed: $TOOL_NAME"
    fi
    
elif [ "$EVENT" = "Notification" ]; then
    # Handle Notification event
    NOTIFICATION_MSG=$(echo "$input" | jq -r '.message // "Notification"')
    MESSAGE="[$EVENT] $NOTIFICATION_MSG"
    
elif [ "$EVENT" = "UserPromptSubmit" ]; then
    # Handle UserPromptSubmit event
    PROMPT=$(echo "$input" | jq -r '.prompt // ""' | head -c 50)
    if [ -n "$PROMPT" ]; then
        MESSAGE="[$EVENT] User prompt: $PROMPT..."
    else
        MESSAGE="[$EVENT] User prompt submitted"
    fi
    
elif [ "$EVENT" = "Stop" ]; then
    # Handle Stop event
    MESSAGE="[$EVENT] Claude Code stopped"
    
elif [ "$EVENT" = "SubagentStop" ]; then
    # Handle SubagentStop event
    MESSAGE="[$EVENT] Subagent stopped"
    
elif [ "$EVENT" = "PreCompact" ]; then
    # Handle PreCompact event
    TRIGGER=$(echo "$input" | jq -r '.trigger // "unknown"')
    if [ "$TRIGGER" = "manual" ]; then
        MESSAGE="[$EVENT] Manual context compaction"
    else
        MESSAGE="[$EVENT] Auto context compaction"
    fi
    
else
    # Handle unknown events
    MESSAGE="[$EVENT] Unknown event"
fi

# Determine if running in container or on host
if [ -f /.dockerenv ]; then
    # Running in container
    NOTIFY_URL="http://host.docker.internal:3456/notify"
else
    # Running on host
    NOTIFY_URL="http://localhost:3456/notify"
fi

# Send notification via HTTP to the extension's server
curl -X POST "$NOTIFY_URL" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Claude Code\",\"message\":\"$MESSAGE\"}" \

# Continue with the original hook behavior
exit 0