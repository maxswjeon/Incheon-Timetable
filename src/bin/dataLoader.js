//Node JS Core Modules
const path = require('path');
const fs = require('fs');

//Logger Moudles
const winston = require('winston');

//Excel Modules
const xlsxParser = require('xlsx');
const xlsxUtils = xlsxParser.utils;

function CreateFolder() {
	//Check Data Folder and Create it if doesn't Exist
	try {
		fs.accessSync(path.join(global.rootPath, 'src/data'), fs.constants.R_OK | fs.constants.W_OK);
	}
	catch (err) {
		winston.warn('Data Directory Not Found, Making Directory');
		fs.mkdirSync(path.join(global.rootPath, 'src/data'));
	}

}

function InitFolder(folder) {
	if (!path.isAbsolute(folder)) {
		folder = path.join(global.rootPath, folder);
	}

	if (!fs.statSync(folder).isDirectory()) {
		winston.error('InitFolder Failed : %s is not directory', folder);
		return false;
	}

	const files = fs.readdirSync(folder);
	for (const index in files) {
		const file = files[index];
		const filePath = path.join(folder, file);
		if (fs.statSync(filePath).isDirectory()) {
			InitFolder(filePath);
		}
		else if (/.+\.json$/.test(file)) {
			fs.unlinkSync(filePath);
		}
	}
}

/**
 * Creates Internal `src/data` folder if doesn't Exist.  
 * Delete All Files in `src/data`
 */
function Init() {
	CreateFolder();
	InitFolder('src/data/');
}

/**
 * Parse Excel File (.xlsx) to JSON file(.json)
 * 
 * @param {String} filePath Original Excel File Path. Relative to root Folder.
 * @param {Number} sheetIndex Index Of Sheet to Parse
 * @param {String} name File Name to Save Parsed File. Needed to After Access.
 */
function Parse(filePath, sheetIndex, name) {
	name += '.json';

	if (!path.isAbsolute(filePath)) {
		filePath = path.join(global.rootPath, filePath);
	}

	if (!fs.statSync(filePath).isFile()) {
		return false;
	}

	const doc = xlsxParser.readFile(filePath);
	const sheet = doc.Sheets[doc.SheetNames[sheetIndex]];

	fs.writeFileSync(path.join(global.rootPath, 'src/data/', name),
		JSON.stringify(xlsxUtils.sheet_to_json(sheet)));
}

module.exports = {
	init : Init,
	parse : Parse
};