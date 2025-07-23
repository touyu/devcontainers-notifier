#!/bin/bash

# https://docs.anthropic.com/en/docs/claude-code/hooks

# stdin から JSON を受け取り、変数に格納
input=$(cat)

EVENT=$(echo "$input" | jq -r '.hook_event_name')

# イベントタイプを確認して適切に処理
if [ "$EVENT" = "PreToolUse" ]; then
    # PreToolUse イベントの処理
    TOOL_NAME=$(echo "$input" | jq -r '.tool_name // "unknown"')
    FILE_PATH=$(echo "$input" | jq -r '.tool_input.file_path // ""')
    
    if [ -n "$FILE_PATH" ]; then
        MESSAGE="[$EVENT] ツール: $TOOL_NAME - ファイル: $(basename "$FILE_PATH")"
    else
        MESSAGE="[$EVENT] ツール: $TOOL_NAME"
    fi
    
elif [ "$EVENT" = "PostToolUse" ]; then
    # PostToolUse イベントの処理
    TOOL_NAME=$(echo "$input" | jq -r '.tool_name // "unknown"')
    SUCCESS=$(echo "$input" | jq -r '.tool_response.success // true')
    
    if [ "$SUCCESS" = "true" ]; then
        MESSAGE="[$EVENT] ツール完了: $TOOL_NAME"
    else
        MESSAGE="[$EVENT] ツール失敗: $TOOL_NAME"
    fi
    
elif [ "$EVENT" = "Notification" ]; then
    # Notification イベントの処理
    NOTIFICATION_MSG=$(echo "$input" | jq -r '.message // "Notification"')
    MESSAGE="[$EVENT] $NOTIFICATION_MSG"
    
elif [ "$EVENT" = "UserPromptSubmit" ]; then
    # UserPromptSubmit イベントの処理
    PROMPT=$(echo "$input" | jq -r '.prompt // ""' | head -c 50)
    if [ -n "$PROMPT" ]; then
        MESSAGE="[$EVENT] ユーザープロンプト: $PROMPT..."
    else
        MESSAGE="[$EVENT] ユーザープロンプトが送信されました"
    fi
    
elif [ "$EVENT" = "Stop" ]; then
    # Stop イベントの処理
    MESSAGE="[$EVENT] Claude Code が停止しました"
    
elif [ "$EVENT" = "SubagentStop" ]; then
    # SubagentStop イベントの処理
    MESSAGE="[$EVENT] サブエージェントが停止しました"
    
elif [ "$EVENT" = "PreCompact" ]; then
    # PreCompact イベントの処理
    TRIGGER=$(echo "$input" | jq -r '.trigger // "unknown"')
    if [ "$TRIGGER" = "manual" ]; then
        MESSAGE="[$EVENT] 手動でのコンテキスト圧縮"
    else
        MESSAGE="[$EVENT] 自動でのコンテキスト圧縮"
    fi
    
else
    # 不明なイベントの処理
    MESSAGE="[$EVENT] 不明なイベント"
fi

# コンテナ内かホストかを判定
if [ -f /.dockerenv ]; then
    # コンテナ内で実行中
    NOTIFY_URL="http://host.docker.internal:3456/notify"
else
    # ホストで実行中
    NOTIFY_URL="http://localhost:3456/notify"
fi

# 拡張機能のサーバーに HTTP 経由で通知を送信
curl -X POST "$NOTIFY_URL" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Claude Code\",\"message\":\"$MESSAGE\"}" \

# 元のフックの動作を継続
exit 0