//Logger Modules
const winston = require('winston');

//MongoDB Modules
const mongoose = require('mongoose');
const autoinc = require('mongoose-auto-increment');

function Connect() {
	//Mongoose Configuration
	const db = mongoose.connection;
	db.on('error', winston.error);
	db.once('open', () => {
		winston.info('Connected to mongod Server');
		autoinc.initialize(db);
	});
	mongoose.connect(global.secret.mongodb.url);
	autoinc.initialize(db);
}

module.exports = {
	connect : Connect
};