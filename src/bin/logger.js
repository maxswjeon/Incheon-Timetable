const path = require('path');
const fs = require('fs');

//Logger modules
const winston = require('winston');

//Check Log Folder and Create it if doesn't Exist
try {
	fs.accessSync(path.join(global.rootPath, 'logs'), fs.constants.R_OK | fs.constants.W_OK);
}
catch (err) {
	fs.mkdirSync(path.join(global.rootPath, 'logs'));
}

//Winston Configuration
winston.configure({
	transports : [
		new winston.transports.File({
			name : 'log_error',
			filename : path.join(global.rootPath, 'logs/error.log'),
			level : 'error'
		}),
		new winston.transports.File({
			name : 'log_info',
			filename : path.join(global.rootPath, 'logs/info.log')
		})
	]
});

if (process.env.NODE_ENV !== 'production') {
	winston.add(winston.transports.Console);
}

module.exports = winston;