//Logger Modules
const winston = require('winston');

//MongoDB Modules
const mongoose = require('mongoose');
const autoinc = require('mongoose-auto-increment');

let db = null;

/**
 * Connects to Mongodb
 * 
 * @param {Function} callback Callback after Connect
 * @param {String} _url Specifies the URL where Server is running.
 * Default is defined at `global.secret.mongodb.url` 
 */
function Connect(callback, _url) {
	const url = _url || global.secret.mongodb.url;

	//Mongoose Configuration
	db = mongoose.connection;
	db.on('error', winston.error);
	db.once('open', () => {
		winston.info('Connected to mongod Server');
		if (callback){
			callback();
		}
	});
	autoinc.initialize(db);
	return mongoose.connect(url);
}

module.exports = {
	connect : Connect,
	connection : db,
	mongoose : mongoose
};