# Determine if running inside container or on host
if [ -f /.dockerenv ]; then
    NOTIFY_URL="http://host.docker.internal:3456/notify"
else
    NOTIFY_URL="http://localhost:3456/notify"
fi

curl -X POST "$NOTIFY_URL" \
  -H "Content-Type: application/json" \
  -d '{"title":"Dev Containers Notifier", "message":"[Test] Notifications from this extension are enabled!"}'
