import * as vscode from 'vscode';
import { analyzeCode } from './analyzer';
import { speak } from './voice'; // Voice feedback system

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.workspace.onDidChangeTextDocument((event) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const code = editor.document.getText();
        const message = analyzeCode(code);
        if (message) {
            speak(message); // Speak out the feedback
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
