# Fold to Definitions README

This extension is a fork from https://github.com/zeevro/vscode-fold-to-definitions

This folds source code based on the following symbolKinds (avoiding those symbols starting with prefixes confgured in the settings)

## Features

  - Avoids folding  the Symbolkinds [vscode.SymbolKind.Method, vscode.SymbolKind.Property, vscode.SymbolKind.Constructor, vscode.SymbolKind.Function, vscode.SymbolKind.Operator,vscode.SymbolKind.Class, vscode.SymbolKind.Interface];
  - Also, avoids folding the from amongst the rest - those with symbols starting with the list of prefixes given in the configuration setting

## Requirements

None

## Extension Settings

None yet

## Known Issues

Relies on symbols provided by language extentions.

## Release Notes

First version. WOO!

### 0.5.1

Initial release

### 0.6.0

  - renamed to `Flexible Code Folder`
  - added configuration `flexibleCodeFolder.preventFoldingThesePrefixes`
  - added command `flexibleFoldNow`
