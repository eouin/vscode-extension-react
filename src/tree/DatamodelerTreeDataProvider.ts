import * as vscode from "vscode";
import DatamodelerTreeItem from "./DatamodelerTreeItem";
import { Inject } from "typescript-ioc";
import ExtensionConfig from "../utils/ExtensionConfig";

interface DatamodelerTree {
	[key: string]: DatamodelerTreeItem;
}
export enum SymbolVisibility {
	Public = "public",
	Protected = "protected",
	Private = "private",
	Hidden = "hidden"
}

export default class ApiTreeDataProvider implements vscode.TreeDataProvider<DatamodelerTreeItem> {
	private tree!: DatamodelerTree;
	@Inject private extensionConfig!: ExtensionConfig;

	private _onDidChangeTreeData: vscode.EventEmitter<DatamodelerTreeItem | undefined> = new vscode.EventEmitter<DatamodelerTreeItem | undefined>();
	readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

	constructor() {
		this.extensionConfig.onChange(() => this.refresh());
	}

	async clearCache(): Promise<any> {
		this.refresh();
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: DatamodelerTreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element.update();
	}

	async getChildren(element?: DatamodelerTreeItem | undefined): Promise<DatamodelerTreeItem[]> {
		let tree = await this.parseTree(element === undefined);

		if (!element) {
			return this.getRoots(tree);
		}

		return this.getChildrenFor(tree, element);
	}

	private async getRoots(tree: DatamodelerTree): Promise<DatamodelerTreeItem[]> {
		return Object.keys(tree)
			.map(key => tree[key])
			.filter(item => item.IsRoot);
	}

	private async getChildrenFor(tree: DatamodelerTree, element: DatamodelerTreeItem): Promise<DatamodelerTreeItem[]> {
		return element.children;
	}

	private async parseTree(force: boolean): Promise<DatamodelerTree> {
		if (this.tree && !force) {
			return this.tree;
		}

		let cds = this.createWrapperItem("cds");
		this.tree = {};
		this.tree["cds"] = cds;

		return this.tree;
	}

	private createWrapperItem(label: string): DatamodelerTreeItem {
		let item = new DatamodelerTreeItem({
			name: label,
			visibility: SymbolVisibility.Public
		});

		item.wrapperOnly = true;
		return item;
	}

}
