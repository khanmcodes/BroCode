import * as vscode from 'vscode';
import { TextToSpeechClient, protos } from '@google-cloud/text-to-speech';
import { writeFile } from 'fs/promises';
import * as path from 'path';

const client = new TextToSpeechClient();

export async function speak(text: string) {
    const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
        input: { text },
        voice: {
            languageCode: 'en-US',
            ssmlGender: protos.google.cloud.texttospeech.v1.SsmlVoiceGender.NEUTRAL,
        },
        audioConfig: { audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3 },
    };

    try {
        const [response] = await client.synthesizeSpeech(request);
        const audioContent = response.audioContent;

        if (audioContent) {
            const tempPath = path.join(__dirname, 'output.mp3');
            await writeFile(tempPath, audioContent);
            vscode.window.showInformationMessage(`BroCode says: ${text}`);
        } else {
            vscode.window.showErrorMessage('BroCode failed to generate speech.');
        }
    } catch (error) {
        vscode.window.showErrorMessage('Error generating speech: ' + error);
    }
}
