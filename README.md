# DevContainer Notify

Claude Codeのhooksと連携して、DevContainer内での処理完了時にホストPCへ通知を送るVSCode拡張機能です。

## 機能

- DevContainer内のClaude Codeのhooks実行時にホストPCへ通知
- VSCodeの通知とシステムビープ音（設定可能）
- シンプルな実装でリモート・ローカル間の通信を実現

## セットアップ

1. **拡張機能のインストール**
   ```bash
   npm install
   # VSCEがない場合: npm install -g vsce
   vsce package
   ```

2. **拡張機能のインストール**
   - 生成された`.vsix`ファイルをVSCodeにインストール

3. **DevContainerの設定**
   - `.devcontainer/devcontainer.json`に拡張機能を追加
   - `notify-hook.sh`をワークスペースに配置


## 設定

- `devcontainer-notify.enableSound`: システムビープ音の有効/無効（デフォルト: true）

## 使用方法

1. DevContainerを開く
2. 拡張機能が自動的に起動
3. Claude Codeでタスクを実行
4. hooks実行時にホストPCへ通知が送られる

## アーキテクチャ

この拡張機能は、VSCodeの拡張機能APIを活用してシンプルに実装されています：

- **リモート側（remote.js）**: DevContainer内で動作し、hooksからのトリガーを受け取る
- **ローカル側（local.js）**: ホストPCで動作し、通知を表示
- **通信**: VSCodeのコマンドAPIを使用（`vscode.commands.executeCommand`）