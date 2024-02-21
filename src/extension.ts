import * as vscode from 'vscode';

function run() {
  vscode.window.showInformationMessage('Hello World from vscode-smart-path-copy!');
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('vscode-smart-path-copy.run', run);
  context.subscriptions.push(disposable);
}

export function deactivate() { }
