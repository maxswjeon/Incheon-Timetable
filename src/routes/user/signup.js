const Promise = require('bluebird');
const crypto = require('crypto');

//Logger modules
const winston = require('winston');

const express = require('express');
const router = express.Router();

const User = require('../../schemas/user');

router.post('/user/signup', (req, res) => {

	const iteritation = req.app.locals.config.hash.iteritation || 100000;
	const bits = req.app.locals.config.hash.bits || 512;
	const digest = req.app.locals.config.hash.digest || 'sha512';

	const { userid, name, pass, schoolnum } = req.body;

	let _user = null;

	const checkID = (users) => {
		if (users.length === 0) {
			return Promise.resolve();
		}
		else {
			return Promise.reject('Duplicate UserID');
		}
	};

	const findName = () => {
		return User.findByName(name);
	};

	const checkName = (users) => {
		if (users.length === 0) {
			return Promise.resolve();
		}
		else {
			return Promise.reject('Duplicate UserName');
		}
	};

	const createUser = () => {
		return User.create(userid, name, schoolnum);
	};

	const saveUser = (user) => {
		_user = user;
		winston.info('User Added');
	};

	const respond = () => {
		res.json({
			retult: true
		});
	};

	const createHash = (salt) => {
		return new Promise((resove, reject) => {
			crypto.pbkdf2(salt, pass, iteritation, bits, digest, (err, key) => {
				if (err){
					reject(err);
				}
				resove([
					salt.toString('hex'),
					key.toString('hex')]);
			});
		});
	};

	const updateUser = (salt, pass) => {
		_user.updatePass(salt, pass);
		winston.info('Userinfo Updated');
	};

	const onError = (err) => {
		res.status(500).json({
			result: false,
			error: err
		});
		winston.error('Internal Server Error on User Signup : ' + err);
	};

	User.findByUserID(userid)
		.then(checkID)
		.then(findName)
		.then(checkName)
		.then(createUser)
		.then(saveUser)
		.then(respond)
		.then(() => crypto.randomBytes(req.app.locals.config.salt.bits))
		.then(createHash)
		.spread(updateUser)
		.catch(onError);
});

module.exports = router;
