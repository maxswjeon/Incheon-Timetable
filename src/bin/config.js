const path = require('path');

const config = require('../config/config');
config.secret = require('../config/config.secret');

for (let key in config) {
	global[key] = config[key];
	Object.freeze(global[key]);
}

global.rootPath = path.join(__dirname, '../../');

module.exports = config;