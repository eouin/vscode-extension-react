import { Singleton } from "typescript-ioc";
import * as vscode from 'vscode';
import * as path from "path";

export type SAPUXDataModeler = "DataModeler";

interface IConfigurationEntry<T> {
	key: string;
	default: T;
}

interface IConfigurationEntries {
	Datamodeler: IConfigurationEntry<SAPUXDataModeler>;
	Version: IConfigurationEntry<string>;
}

@Singleton
export default class ExtensionConfig {
	private _onChange = new vscode.EventEmitter<void>();
	readonly onChange = this._onChange.event;

	static readonly ExtensionId = "datamodeler";
	static readonly DataModelerViewId = "datamodelerCanvas";

	static readonly Commands = {
		Render: "extension.sapux.datamodeler.render",
		ClearCache: "extension.sapux.datamodeler.clearCache"
	};

	public get ProjectRoot(): string {
		return path.join(__dirname, "../../");
	}

	constructor(
		private code: typeof vscode
	) {
		code.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(ExtensionConfig.ExtensionId)) {
				this._onChange.fire();
			}
		});
	}

	static readonly ConfigurationEntry: IConfigurationEntries = {
		Datamodeler: {
			key: "datamodeler",
			default: "DataModeler"
		},
		Version: {
			key: "version",
			default: ""
		}
	};

	getSAPUXDataModeler(): SAPUXDataModeler {
		return this.getConfiguration(ExtensionConfig.ConfigurationEntry.Datamodeler);
	}

	getSAPUXDataModelerVersion(): string {
		return this.getConfiguration(ExtensionConfig.ConfigurationEntry.Version);
	}

	private getConfiguration<T>(entry: IConfigurationEntry<T>): T {
		return this.code.workspace
			.getConfiguration(ExtensionConfig.ExtensionId)
			.get<T>(entry.key)
			|| entry.default as T;
	}
}
