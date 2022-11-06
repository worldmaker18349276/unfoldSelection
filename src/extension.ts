import * as vscode from 'vscode';

function findVisibleSelectionLines(editor: vscode.TextEditor) {
    let selectionLines: number[] = [];
    for (const selection of editor.selections) {
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
}

function foldSelection(editor: vscode.TextEditor, editorEdit: vscode.TextEditorEdit, args: {'levels'?: number, 'direction'?: string} = {}) {
    const selectionLines = findVisibleSelectionLines(editor);
    return vscode.commands.executeCommand('editor.fold', Object.assign(args, { selectionLines }));
}

function unfoldSelection(editor: vscode.TextEditor, editorEdit: vscode.TextEditorEdit, args: {'levels'?: number, 'direction'?: string} = {}) {
    const selectionLines = findVisibleSelectionLines(editor);
    return vscode.commands.executeCommand('editor.unfold', Object.assign(args, { selectionLines }));
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand('unfoldselection.foldSelection', foldSelection),
        vscode.commands.registerTextEditorCommand('unfoldselection.unfoldSelection', unfoldSelection)
    );
}

export function deactivate() { }
