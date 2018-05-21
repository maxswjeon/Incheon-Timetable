const crypto = require('crypto');

const iteritations = global.hash.iteritation || 100000;
const bits = global.hash.bits || 512;
const digest = global.hash.digest || 'sha512';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
	userid : String,
	salts : [String],
	pass : [String],
	schoolnum : Number,
	lectures : [String]
});

User.statics.create = function(userid, salts, pass, schoolnum) {
	const user = new this({
		userid,
		salts,
		pass,
		schoolnum,
		lectures : null
	});
	return user.save();
};

User.statics.findByUserID = function(userid) {
	return this.findOne({
		userid
	}).exec();
};

User.statics.checkDuplicateUserID = function(userid) {
	return new Promise((resolve, reject) => {
		this.find({ userid }, (err, users) => {
			if (err) {
				reject({
					status : 500,
					error : err
				});
				return;
			}

			if (users.length !== 0) {
				reject({
					status : 400,
					error : err
				});
				return;
			}

			resolve();
		});
	});
	
};

User.methods.updatePass = function(pass) {
	this.salts[0] = crypto.randomBytes(bits).toString('hex');
	this.salts[1] = crypto.randomBytes(bits).toString('hex');

	for (let i = 0; i < 2 ; ++i) {
		this.pass[i] = crypto.pbkdf2Sync(pass, this.salt[i], iteritations, bits, digest);
	}

	return this.save();
};

module.exports = mongoose.model('User', User);
