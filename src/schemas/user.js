const crypto = require('crypto');

const iteritations = global.hash.iteritation || 100000;
const bits = global.hash.bits || 512;
const digest = global.hash.digest || 'sha512';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
	secret : String,
	userid : String,
	salts : [String],
	pass : [String],
	schoolnum : Number,
	lectures : [String]
});

User.statics.initSecret = function(schoolnum, secret) {
	//Save As Hash
	const sha512Generator = crypto.createHash('sha512');
	sha512Generator.update(secret);
	const secretHash = sha512Generator.digest('hex');

	const user = new this();
	user.schoolnum = schoolnum;
	user.secret = secretHash;

	user.userid = null;
	user.salts = null;
	user.pass = null;
	user.lectures = Array();

	return user.save();
};

User.statics.create = function(userid, salts, pass, schoolnum) {
	return this.findOne({ schoolnum })
		.then((user) => {
			user.userid = userid;
			user.salts = salts;
			user.pass = pass;
			user.lectures = Array();
			user.secret = null;

			return user;
		})
		.then((user) => user.save());
};

User.statics.findByUserID = function(userid) {
	return this.findOne({
		userid
	}).exec();
};

User.statics.findBySchoolNum = function(schoolnum) {
	return this.findOne({
		schoolnum
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
					error : 'Duplicate User ID Found'
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

User.methods.updateLecture = function(lectures) {
	this.lectures = lectures;
	return this.save();
};

module.exports = mongoose.model('User', User);
