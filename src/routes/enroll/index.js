//NodeJS Core Modules
const path = require('path');
const util = require('util');

//Logger Modules
const winston = require('winston');

//Express Modules
const express = require('express');
const router = express.Router();

const User = require(path.join(global.rootPath, 'src/schemas/user'));

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

	const uuid1 = uuid.v1().replace(/-/g, '');
	const uuid2 = uuid.v4().replace(/-/g, '');

	session.uuid1 = uuid1;
	session.uuid2 = uuid2;

	let lectureString = JSON.stringify(require(path.join(global.rootPath, 'src/data/grade2_enroll')));
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

	const checkUser = (user) => {
		return new Promise((resolve, reject) => {
			if (user === null) {
				reject({
					status : 500,
					error : 'Server Internal Error, Please Report to Developers'
				});
				return;
			}
			else if(user.userid === null) {
				reject({
					status : 403,
					error : 'User Not Authorizied, Please Log In First'
				});
				return;
			}
			resolve(user);
		});
	};

	const getLecture = (user) => {
		user.lectures.forEach(element => {
			const index = element.charCodeAt(0) - 'A'.charCodeAt(0);
			lecture[index].selected = true;
		});
	};

	const respond = () => {
		res.render('enroll/index', {
			lecture : lecture,
			uuid1 : uuid1,
			uuid2 : uuid2
		});
	};

	const onError = (info) => {
		delete session.uuid1;
		delete session.uuid2;

		const errorPage ='<!DOCTYPE html>\
			<html>\
				<head>\
					<script type="text/javascript">\
						alert("%s");\
						location.replace("/");\
					</script>\
				</head>\
				<body>\
				</body>\
			</html>';

		res.status(info.status).send(util.format(errorPage, info.error));

		winston.error('Enrollment Internal Error : ' + info.error);
	};

	//Update lecture
	User.findByUserID(session.userid)
		.then(checkUser)
		.then(getLecture)
		.then(respond)
		.catch(onError);


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
		return;
	}

	const lectureString = Array();
	lecture.forEach(element => {
		lectureString.push(element.code);
	});

	const checkUser = (user) => {
		return new Promise((resolve, reject) => {
			if (user == null) {
				reject({
					status : 403,
					error : 'User Not Authorizied'
				});
				return;
			}
			resolve(user);
		});
	};

	const respond = () => {
		res.status(200).json({ result : true });
	};

	const onError = (info) => {
		delete session.uuid1;
		delete session.uuid2;

		res.status(info.status).json({
			result: false,
			error: info.error
		});

		winston.error('User Enroll Internal Error : ' + info.error);
	};

	User.findByUserID(session.userid)
		.then(checkUser)
		.then((user) => user.updateLecture(lectureString))
		.then(respond)
		.catch(onError);


});

module.exports = router;