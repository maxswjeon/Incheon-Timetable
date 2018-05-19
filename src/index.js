const config = require('./bin/config');
const app = require('./bin/express');
const mongodb = require('./bin/mongodb');
const winston = require('./bin/logger');

const port = global.express.port || 3000;

app.listen(port, () => {
	winston.info('Express Server has started on port ' + port);
});

module.exports = {
	config : config,
	express : app,
	mongodb : mongodb,
	logger : winston
};
