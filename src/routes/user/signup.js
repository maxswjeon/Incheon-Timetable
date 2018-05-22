const path = require('path');
const crypto = require('crypto');

const saltBits = global.salt.bits || 512;
const iteritations = global.hash.iteritation || 100000;
const bits = global.hash.bits || 512;
const digest = global.hash.digest || 'sha512';

//Logger modules
const winston = require('winston');

const express = require('express');
const router = express.Router();

const User = require(path.join(global.rootPath, 'src/schemas/user'));

router.post('/user/signup', (req, res) => {

	const session = req.session;
	const { userid, pass, schoolnum, secret, uuid1, uuid2 } = req.body;

	if (session.uuid1 !== uuid1 || session.uuid2 !== uuid2) {
		delete session.uuid1;
		delete session.uuid2;
		
		res.status(403)
			.send({ result : false, error : 'UUID Does Not Match'});
	
		winston.error('User Signup Authentication Error : ' + 'UUID Doesn Not Match');

		return;
	}

	const salts = Array(2);
	const hashes = Array(2);

	//Save As Hash
	const userIDHashGenerator = crypto.createHash('sha512');
	userIDHashGenerator.update(userid);
	const useridHash = userIDHashGenerator.digest('hex');

	const secretHashGenerator = crypto.createHash('sha512');
	secretHashGenerator.update(secret);
	const secretHash = secretHashGenerator.digest('hex');

	const checkRegistered = (user) => {
		return new Promise((resolve, reject) => {
			if (user.secret === null) {
				reject({
					status : 400,
					error : 'User Already Registered'
				});
				return;
			}

			if (user.secret !== secretHash) {
				reject({
					status : 401,
					error : 'Secret Code Mismatch'
				});
				return;
			}

			resolve();
		});
	};

	const createSalt = (index) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(saltBits , (err, buf) => {
				if (err) {
					reject({
						status : 500,
						error : err
					});
					return;
				}
				salts[index] = buf.toString('hex');
				resolve();			
			});
		});
	};

	const createHash = (index) => {
		return new Promise((resolve, reject) => {
			crypto.pbkdf2(Buffer.from(salts[index], 'hex'), pass, iteritations, bits, digest, (err, hash) => {
				if (err){
					reject({
						status : 500,
						error : err
					});
				}
				hashes[index] = hash.toString('hex');
				resolve();
			});
		});
	};

	const respond = () => {
		res.status(200).json({
			result: true
		});
	};

	const onError = (info) => {
		res.status(info.status).json({
			result: false,
			error: info.error
		});

		winston.error('User Signup Internal Error : ' + info.error);
	};

	User.findBySchoolNum(schoolnum)
		.then(checkRegistered)
		.then(() => User.checkDuplicateUserID(useridHash))
		.then(() => createSalt(0))
		.then(() => createSalt(1))
		.then(() => createHash(0))
		.then(() => createHash(1))
		.then(() => User.create(useridHash, salts, hashes, schoolnum))
		.then(respond)
		.catch(onError);
});

module.exports = router;
