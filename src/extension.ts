import * as vscode from 'vscode';
import textToSpeech from '@google-cloud/text-to-speech';
import * as fs from 'fs';
import * as util from 'util';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('brocode.speakText', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('Open a file and select text first!');
            return;
        }

        const text = editor.document.getText(editor.selection);
        if (!text) {
            vscode.window.showErrorMessage('No text selected!');
            return;
        }

        vscode.window.showInformationMessage(`Speaking: "${text}"`);

        // Google Cloud TTS setup
        const client = new textToSpeech.TextToSpeechClient();
        const request = {
            input: { text },
            voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
            audioConfig: { audioEncoding: 'MP3' },
        };

        try {
            const [response] = await client.synthesizeSpeech(request);
            const writeFile = util.promisify(fs.writeFile);
            const outputPath = `${context.globalStorageUri.fsPath}/output.mp3`;
            await writeFile(outputPath, response.audioContent as Buffer);
            vscode.window.showInformationMessage('Audio saved! Playing now...');

            // Play the generated speech (only works if OS supports `mpg123`)
            require('child_process').exec(`start ${outputPath}`);
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
