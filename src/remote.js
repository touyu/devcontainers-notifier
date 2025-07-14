const vscode = require('vscode');
const express = require('express');

let server;

function activate(context) {
    console.log('DevContainer Notify (Remote) is active');
    
    const config = vscode.workspace.getConfiguration('devcontainer-notify');
    const port = config.get('serverPort', 3456);
    
    // Start HTTP server to receive notifications
    const app = express();
    app.use(express.json());
    
    app.post('/notify', async (req, res) => {
        const { message } = req.body;
        
        try {
            await vscode.commands.executeCommand('devcontainer-notify.triggerNotification', message);
            res.json({ success: true });
        } catch (error) {
            console.error('Failed to send notification:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });
    
    server = app.listen(port, () => {
        console.log(`Notification server listening on port ${port}`);
    });
    
    const disposable = vscode.commands.registerCommand('devcontainer-notify.sendNotification', async (message) => {
        try {
            await vscode.commands.executeCommand('devcontainer-notify.triggerNotification', message);
        } catch (error) {
            console.error('Failed to send notification:', error);
        }
    });
    
    context.subscriptions.push(disposable);
}

function deactivate() {
    if (server) {
        server.close();
    }
}

module.exports = {
    activate,
    deactivate
};