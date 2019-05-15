import * as vscode from "vscode";

import ExtensionConfig from "../utils/ExtensionConfig";


export enum SymbolKind {
	Namespace = "namespace",
	Class = "class",
	Enum = "enum",
	Interface = "interface",
	Typedef = "typedef"
}

export enum SymbolVisibility {
	Public = "public",
	Protected = "protected",
	Private = "private",
	Hidden = "hidden"
}
export interface IDatamodelerReferenceIndexSymbol {
	name: string;
	visibility: SymbolVisibility;
}

export default class DatamodelerTreeItem extends vscode.TreeItem {
	public children: DatamodelerTreeItem[] = [];
	public parent!: DatamodelerTreeItem;
	public symbol!: IDatamodelerReferenceIndexSymbol;
	public wrapperOnly: boolean = false;

	private get HasChildren() {
		return this.children.length > 0;
	}

	public get IsRoot() {
		return this.parent === null || this.parent === undefined;
	}

	constructor(symbol?: IDatamodelerReferenceIndexSymbol) {
		super(symbol ? symbol.name : "");

		this.symbol = symbol || {} as IDatamodelerReferenceIndexSymbol;
		this.update();
	}

	public update(): DatamodelerTreeItem {
		this.id = this.symbol.name;
		this.label = this.IsRoot ? this.symbol.name : this.symbol.name.replace(`${this.parent.symbol.name}.`, "");
		this.collapsibleState = this.HasChildren ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;

		this.command = this.wrapperOnly ? undefined : {
			command: ExtensionConfig.Commands.Render,
			title: "Go"
		};

		return this;
	}
}
