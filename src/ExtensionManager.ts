'use strict';

import * as vscode from 'vscode';
import * as path from 'path';

import { CDSProvider } from './nodeCDS';

function loadScript(context: vscode.ExtensionContext, path: string) {
	return `<script src="${vscode.Uri.file(context.asAbsolutePath(path))
		.with({ scheme: 'vscode-resource' })
		.toString()}"></script>`;
}

export default class ExtensionManager {
	public activate(context: vscode.ExtensionContext) {

    const nodeCDSProvider = new CDSProvider(vscode.workspace.rootPath);
		vscode.window.registerTreeDataProvider('sapux-datamodeler-canvas', nodeCDSProvider);

		context.subscriptions.push(
			vscode.commands.registerCommand('extemsion.sapux.datamodeler', () => {
				const panel = vscode.window.createWebviewPanel(
					'datamodeler',
					'SAP UX Data Modeler',
					vscode.ViewColumn.Active,
					{
						enableScripts: true,
						retainContextWhenHidden: true,
						localResourceRoots: [
							vscode.Uri.file(path.join(context.extensionPath, 'out'))
						]
					}
				);

				panel.webview.html = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          </head>
          <body>
            <div id="root"></div>
            ${loadScript(context, 'out/vendor.js')}
            ${loadScript(context, 'out/edReact.js')}
          </body>
          </html>
      `;
			})
		);
	}
	public deactivate() {}
}
