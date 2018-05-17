//Logger modules
//const winston = require('winston');
const express = require('express');
const router = express.Router();

router.get('/enroll/', (req, res) => {
	//const { session } = req;

	/*if (!session.authenticated) {
		res.redirect('/');
	}
	else {
		res.render('enroll/index');
	}*/
	res.render('enroll/index', {
		lecture : require('../../data/grade2.json')
	});
});

module.exports = router;