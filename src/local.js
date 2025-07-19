const vscode = require('vscode');
const express = require('express');
const bodyParser = require('body-parser');
const notifier = require('node-notifier');

function activate(context) {    
    const config = vscode.workspace.getConfiguration('devcontainers-notifier');
    const enabled = config.get('enabled');
    
    if (!enabled) {
        console.log('Dev Containers Notifier is disabled for this workspace');
        return;
    }
    
    const port = config.get('port');
    const sound = config.get('sound');
    
    // HTTPサーバーを起動
    const app = express();
    app.use(bodyParser.json());
    
    app.post('/notify', (req, res) => {
        const title = req.body.title;
        const message = req.body.message;

        // macOSのネイティブ通知
        notifier.notify({
            title: title,
            message: message,
            sound: sound, // 設定から取得した通知音を使用
            // bundleId: 'com.microsoft.VSCode',
            // icon: '/Applications/Visual Studio Code.app/Contents/Resources/app/resources/win/code.png',
            wait: false
        });
        
        res.sendStatus(204);
    });
    
    const server = app.listen(port, '0.0.0.0', () => {
        console.log(`Dev Containers Notifier HTTP server listening on port ${port}`);
    });
    
    // クリーンアップ時にサーバーを停止
    context.subscriptions.push({
        dispose: () => {
            server.close();
        }
    });
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};