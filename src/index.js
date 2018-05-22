const config = require('./bin/config');
const logger = require('./bin/logger');
const express = require('./bin/express');
const mongodb = require('./bin/mongodb');

const dataLoader = require('./bin/dataLoader');

//Parse Config Files And Save it to Global Variables
config.parse();

//Set Up Logger
logger.init();

//Set Up DataParser
dataLoader.init();
dataLoader.parse('data/grade2.xlsx', 0, 'grade2_enroll');
dataLoader.parse('data/grade2.xlsx', 1, 'grade2_result');
dataLoader.parse('data/grade3.xlsx', 0, 'grade3_enroll');
dataLoader.parse('data/grade3.xlsx', 1, 'grade3_result');

//Configuring ExpressJS
{
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
}

mongodb.connect();
