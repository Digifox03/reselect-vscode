import * as vscode from 'vscode';

import entities from './entities.json';
import functions from './functions.json';

const allEntities = entities.map((name) =>
	new vscode.CompletionItem(
		name, vscode.CompletionItemKind.Variable
	)
);

const allFunctions = functions.map((name) =>
	new vscode.CompletionItem(
		name, vscode.CompletionItemKind.Function
	)
);

const defaultCompletion = new vscode.CompletionItem(
	"default", vscode.CompletionItemKind.Variable
);

class ParameterProvider implements vscode.CompletionItemProvider {
	public provideCompletionItems(document: vscode.TextDocument) {
		if (document.isUntitled) {
			return [defaultCompletion, ...allEntities];
		}
		let entityName = document.fileName.replace("[.][^.]+$", "");	
		if (entityName in entities) {
			const completion = new vscode.CompletionItem(
				entityName, vscode.CompletionItemKind.Variable
			);
			return [completion, defaultCompletion];
		}
		return allEntities;
	}
}

class FunctionProvider implements vscode.CompletionItemProvider {
	public provideCompletionItems() {
		return allFunctions;
	}
}

export function activate(context: vscode.ExtensionContext) {
	const parameterProvider = vscode.languages.registerCompletionItemProvider(
		"reselect", new ParameterProvider()
	);
	const functionProvider = vscode.languages.registerCompletionItemProvider(
		"reselect", new FunctionProvider(), "."
	);
	context.subscriptions.push(parameterProvider, functionProvider);
}

export function deactivate() {}
