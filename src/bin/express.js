//Node JS Core Modules
const path = require('path');
const fs = require('fs');

//Logger Modules
const winston = require('winston');
const morgan = require('morgan');

//Express JS modules
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const ejs = require('ejs');

//Express JS Configureation
const app = express();

/**
 * Set View Engine for Express Server.  
 * (default : EJS)
 */
function SetRenderer() {
	//Renderer (EJS)
	app.set('view engine', 'ejs');
	app.engine('html', ejs.renderFile);
}

/**
 * Set Root Path to View Files for Renderer.  
 * 
 * @param {String} viewPath Root Path to view Files
 */
function SetRenderFolder(viewPath) {
	if (!path.isAbsolute(viewPath)) {
		viewPath = path.join(global.rootPath, viewPath);
	}
	app.set('views', viewPath);
}

/**
 * Set Root Path to Asset Files for Server.  
 * Asset Folder will be sended as-is.  
 * Client-side JS Files and CSS Files will be recommended.  
 * 
 * @param {String} assetPath Root Path to assets
 */
function SetAssetFolder(assetPath) {
	if (!path.isAbsolute(assetPath)) {
		assetPath = path.join(global.rootPath, assetPath);
	}
	app.use(express.static(assetPath));
}

/**
 * Set Security Modules and Configure Major Security Hazards
 */
function SetSecurityModule() {
	//Security
	app.use(helmet({
		hsts : false,
		expectCt : true
	}));
	app.disable('x-powered-by');
}

/**
 * Set Session Module and Configure It
 * 
 * @param {String} _secret Secret String For Encrypting Sessions.  
 * Default is Configured in config.secret.json 
 */
function SetSessionModule(_secret) {
	const secret = _secret ||  global.secret.session.secret;

	//Session
	app.set('trust proxy', 1);
	app.use(session({
		secret : secret,
		name : 'INCHEONSESSID',
		cookie : {
			path : '/',
			httpOnly: true,
			secure: false,
			maxAge: null
		},
		resave : false,
		saveUninitialized : false
	}));
}

/**
 * Set Parser Modules and Configure It
 * 
 * @param {String} _secret Secret String For Encrypting Sessions.  
 * Default is Configured in config.secret.json 
 */
function SetParser() {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(cookieParser());
	
	// override with different headers; last one takes precedence
	app.use(methodOverride('X-HTTP-Method'));			// Microsoft
	app.use(methodOverride('X-HTTP-Method-Override'));	// Google/GData
	app.use(methodOverride('X-Method-Override'));		// IBM
	app.use(methodOverride('_method'));					// HTML Form
}

/**
 * Set Logger Modules and Configure It  
 * Set access.log and console log
 */
function SetLogger() {
	app.use(morgan('dev'));
	app.use(morgan('combined', {
		stream : fs.createWriteStream(path.join(global.rootPath, 'logs/access.log'), {flags: 'a'})
	}));
}

/**
 * Adds All Routers Recusively in `routes`
 * 
 * @param {String} routes JSON object includes routers
 */
function SetRoutes(routes) {
	for (let key in routes) {
		if (typeof routes[key] == 'function') {
			app.use('/', routes[key]);
		}
		else {
			SetRoutes(app, routes[key]);
		}
	}
}

/**
 * Adds All Routers Recusively in Directory
 * 
 * @param {String} routePath Root path to Start Finding Routers
 * 
 * @returns {Boolean} false if `routePath` is not Directory
 */
function SetAllRoutes(routePath) {
	if (!path.isAbsolute(routePath)) {
		routePath = path.join(global.rootPath, routePath);
	}

	if (!fs.statSync(routePath).isDirectory()) {
		winston.error('ImportAllRoutes Failed : %s is not directory', routePath);
		return false;
	}

	const files = fs.readdirSync(routePath);
	for(const index in files) {
		const file = files[index];
		const filePath = path.join(routePath, file);
		if (fs.statSync(filePath).isDirectory()) {
			SetAllRoutes(filePath);
		}
		else if (/.+\.js$/.test(file)) {
			app.use('/', require(filePath));
		}
	}
}

/**
 * Set All Error Handlers in `ErrorHandler`
 */
function SetErrorHandlers() {
	for (const key in this.ErrorHandler) {
		app.use(this.ErrorHandler[key]);
	}
}

/**
 * Handles Not Found Error
 */
function Handle404(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
}

/**
 * Renders Error Page
 */
function RenderError(err, req, res) {
	const error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error/error', {
		title: 'Error',
		message: err.message,
		status: error.status,
		stack: error.stack,
	});
}

/**
 * Starts ExpressJS Server
 * 
 * @param {Number} _port Specifies the port to listen. 
 * Default is defined at `global.express.port`. If not also defined,
 * defaults to `3000`.
 */
function Start(_port) {
	const port = _port || global.express.port || 3000;
	app.listen(port, () => {
		winston.info('Express Server has started on port ' + port);
	});
}

module.exports = {
	setRenderer : SetRenderer,
	setRenderFolder : SetRenderFolder,
	setAssetFolder : SetAssetFolder,
	setSecurityModule : SetSecurityModule,
	setSessionMoudle : SetSessionModule,
	setParser : SetParser,
	setLogger : SetLogger,
	setRoutes : SetRoutes,
	setAllRoutes : SetAllRoutes,
	setErrorHandlers : SetErrorHandlers,
	ErrorHandler : {
		404 : Handle404,
		Render : RenderError
	},

	start : Start,
};