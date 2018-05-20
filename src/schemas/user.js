const Promise = require('bluebird');
const crypto = require('crypto');

const iteritation = global.hash.iteritation || 100000;
const bits = global.hash.bits || 512;
const digest = global.hash.digest || 'sha512';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
	userid: String,
	name: String,
	salt: String,
	pass: String,
	schoolnum : Number
});

User.statics.create = function(userid, name, schoolnum, salt, pass) {
	const user = new this({
		userid,
		name,
		schoolnum,
		salt,
		pass
	});

	return user.save();
};

User.statics.findByUserID = function(userid) {
	return this.find({
		userid
	}).exec();
};

User.statics.findByName = function(name) {
	return this.find({
		name
	}).exec();
};

User.methods.updatePass = function(salt, pass) {
	this.salt = salt;
	this.pass = pass;

	return this.save();
};

User.methods.verify = function (pass) {
	return new Promise((resolve, reject) => {
		crypto.pbkdf2(Buffer.from(this.salt, 'hex'), pass, iteritation, bits, digest, (err, key) => {
			if (err) {
				reject(err);
			}
			else {
				resolve(this.pass === key.toString('hex'));
			}
		});
	});
};

module.exports = mongoose.model('User', User);
