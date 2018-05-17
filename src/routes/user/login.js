const Promise = require('bluebird');

//Logger modules
const winston = require('winston');

const express = require('express');
const router = express.Router();

const User = require('../../schemas/user');

router.post('/user/login', (req, res) => {

	const { userid, pass, uuid1, uuid2 } = req.body;

	const session = req.session;

	const checkReq = (users) => {
		if (uuid1 !== session.uuid1 ||
			uuid2 !== session.uuid2) {
			return Promise.reject('UUID Does Not Match');
		}
		return Promise.resolve(users);
	};

	const checkUser = (users) => {
		if (users.length !== 1) {
			return Promise.reject('Multiple Users with one ID');
		}
		return Promise.resolve(users[0]);
	};

	const verify = (user) => {
		return [
			user,
			user.verify(pass)];
	};

	const respond = (user, result) => {
		if (result) {
			session.authenticated = true;

			const json = {
				result: true,
				authenticated: result
			};
			res.json(json);
		}
		else {
			return Promise.reject('User Not Authorized');
		}
	};

	const onError = (err) => {
		session.uuid1 = undefined;
		session.uuid2 = undefined;
		session.errormsg = '<p id="error">아이디 또는 비밀번호를 확인하세요</p>';
		res.status(500).json({
			result: false,
			error: err
		});
		winston.error('User Login Internal Error : ' + err);
	};
	User.findByUserID(userid)
		.then(checkReq())
		.then(checkUser)
		.then(verify)
		.spread(respond)
		.catch(onError);
});

module.exports = router;
