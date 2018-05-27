//Logger modules
const winston = require('winston');

const express = require('express');
const router = express.Router();

const Post = require('../../schemas/post');

router.get('/board/', (req, res) => {
	const { id } = req.query;

	const checkPost = (users) => {
		if (users.length !== 1) {
			return Promise.reject('Multiple Users with one ID');
		}
		return Promise.resolve(users[0]);
	};

	const respond = (user) => {
		res.render('board/index', {
			title : user.title,
			content : user.content
		});
	};

	const onError = (err) => {
		res.status(500);
		winston.error('Post Loading Internal Error : ' + err);
	};

	Post.findByPostID(id)
		.then(checkPost)
		.then(respond)
		.catch(onError);
});

module.exports = router;