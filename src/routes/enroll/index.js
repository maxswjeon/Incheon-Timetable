//NodeJS Core Modules
const path = require('path');

//Logger Modules
const winston = require('winston');

//Express Modules
const express = require('express');
const router = express.Router();

const uuid = {};
uuid.v1 = require('uuid/v1');
uuid.v4 = require('uuid/v4');

router.get('/enroll', (req, res) => {
	//const { session } = req;

	/*if (!session.authenticated) {
		res.redirect('/');
	}
	else {
		res.render('enroll/index');
	}*/

	const { session } = req;

	const uuid1 = uuid.v1();
	const uuid2 = uuid.v4();

	session.uuid1 = uuid1;
	session.uuid2 = uuid2;

	let lectureString = JSON.stringify(require(path.join(global.rootPath, 'src/data/grade2/enroll')));
	lectureString = lectureString
		.replace(/과목명/g, 'name')
		.replace(/과목코드/g, 'code')
		.replace(/학점/g, 'point')
		.replace(/수업시수/g, 'time')
		.replace(/['|"](\d+)['|"]/g, '$1');
	
	const lecture = JSON.parse(lectureString);

	lecture.map(element => {
		element.selected = false;
	});

	//Load Info from Database
	//lecture[i].selected = true;

	lecture[3].selected = true;

	res.render('enroll/index', {
		lecture : lecture,
		uuid1 : uuid1,
		uuid2 : uuid2
	});
});

router.post('/enroll', (req, res) => {
	const { session } = req;
	const { uuid1, uuid2, lecture } = req.body;

	if (session.uuid1 !== uuid1 || session.uuid2 !== uuid2) {
		delete session.uuid1;
		delete session.uuid2;
		
		res.status(403)
			.send({ result : false, error : 'UUID Does Not Match'});
	
		winston.error('Lecture Enroll Authentication Error : ' + 'UUID Doesn Not Match');
	}

	//Update lecture
	

	res.status(200)
		.send({ result : true });

});
module.exports = router;