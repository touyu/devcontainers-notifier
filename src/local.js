const vscode = require('vscode');
const notifier = require('node-notifier');

function activate(context) {
    console.log('DevContainer Notify (Local) is active');
    
    const config = vscode.workspace.getConfiguration('devcontainer-notify');
    const enableSound = config.get('enableSound', true);
    
    const disposable = vscode.commands.registerCommand('devcontainer-notify.triggerNotification', (message) => {
        const notificationMessage = message || 'Claude Code task completed!';
        
        // VSCode内の通知
        vscode.window.showInformationMessage(notificationMessage);
        
        // OS通知
        notifier.notify({
            title: 'Claude Code Notification',
            message: notificationMessage,
            sound: enableSound, // macOSでは'Ping'などの音名も指定可能
            wait: false
        });
    });
    
    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};