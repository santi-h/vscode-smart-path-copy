import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { dirname, relative } from 'path';

// TODO: make rules configurable options
const rules = [
  ['_spec\\.rb$', 'rspec $ruby_filepath:$line_number'],
  ['db\/migrate\/(\\d{14})_\\w+\\.rb$', 'rake db:migrate:up VERSION=$1'],
]

const keywords: Record<string, (activeTextEditor: vscode.TextEditor) => string> = {
  'line_number': (activeTextEditor: vscode.TextEditor): string => {
    return `${activeTextEditor.selection.end.line + 1}`;
  },
  'ruby_filepath': (activeTextEditor: vscode.TextEditor): string => {
    const activeFilepath = activeTextEditor.document.uri.fsPath;
    const rootDir = vscode.workspace.getWorkspaceFolder(activeTextEditor.document.uri)?.uri.path;

    if (!rootDir) {
      return activeFilepath;
    }

    let dir = activeFilepath;

    if (!fs.lstatSync(activeFilepath).isDirectory()) {
      dir = path.dirname(activeFilepath);
    }

    while (dir.length > 1) {
      const gemfilePath = path.join(dir, 'Gemfile');
      const gemfileLockPath = path.join(dir, 'Gemfile.lock');

      if (fs.existsSync(gemfilePath) || fs.existsSync(gemfileLockPath)) {
        return relative(dir, activeFilepath);
      }

      if (dir === rootDir || dir.length <= rootDir.length ) {
        break;
      }

      dir = path.dirname(dir);
    }

    return vscode.workspace.asRelativePath(activeFilepath, false);
  },
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('vscode-smart-path-copy.run', run);
  context.subscriptions.push(disposable);
}

export function deactivate() { }

async function run() {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (!activeTextEditor) {
    vscode.window.showInformationMessage('No active editor');
    return;
  }

  const activeFilepath = activeTextEditor.document.uri.fsPath;

  for (const [pattern, template] of rules) {
    const match = activeFilepath.match(new RegExp(pattern));

    if (match) {
      const command = template.replace(/\$(\w+)/g, (_, keyword) => {
        if (/^\d+$/.test(keyword)) {
          return match[parseInt(keyword)] ?? '';
        }
        return keywords[keyword](activeTextEditor) ?? '';
      });

      vscode.env.clipboard.writeText(command);
      vscode.window.showInformationMessage(command);
    }
  }
}
