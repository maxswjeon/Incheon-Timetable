const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({
	title: String,
	content: String
});

Post.statics.create = function(title, content) {
	const post = new Post({
		title,
		content
	});

	return post.save();
};

Post.statics.getAllPosts = function() {
	return this.find({}).exec();
};

Post.statics.findByPostID = function(_id) {
	return this.findOne({
		_id
	}).exec();
};

Post.methods.update = function(title, content) {
	this.title = title;
	this.content = content;

	return this.save();
};

module.exports = mongoose.model('Post', Post);
