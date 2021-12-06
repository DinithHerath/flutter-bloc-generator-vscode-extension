const fs = require('fs');
const vscode = require('vscode');

/**
 * @param {{ subscriptions: vscode.Disposable[]; }} context
 */
function activate(context) {

	console.log('Congratulations, your extension "flutter-bloc-generator" is now active!');

	let disposable = vscode.commands.registerCommand('flutter-bloc-generator.addToModel', async function (uri = vscode.Uri) {
		if (uri.fsPath.includes('state')) {
			const openPath = vscode.Uri.file(uri.fsPath);
			var text = '';
			const t = await vscode.window.showInputBox({placeHolder: 'Enter variable Type (as String)'});
			const v = await vscode.window.showInputBox({placeHolder: 'Enter variable name (as variableName)'});
			if (t == undefined || v == undefined) {
				vscode.window.showInformationMessage('Cancelled adding to the state file');
			} else if (t == '' || v == '') {
				vscode.window.showWarningMessage('Cannot add empty state variables');
			} else {
				vscode.workspace.openTextDocument(openPath).then(doc => {
					const lines = doc.getText().split('\n');
					var i = 1;
					for (let l = 0; l < lines.length; l++) {
						text += lines[l] + '\n';
						if (lines[l].trim().endsWith('{')) {
							if (i == 1) {
								i += 1;
								text += `final ${t} ${v};\n`;
							}
							else if (i == 2) {
								i += 1;
								text += `@required this.${v},\n`;
							}
							else if (i == 4) {
								i += 1;
								text += `${t} ${v},\n`;
							}
						}
						else if (lines[l].trim().endsWith('(')) {
							if (i == 3) {
								i += 1;
								text += `${v}: null,\n`;
							}
							else if (i == 5) {
								i += 1;
								text += `${v}: ${v} ?? this.${v},\n`;
							}
						}
					}
					fs.writeFileSync(uri.fsPath, text);
				});
			}
		} else {
			vscode.window.showWarningMessage('File should be a flutter bloc state file');
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
};
