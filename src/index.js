//Node JS Common modules
const path = require('path');
const Promise = require('bluebird');

//Config file
const config = require('./config/config');
config.secret = require('./config/config.secret');

//Express JS modules
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');

//Express Routers
const routes = {};

routes.index = require('./routes/index');
routes.about = require('./routes/about');
routes.security = require('./routes/security');

routes.enroll = {};
routes.enroll.index = require('./routes/enroll/index');

routes.view = {};
routes.view.index = require('./routes/view/index');

routes.board = {};
routes.board.index = require('./routes/board/index');

routes.user = {};
routes.user.login = require('./routes/user/login');
routes.user.query = require('./routes/user/query');
routes.user.signup = require('./routes/user/signup');

//MongoDB modules
const mongoose = require('mongoose');
const autoinc = require('mongoose-auto-increment');

//Logger modules
const winston = require('winston');
const morgan = require('morgan');

//Winston Configuration
winston.configure({
	transports : [
		new winston.transports.File({
			name : 'log_error',
			filename : path.join(__dirname, '../logs/error.log'),
			level : 'error'
		}),
		new winston.transports.File({
			name : 'log_info',
			filename : path.join(__dirname, '../logs/info.log')
		})
	]
});
if (process.env.NODE_ENV !== 'production') {
	winston.add(winston.transports.Console);
}

//Mongoose Configuration
const db = mongoose.connection;
db.on('error', winston.error);
db.once('open', () => {
	winston.info('Connected to mongod Server');
	autoinc.initialize(db);
});
mongoose.connect(config.secret.mongodb.url);

mongoose.Promise = Promise;

//Express JS Configureation
const app = express();
const port = config.express.port || 3000;

//Security
app.use(helmet());

//Session
app.set('trust proxy', 1);
app.use(session({
	secret : config.secret.session.secret,
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

//Renderer (EJS)
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);
app.use(express.static(__dirname + '/assets'));

//Logger And Parsers
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes
app.use('/', routes.index);
app.use('/', routes.about);
app.use('/', routes.security);

app.use('/', routes.enroll.index);

app.use('/', routes.view.index);

app.use('/', routes.board.index);

app.use('/', routes.user.login);
app.use('/', routes.user.query);
app.use('/', routes.user.signup);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res) {
	const error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error/error', {
		title: 'Error',
		message: err.message,
		status: error.status,
		stack: error.stack,
	});
});

app.listen(port, () => {
	winston.info('Express Server has started on port ' + port);
});

//Set Config as Local
app.locals.config = config;
app.locals.rootPath = __dirname;

module.exports = app;
