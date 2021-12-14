const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const vscode = require('vscode');

/**
 * @param {{ subscriptions: vscode.Disposable[]; }} context
 */
function activate(context) {

	let addToModel = vscode.commands.registerCommand('flutter-bloc-generator.addToModel', async function (uri = vscode.Uri) {
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

	let blocGen = vscode.commands.registerCommand('flutter-bloc-generator.blocGen', async function (uri = vscode.Uri) {
		const p = await vscode.window.showInputBox({placeHolder: 'Enter package name (as home)'});
		const c = await vscode.window.showInputBox({placeHolder: 'Enter class name (as Home)'});
		if (p == undefined || c == undefined) vscode.window.showInformationMessage('Cancelled adding a bloc folder');
		else if (p == '' || c == '') vscode.window.showWarningMessage('Cannot add empty bloc folders');
		else {
			const copyPath = path.join(uri.fsPath, p);
			const blocPath = path.join(copyPath, 'bloc');
			const resPath = path.join(vscode.extensions.getExtension('DinithHerath.flutter-bloc-generator').extensionUri.fsPath, 'resources');
			fse.copySync(resPath, copyPath);
			var files = fse.readdirSync(blocPath);
			for (var file of files) {
				replaceFileWithName(blocPath, file, c, p);
			}
			vscode.window.showInformationMessage(`Bloc folder '${p}' created. Bloc and components folders can be found in that.`)
		}
	});

	context.subscriptions.push(addToModel);
	context.subscriptions.push(blocGen);
}

// this method is called when your extension is deactivated
function deactivate() { }


/**
 * @param {string} blocPath
 * @param {string} [fileName]
 * @param {string} [className]
 * @param {string} [packageName]
 */
function replaceFileWithName(blocPath, fileName, className, packageName) {
	var filePath = path.join(blocPath, fileName);
	fs.readFile(filePath, 'utf8', function (err, data) {
		if (err) vscode.window.showErrorMessage(err.message);
		var text = data.replaceAll('Template', className).replaceAll('template', packageName);
		fs.writeFile(filePath, text, function (err) {
			if (err) vscode.window.showErrorMessage(err.message);
			fs.rename(path.join(blocPath, fileName), path.join(blocPath, fileName.replace('template', packageName)), function (err) {
				if (err) vscode.window.showErrorMessage(err.message);
			});
		});
	});
}

module.exports = {
	activate,
	deactivate
};
