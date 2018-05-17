//Logger modules
//const winston = require('winston');

const express = require('express');
const router = express.Router();

router.get('/security', (req, res) => {
	res.render('security');
});

module.exports = router;