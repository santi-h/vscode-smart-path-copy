import * as vscode from 'vscode';

function run() {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (!activeTextEditor) {
      vscode.window.showInformationMessage('No active editor');
      return;
  }

  const relative_active_filepath = vscode.workspace.asRelativePath(activeTextEditor.document.uri.fsPath, false);
  const line_number = activeTextEditor.selection.end.line + 1;
  const command = `rspec ${relative_active_filepath}:${line_number}`;
  vscode.env.clipboard.writeText(command);
  vscode.window.showInformationMessage(command);
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('vscode-smart-path-copy.run', run);
  context.subscriptions.push(disposable);
}

export function deactivate() { }
