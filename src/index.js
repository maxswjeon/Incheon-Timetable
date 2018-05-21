const config = require('./bin/config');
const express = require('./bin/express');
const mongodb = require('./bin/mongodb');
const winston = require('./bin/logger');
const eventHandler = require('./bin/eventHandler');

const dataLoader = require('./bin/dataLoader');

//Configuring ExpressJS
express.setRenderer();
express.setRenderFolder('src/views');
express.setAssetFolder('src/assets');

express.setSecurityModule();

express.setSessionMoudle();

express.setParser();
express.setLogger();

express.setAllRoutes('src/routes');

express.setErrorHandlers();
express.start();

module.exports = {
	config : config,
	mongodb : mongodb,
	logger : winston,
	dataSheet : dataLoader,
	events : eventHandler
};
