import * as vscode from 'vscode';

let KINDS_TO_FOLD = [vscode.SymbolKind.Method, vscode.SymbolKind.Property, vscode.SymbolKind.Constructor, vscode.SymbolKind.Function, vscode.SymbolKind.Operator];
let KINDS_TO_FOLD_CLASSES = [vscode.SymbolKind.Class, vscode.SymbolKind.Interface];
const outputChannel = vscode.window.createOutputChannel("flexible-code-folder")

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('extension.flexibleFoldNow', flexibleFoldNow));
	
}
//ttbirlx2ykm33yscgkykhumi7pvs3yg3bgkbmu65nhg7sb7wefeq
export function deactivate() {}


function flexibleFoldNow(classes: boolean = true) {
	const activeEditor = vscode.window.activeTextEditor;

	if (activeEditor === undefined) {
		return;
	}

	vscode.commands.executeCommand<vscode.DocumentSymbol[]>("vscode.executeDocumentSymbolProvider", activeEditor.document.uri).then(
		function (symbols: vscode.DocumentSymbol[] | undefined) {
			//console.log("symbols", symbols);

			if (symbols === undefined) {
				return;
			}

			let symbolsToFold: vscode.DocumentSymbol[] = [];
			populateAllSymbols(symbols, symbolsToFold);

			let kinds = KINDS_TO_FOLD;
			if (classes) {
				kinds = kinds.concat(KINDS_TO_FOLD_CLASSES);
			}

			symbolsToFold = symbolsToFold.filter(symbol => {
				return kinds.includes(symbol.kind);
			});

			symbolsToFold = symbolsToFold.filter(symbol => {
				return !symbol.range.isSingleLine;
			});

			const exclusedSymbolPrefixes = (vscode.workspace.getConfiguration("flexibleCodeFolder").get("preventFoldingThesePrefixes") as string).split(",")

			symbolsToFold = symbolsToFold.filter(symbol=>{
				return  !exclusedSymbolPrefixes.some((val)=>symbol.name.startsWith(val) ) 

			})

			actuallyFold(activeEditor, symbolsToFold);
		}
	);
}

function populateAllSymbols(source: vscode.DocumentSymbol[], dest: vscode.DocumentSymbol[]) {
	for (let symbol of source) {
		dest.push(symbol);
		if (symbol.children) {
			populateAllSymbols(symbol.children, dest);
		}
	}
}

async function actuallyFold(activeEditor: vscode.TextEditor, symbols: vscode.DocumentSymbol[]) {
	await vscode.commands.executeCommand("editor.unfoldAll");

	let lines: number[] = [];
	for (let symbol of symbols) {
		console.log("Folding", vscode.SymbolKind[symbol.kind], symbol.name, "in line", symbol.selectionRange.start.line + 1);

		lines.push(symbol.selectionRange.start.line);
	}

	outputChannel.appendLine(`folding ${lines.join(",")}`)
	await vscode.commands.executeCommand("editor.fold", {selectionLines: lines});
	outputChannel.append(`... done`)
}