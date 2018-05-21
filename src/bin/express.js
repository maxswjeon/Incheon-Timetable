//Node JS Core Modules
const path = require('path');
const fs = require('fs');

//Logger Modules
const morgan = require('morgan');

//Express JS modules
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');

//Express JS Configureation
const app = express();

function SetRenderer() {
	//Renderer (EJS)
	app.set('view engine', 'ejs');
	app.engine('html', ejs.renderFile);
}

function SetSecurityModule() {
	//Security
	app.use(helmet({
		hsts : false,
		expectCt : true
	}));
	app.disable('x-powered-by');
}

function SetSessionModule() {
	//Session
	app.set('trust proxy', 1);
	app.use(session({
		secret : global.secret.session.secret,
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

function SetParser() {
	//Logger And Parsers
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(cookieParser());
}

function SetLogger() {
	app.use(morgan('dev'));
	app.use(morgan('combined', {
		stream : fs.createWriteStream(path.join(global.rootPath, 'logs/access.log'), {flags: 'a'})
	}));
}

function ImportRoutes() {
	//Express Routers
	const routes = {};

	routes.index = require('../routes/index');
	routes.about = require('../routes/about');
	routes.security = require('../routes/security');

	routes.enroll = {};
	routes.enroll.index = require('../routes/enroll/index');

	routes.view = {};
	routes.view.index = require('../routes/view/index');

	routes.board = {};
	routes.board.index = require('../routes/board/index');

	routes.user = {};
	routes.user.login = require('../routes/user/login');
	routes.user.signup = require('../routes/user/signup');

	return routes;
}

function SetRoutes(app, routes) {
	for (let key in routes) {
		if (typeof routes[key] == 'function') {
			app.use('/', routes[key]);
		}
		else {
			SetRoutes(app, routes[key]);
		}
	}
}

function HandleError(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
}

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

SetRenderer();
SetSecurityModule();
SetSessionModule();
SetParser();
SetLogger();

app.set('views', path.join(global.rootPath, 'src/views'));
app.use(express.static(path.join(global.rootPath, 'src/assets')));

const routes = ImportRoutes();
SetRoutes(app, routes);

// catch 404 and forward to error handler
app.use(HandleError);

// error handler
app.use(RenderError);


module.exports = app;