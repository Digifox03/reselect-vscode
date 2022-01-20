import * as vscode from 'vscode';

import entities from './entities.json';
import functions from './functions.json';

const allSyntax = [
	new vscode.CompletionItem("if", vscode.CompletionItemKind.Keyword),
	new vscode.CompletionItem("then", vscode.CompletionItemKind.Keyword),
	new vscode.CompletionItem("elseif", vscode.CompletionItemKind.Keyword),
	new vscode.CompletionItem("else", vscode.CompletionItemKind.Keyword),
	new vscode.CompletionItem("let", vscode.CompletionItemKind.Keyword),
	new vscode.CompletionItem("in", vscode.CompletionItemKind.Keyword),
	new vscode.CompletionItem("end", vscode.CompletionItemKind.Keyword),
	new vscode.CompletionItem("and", vscode.CompletionItemKind.Operator),
	new vscode.CompletionItem("or", vscode.CompletionItemKind.Operator),
	new vscode.CompletionItem("not", vscode.CompletionItemKind.Operator),
];

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

class SyntaxProvider implements vscode.CompletionItemProvider {
	public provideCompletionItems() {
		return allSyntax;
	}
}

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
	const syntaxProvider = vscode.languages.registerCompletionItemProvider(
		"reselect", new SyntaxProvider()
	);
	context.subscriptions.push(
		parameterProvider,
		functionProvider,
		syntaxProvider
	);	
}

export function deactivate() {}
