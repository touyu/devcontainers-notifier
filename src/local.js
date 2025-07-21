const vscode = require('vscode');
const express = require('express');
const bodyParser = require('body-parser');
const notifier = require('node-notifier');

function activate(context) {    
    // 出力チャンネルを作成
    const outputChannel = vscode.window.createOutputChannel('Dev Containers Notifier');
    outputChannel.appendLine(`[${new Date().toISOString()}] Dev Containers Notifier activated`);
    
    let config = vscode.workspace.getConfiguration('devcontainers-notifier');
    let server = null;
    
    // 初回起動（enabledがtrueの場合のみ）
    if (config.get('enabled')) {
        server = setupServer(config, outputChannel);
    } else {
        outputChannel.appendLine(`[${new Date().toISOString()}] Dev Containers Notifier is disabled`);
    }
    
    // 設定変更を監視
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('devcontainers-notifier')) {
                config = vscode.workspace.getConfiguration('devcontainers-notifier');
                const enabled = config.get('enabled');
                
                // 既存のサーバーを停止
                if (server) {
                    server.close();
                    server = null;
                    outputChannel.appendLine(`[${new Date().toISOString()}] Server stopped`);
                }
                
                // enabledの場合のみサーバーを起動
                outputChannel.appendLine(`[${new Date().toISOString()}] Configuration changed: enabled=${enabled}`);
                if (enabled) {
                    outputChannel.appendLine(`[${new Date().toISOString()}] Starting server...`);
                    server = setupServer(config, outputChannel);
                } else {
                    outputChannel.appendLine(`[${new Date().toISOString()}] Dev Containers Notifier is disabled`);
                }
            }
        })
    );
    
    // クリーンアップ時にサーバーを停止
    context.subscriptions.push({
        dispose: () => {
            if (server) {
                server.close();
                outputChannel.appendLine(`[${new Date().toISOString()}] Server stopped`);
            }
            outputChannel.dispose();
        }
    });
}

// サーバーセットアップ関数
function setupServer(config, outputChannel) {
    const port = config.get('port');
    const app = express();
    app.use(bodyParser.json());
    
    app.post('/notify', (req, res) => {
        const title = req.body.title;
        const message = req.body.message;
        
        // リクエストログを出力
        outputChannel.appendLine(`[${new Date().toISOString()}] Received POST /notify`);
        outputChannel.appendLine(`  Title: ${title}`);
        outputChannel.appendLine(`  Message: ${message}`);

        // macOSのネイティブ通知
        notifier.notify({
            title: title,
            message: message,
            sound: config.get('sound'), // 常に最新の設定値を使用
            wait: false
        });
        
        outputChannel.appendLine(`  Status: Notification sent successfully`);
        res.sendStatus(204);
    });
    
    // サーバー起動
    const server = app.listen(port, '0.0.0.0', () => {
        console.log(`Dev Containers Notifier HTTP server listening on port ${port}`);
        outputChannel.appendLine(`[${new Date().toISOString()}] HTTP server started on port ${port}`);
    });
    
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is already in use - assuming another VS Code window is running the server`);
            outputChannel.appendLine(`[${new Date().toISOString()}] Port ${port} is already in use - server not started`);
            return null;
        } else {
            vscode.window.showErrorMessage(
                `Dev Containers Notifier: Failed to start server: ${err.message}`
            );
            console.error('Server startup error:', err);
            outputChannel.appendLine(`[${new Date().toISOString()}] Server error: ${err.message}`);
        }
    });
    
    return server;
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};