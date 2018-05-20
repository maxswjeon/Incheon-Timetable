const path = require('path');

global.rootPath = path.join(__dirname, '../../');

const config = require(path.join(global.rootPath, 'config/config'));
config.secret = require(path.join(global.rootPath, 'config/config.secret'));

for (let key in config) {
	global[key] = config[key];
	Object.freeze(global[key]);
}

module.exports = config;