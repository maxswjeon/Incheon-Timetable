const Promise = require('bluebird');

//Logger modules
const winston = require('winston');

const express = require('express');
const router = express.Router();

const User = require('../../schemas/user');

router.post('/user/query', (req, res) => {

	const { userid, name } = req.body;

	const checkDuplicate = (users) => {
		return Promise.resolve(users.length !== 0);
	};

	const respond = (result) => {
		res.json({
			result: true,
			used: result
		});
	};

	const onError = (err) => {
		res.status(500).json({
			result: false,
			error: err
		});
		winston.error('User Query Internal Error : ' + err);
	};

	if (userid) {
		User.findByUserID(userid)
			.then(checkDuplicate)
			.then(respond)
			.catch(onError);
	}
	else if (name) {
		User.findByName(name)
			.then(checkDuplicate)
			.then(respond)
			.catch(onError);
	}
	else {
		res.status(400).json({
			result: false,
			error: 'Neither ID nor Name Given'
		});
		winston.error('User Query : Insufficient Information Given By User');
	}
});

module.exports = router;
