//NodeJS Core Modules
const path = require('path');
const util = require('util');

//Logger modules
const winston = require('winston');

const express = require('express');
const router = express.Router();

const Post = require(path.join(global.rootPath, 'src/schemas/post'));

router.get('/board/', (req, res) => {
	const { id } = req.query;

	const checkPost = (post) => {
		return new Promise((resolve, reject) => {
			if(post === null) {
				reject({
					status : 404,
					error : 'Post Not Found'
				});
				return;
			}
			resolve(post);
		});
	};

	const respond = (post) => {
		res.render('board/index', {
			title : post.title,
			content : post.content
		});
	};

	const onError = (info) => {
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

	Post.findByPostID(id)
		.then(checkPost)
		.then(respond)
		.catch(onError);
});

module.exports = router;