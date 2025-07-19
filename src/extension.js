const vscode = require('vscode');

function activate(context) {
    // 出力チャンネルを作成
    const outputChannel = vscode.window.createOutputChannel('DevContainer Notify');
    outputChannel.show();
    
    // 出力チャンネルに表示
    outputChannel.appendLine(`vscode.env.remoteName: ${vscode.env.remoteName}`);
    console.log("vscode.env.remoteName:", vscode.env.remoteName);
    
    // contextに出力チャンネルを保存（他のモジュールでも使えるように）
    context.subscriptions.push(outputChannel);
    context.workspaceState.update('outputChannel', outputChannel);
    
    const local = require('./local');
    local.activate(context);
    // const isRemote = vscode.env.remoteName !== undefined;

    // console.log("isRemote", isRemote)

    // if (!isRemote) {
    //     const local = require('./local');
    //     local.activate(context);
    // }

    // if (isRemote) {
    //     const remote = require('./remote');
    //     remote.activate(context);
    // } else {
        // const local = require('./local');
        // local.activate(context);
    // }
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};