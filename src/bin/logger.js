const path = require('path');

//Logger modules
const winston = require('winston');

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