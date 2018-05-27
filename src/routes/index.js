//Logger modules
//const winston = require('winston');

const uuid = {};
uuid.v1 = require('uuid/v1');
uuid.v4 = require('uuid/v4');

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	const { session } = req;

	const uuid1 = uuid.v1().replace(/-/g, '');
	const uuid2 = uuid.v4().replace(/-/g, '');

	session.uuid1 = uuid1;
	session.uuid2 = uuid2;

	/*if (!session.authenticated) {
		res.render('login', {
			uuid1 : uuid1,
			uuid2 : uuid2,
			errormsg : session.errormsg
		});
	}
	else {
		res.render('index');
	}*/
	res.render('index');
});

module.exports = router;