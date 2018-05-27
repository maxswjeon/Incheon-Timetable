//NodeJS Core Modules
const path = require('path');
const util = require('util');

//Logger modules
const winston = require('winston');

const uuid = {};
uuid.v1 = require('uuid/v1');
uuid.v4 = require('uuid/v4');

const express = require('express');
const router = express.Router();

const Post = require(path.join(global.rootPath, 'src/schemas/post'));

router.get('/', (req, res) => {
	const { session } = req;

	if (!session.userid) {

		const uuid1 = uuid.v1().replace(/-/g, '');
		const uuid2 = uuid.v4().replace(/-/g, '');

		session.uuid1 = uuid1;
		session.uuid2 = uuid2;

		res.render('login', {
			uuid1 : uuid1,
			uuid2 : uuid2,
			errormsg : session.errormsg
		});

		return;
	}

	const onError = () => {

		const errorPage ='<!DOCTYPE html>\
			<html>\
				<head>\
					<script type="text/javascript">\
						alert("%s");\
					</script>\
				</head>\
				<body>\
				</body>\
			</html>';

		res.status(500).send(util.format(errorPage, 'Internal Server Error While Loading Posts\nPlease Contact to Developers'));

		winston.error('Index Page Internal Error : Failed to Load Posts');
	};

	//Load Board
	Post.getAllPosts()
		.then((posts) => res.render('index', {posts: posts}))
		.catch(onError);
	
});

module.exports = router;