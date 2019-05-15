'use strict';

import * as vscode from 'vscode';
import * as path from 'path';

import ExtensionConfig from "./utils/ExtensionConfig";
import DatamodelerTreeDataProvider from './tree/DatamodelerTreeDataProvider';

function loadScript(context: vscode.ExtensionContext, path: string) {
	return `<script src="${vscode.Uri.file(context.asAbsolutePath(path))
		.with({ scheme: 'vscode-resource' })
		.toString()}"></script>`;
}

export default class ExtensionManager {
	public activate(context: vscode.ExtensionContext) {

		let dataProvider = new DatamodelerTreeDataProvider();

		context.subscriptions.push(
			vscode.window.registerTreeDataProvider(ExtensionConfig.DataModelerViewId, dataProvider),
			vscode.commands.registerCommand(ExtensionConfig.Commands.Render, () => {
				const panel = vscode.window.createWebviewPanel(
					ExtensionConfig.ExtensionId,
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
            ${loadScript(context, 'out/dataModeler.js')}
          </body>
          </html>
      `;
			})
		);
	}
	public deactivate() {}
}
