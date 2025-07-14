const vscode = require('vscode');

function activate(context) {
    const isRemote = vscode.env.remoteName !== undefined;
    
    if (isRemote) {
        const remote = require('./remote');
        remote.activate(context);
    } else {
        const local = require('./local');
        local.activate(context);
    }
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};