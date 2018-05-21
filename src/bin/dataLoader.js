//Node JS Core Modules
const path = require('path');
const fs = require('fs');

//Logger Moudles
const winston = require('winston');

//Excel Modules
const xlsxParser = require('xlsx');
const xlsxUtils = xlsxParser.utils;

//Check Data Folder and Create it if doesn't Exist
let index = 0;
try {
	fs.accessSync(path.join(global.rootPath, 'src/data'), fs.constants.R_OK | fs.constants.W_OK);
	index = 1;

	fs.accessSync(path.join(global.rootPath, 'src/data/grade2'), fs.constants.R_OK | fs.constants.W_OK);
	index = 2;

	fs.accessSync(path.join(global.rootPath, 'src/data/grade3'), fs.constants.R_OK | fs.constants.W_OK);
	index = 3;
}
catch (err) {
	switch (index) {
	case 0:
		winston.warn('Data Directory Not Found, Making Directory');
		fs.mkdirSync(path.join(global.rootPath, 'src/data'));
		fs.mkdirSync(path.join(global.rootPath, 'src/data/grade2'));
		fs.mkdirSync(path.join(global.rootPath, 'src/data/grade3'));	
		break;
	case 1:
		winston.warn('Grade2 Directory Not Found, Making Directory');
		fs.mkdirSync(path.join(global.rootPath, 'src/data/grade2'));
		fs.mkdirSync(path.join(global.rootPath, 'src/data/grade3'));	
		break;
	case 2:
		winston.warn('Grade3 Directory Not Found, Making Directory');
		fs.mkdirSync(path.join(global.rootPath, 'src/data/grade3'));
	}
}

let pathGrade2 = global.data.grade2;
let pathGrade3 = global.data.grade3;

if (!path.isAbsolute(pathGrade2)) {
	pathGrade2 = path.join(global.rootPath, pathGrade2);
}

if (!path.isAbsolute(pathGrade3)) {
	pathGrade3 = path.join(global.rootPath, pathGrade3);
}

const doc = {
	grade2 : xlsxParser.readFile(pathGrade2),
	grade3 : xlsxParser.readFile(pathGrade3)
};

const sheets = {
	grade2 : {
		enroll : doc.grade2.Sheets[doc.grade2.SheetNames[0]],
		result : doc.grade2.Sheets[doc.grade2.SheetNames[1]]
	},
	grade3 : {
		enroll : doc.grade3.Sheets[doc.grade3.SheetNames[0]],
		result : doc.grade3.Sheets[doc.grade3.SheetNames[1]]
	}
};

fs.writeFileSync(path.join(global.rootPath, 'src/data/grade2/enroll.json'),
	JSON.stringify(xlsxUtils.sheet_to_json(sheets.grade2.enroll)));
fs.writeFileSync(path.join(global.rootPath, 'src/data/grade2/result.json'),
	JSON.stringify(xlsxUtils.sheet_to_json(sheets.grade2.result)));
fs.writeFileSync(path.join(global.rootPath, 'src/data/grade3/enroll.json'),
	JSON.stringify(xlsxUtils.sheet_to_json(sheets.grade3.enroll)));
fs.writeFileSync(path.join(global.rootPath, 'src/data/grade3/result.json'),
	JSON.stringify(xlsxUtils.sheet_to_json(sheets.grade3.result)));

module.exports = sheets;