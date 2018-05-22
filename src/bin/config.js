const path = require('path');

/**
 * Parse Config Files And Save it to Global Variables
 */
function Parse() {
	global.rootPath = path.join(__dirname, '../../');

	const config = require(path.join(global.rootPath, 'config/config'));
	config.secret = require(path.join(global.rootPath, 'config/config.secret'));

	for (let key in config) {
		global[key] = config[key];
		Object.freeze(global[key]);
	}
}

module.exports = {
	parse : Parse
};