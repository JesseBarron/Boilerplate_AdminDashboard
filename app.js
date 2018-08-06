var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');
var permission = require('permission');
var app = express();

require('dotenv').config();
require('./config/mongo');

var express_session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(express_session);

var sessionStore = new MongoDBStore({uri: `mongodb://localhost:27017/${process.env.DB_NAME}`, collection:"Admin_Sessions"});
sessionStore.on("error", (error) => {
	console.log("Session Error: " + error);
});
app.use(express_session({
	store: sessionStore,
	secret: process.env.SECRET,
	resave: true,
	saveUninitialized: true,
	duration: 1000 * 60 * 60,	// 1 hour in milliseconds
	activeDuration: 1000 * 60 * 30	// 30 minutes in milliseconds
}));

var passport = require('passport');
require('./config/passport')(passport);


var fileUpload = require("express-fileupload");
app.use(fileUpload());
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
	extended: true,
	limit: '50mb'
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ========================================================
// ====================== Permission ======================

// var notAuthenticated = {
// 	flashType: 'error',
// 	message: 'The entered credentials are incorrect',
// 	redirect: '/login'
// };
// var notAuthorized = {
// 	redirect: '/',
// 	message: 'no',
// 	status: 302
// };
// app.set('permission', {
// 	role: 'role',
// 	notAuthenticated: notAuthenticated,
// 	notAuthorized: notAuthorized
// });

// ====================== Permission ======================
// ========================================================


/*
  Globals accessible in all views
*/
app.locals.COMPANY = "SlotDawg";
app.locals.COMPANY_ABV = "SD";

// ========================================================
// ===================== SEEDING ==========================
// *** uncomment in order to seed database with some test admin accounts
// require('./seed/admin');
// ===================== SEEDING ==========================
// ========================================================

//Store the user in "locals" in order to access in the view
app.use((req,res,next)=>{
	if (req.user) {
		res.locals.user = req.user;
	}
	next();
});

// ========================================================
// ====================== Routers =========================

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var usersRouter = require('./routes/users');
var logsRouter = require('./routes/logs');
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/logs', logsRouter);


var apiUsersRouter = require('./routes/api/users');
var apiLogsRouter = require('./routes/api/logs');
app.use('/api/users', apiUsersRouter);
app.use('/api/logs', apiLogsRouter);

// ====================== Routers =========================
// ========================================================


// catch 404 and forward to error handler
app.use((req, res, next) => {
  	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
