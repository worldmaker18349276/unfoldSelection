import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let findVisibleSelectionLines = (editor: vscode.TextEditor) => {
        let selectionLines: number[] = [];
        for (let selection of editor.selections) {
            for (let line = selection.start.line; line <= selection.end.line; line++) {
                if (selectionLines.includes(line)) {
                    continue;
                }
                let pos = selection.start.with(line, 0);
                if (editor.visibleRanges.some(range => range.contains(pos))) {
                    selectionLines.push(line);
                }
            }
        }

        selectionLines.sort((a, b) => a - b);
        return selectionLines;
    };

    let foldSelection = (args: {'levels'?: number, 'direction'?: string} = {}) => {
        let editor = vscode.window.activeTextEditor;
        if (editor === undefined) {
            return;
        }

        let selectionLines = findVisibleSelectionLines(editor);
        return vscode.commands.executeCommand('editor.fold', Object.assign(args, { selectionLines }));
    };

    let unfoldSelection = (args: {'levels'?: number, 'direction'?: string} = {}) => {
        let editor = vscode.window.activeTextEditor;
        if (editor === undefined) {
            return;
        }

        let selectionLines = findVisibleSelectionLines(editor);
        return vscode.commands.executeCommand('editor.unfold', Object.assign(args, { selectionLines }));
    };

    context.subscriptions.push(vscode.commands.registerCommand('unfoldselection.foldSelection', foldSelection));
    context.subscriptions.push(vscode.commands.registerCommand('unfoldselection.unfoldSelection', unfoldSelection));
}

export function deactivate() { }
