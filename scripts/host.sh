# curl -X POST http://localhost:3456/notify \
#   -H "Content-Type: application/json" \
#   -d '{"title":"TEST_TITLE", "message":"Test Message"}'

curl -X POST http://localhost:3456/notify \
  -H "Content-Type: application/json" \
  -d '{"title":"Claude Code", "message":"処理が完了しました"}'
