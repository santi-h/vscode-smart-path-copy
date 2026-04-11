import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { dirname, relative } from 'path';

type Rule = {
  pattern: string;
  command: string;
}

function getRules(): Rule[] {
  return vscode.workspace.getConfiguration().get<Rule[]>("smartPathCopy.rules", []);
}

function getPathFormat(): 'Windows' | 'POSIX' | 'Auto' {
  return vscode.workspace.getConfiguration().get<'Windows' | 'POSIX' | 'Auto'>('smartPathCopy.pathFormat', 'Auto');
}

function formatPath(filepath: string): string {
  const format = getPathFormat();

  if (format === 'Auto') {
    return filepath;
  }
  if (format === 'Windows') {
    return filepath.replaceAll('/', '\\');
  }
  // POSIX
  return filepath.replaceAll('\\', '/');
}

const keywords: Record<string, (activeTextEditor: vscode.TextEditor) => string> = {
  'rel_filepath': (activeTextEditor: vscode.TextEditor): string => {
    const activeFilepath = activeTextEditor.document.uri.fsPath;
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeTextEditor.document.uri);
    if (!workspaceFolder) {
      return formatPath(activeFilepath)
    }
    return formatPath(path.relative(workspaceFolder.uri.fsPath, activeFilepath));
  },
  'line_number': (activeTextEditor: vscode.TextEditor): string => {
    return `${activeTextEditor.selection.end.line + 1}`;
  },
  'ruby_filepath': (activeTextEditor: vscode.TextEditor): string => {
    const activeFilepath = activeTextEditor.document.uri.fsPath;
    const rootDir = vscode.workspace.getWorkspaceFolder(activeTextEditor.document.uri)?.uri.path;

    if (!rootDir) {
      return formatPath(activeFilepath)
    }

    let dir = activeFilepath;

    if (!fs.lstatSync(activeFilepath).isDirectory()) {
      dir = path.dirname(activeFilepath);
    }

    while (dir.length > 1) {
      const gemfilePath = path.join(dir, 'Gemfile');
      const gemfileLockPath = path.join(dir, 'Gemfile.lock');

      if (fs.existsSync(gemfilePath) || fs.existsSync(gemfileLockPath)) {
        return formatPath(relative(dir, activeFilepath));
      }

      if (dir === rootDir || dir.length <= rootDir.length ) {
        break;
      }

      dir = path.dirname(dir);
    }

    return formatPath(vscode.workspace.asRelativePath(activeFilepath, false));
  },
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('smartPathCopy.run', run);
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

  for (const rule of getRules()) {
    const match = activeFilepath.match(new RegExp(rule.pattern));

    if (match) {
      const command = rule.command.replace(/\$(\w+)/g, (_, keyword) => {
        if (/^\d+$/.test(keyword)) {
          return match[parseInt(keyword)] ?? '';
        }
        return keywords[keyword](activeTextEditor) ?? '';
      });

      vscode.env.clipboard.writeText(command);
      vscode.window.showInformationMessage(command);
      return;
    }
  }
}
