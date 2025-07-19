const vscode = require('vscode');

function activate(context) {
    const local = require('./local');
    local.activate(context);
}


function deactivate() {
    // context.subscriptionsのリソースを自動的にクリーンアップ
    // VSCodeが自動的に行うため、明示的な処理は不要
}

module.exports = {
    activate,
    deactivate
};