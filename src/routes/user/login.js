const path = require('path');
const crypto = require('crypto');

const iteritations = global.hash.iteritation || 100000;
const bits = global.hash.bits || 512;
const digest = global.hash.digest || 'sha512';

//Logger modules
const winston = require('winston');

const express = require('express');
const router = express.Router();

const User = require(path.join(global.rootPath, 'src/schemas/user'));

router.post('/user/login', (req, res) => {

	const session = req.session;
	const { userid, pass, uuid1, uuid2 } = req.body;

	if (session.uuid1 !== uuid1 || session.uuid2 !== uuid2) {
		delete session.uuid1;
		delete session.uuid2;
		
		res.status(403)
			.send({ result : false, error : 'UUID Does Not Match'});
	
		winston.error('User Login Authentication Error : ' + 'UUID Doesn Not Match');

		return;
	}

	//Save As Hash
	const sha512Generator = crypto.createHash('sha512');
	sha512Generator.update(userid);
	const useridHash = sha512Generator.digest('hex');

	const createHash = (user, index) => {
		return new Promise((resolve, reject) => {
			crypto.pbkdf2(Buffer.from(user.salts[index], 'hex'), pass, iteritations, bits, digest, (err, hash) => {
				if (err){
					reject({
						status : 500,
						error : err
					});
					return;
				}

				if (hash.toString('hex') !== user.pass[index]) {
					reject({
						status : 403,
						error : 'User Not Authorized'
					});
					return;
				}

				resolve(user);
			});
		});
	};

	const respond = () => {
		session.authenticated = true;
		session.userid = useridHash;
		
		res.json({
			result : true
		});
	};

	const onError = (info) => {
		delete session.uuid1;
		delete session.uuid2;

		session.errormsg = '<p id="error">아이디 또는 비밀번호를 확인하세요</p>';

		res.status(info.status).json({
			result: false,
			error: info.error
		});

		winston.error('User Login Internal Error : ' + info.error);
	};

	User.findByUserID(useridHash)
		.then((user) => createHash(user, 0))
		.then((user) => createHash(user, 1))
		.then(respond)
		.catch(onError);
});

module.exports = router;
