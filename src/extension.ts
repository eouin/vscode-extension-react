'use strict';

import * as vscode from 'vscode';
import ExtensionManager from './ExtensionManager';

let manager = new ExtensionManager();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  manager.activate(context);
}

// this method is called when your extension is deactivated
export function deactivate() {
  manager.deactivate();
}
