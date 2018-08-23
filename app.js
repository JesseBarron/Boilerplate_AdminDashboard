const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');
const permission = require('permission');
const device = require('express-device');
const useragent = require('useragent');
useragent(true);
const app = express();

require('dotenv').config();
require('./config/mongo');

const express_session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(express_session);

const sessionStore = new MongoDBStore({uri: `mongodb://localhost:27017/${process.env.DB_NAME}`, collection:"Admin_Sessions"});
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

const passport = require('passport');
require('./config/passport')(passport);

const fileUpload = require("express-fileupload");
app.use(fileUpload());
const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
	extended: true,
	limit: '50mb'
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(device.capture({
	parseUserAgent: true
}));

app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Need this in order to grab the users IP address!
app.enable('trust proxy')

// ========================================================
// ====================== Permission ======================

// const notAuthenticated = {
// 	flashType: 'error',
// 	message: 'The entered credentials are incorrect',
// 	redirect: '/login'
// };
// const notAuthorized = {
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
app.locals.COMPANY = process.env.COMPANY;
app.locals.COMPANY_ABV = process.env.COMPANY_ABV;
app.locals.COMPANY_FA_ICON = process.env.COMPANY_FA_ICON;

// ========================================================
// ===================== SEEDING ==========================
// *** uncomment in order to seed database with some test admin accounts
// require('./seed/admin');
// require('./seed/test');
// ===================== SEEDING ==========================
// ========================================================




// ========================================================
// ========================================================
// ===================== MIDDLEWARE =======================

const LogActivity = require('./config/common').LogActivity;
const LogError = require('./config/common').LogError;
const User = require('./config/models/User').User;
app.use( async (req,res,next)=>{
	res.locals.successMessages = req.flash('successMessages');
	res.locals.errorMessages = req.flash('errorMessages');

	//Pass location object with latitude/longitude as header from app to api as often as possible to get latest updated location record
	let location = null;
	if (req.headers.location) {
		let parsedLoc = JSON.parse(req.headers.location)
		location = parsedLoc;
	}
	
	let userId = null,
		latitude = ((location && location.latitude) || null),
		longitude = ((location && location.longitude) || null);
	if (req.user) {
		//Store the user in "locals" in order to access in the view
		userId = req.user._id;
		res.locals.user = req.user;
		
		try {
			let _user = req.user;
			let indexOfIp = _user.ips.findIndex( e => e.ip == req.ip );
			//Keep track of users ip addresses and the access count per ip address
			if (indexOfIp == -1) {
				_user.ips.push({ip:req.ip,accessCount:1});
			}
			else {
				_user.ips[indexOfIp].accessCount += 1;
			}
			_user.lastSeen = new Date();

			//Update the users lat/lng if it's provided in the req header
			if (location && latitude && longitude) {
				if (typeof parseFloat(latitude) == 'number' && typeof parseFloat(longitude) == 'number') {
					_user.location.latitude = parseFloat(latitude);
					_user.location.longitude = parseFloat(longitude);
					latitude = parseFloat(latitude);
					longitude = parseFloat(longitude);
				}
			}
			let user = await _user.save();
		}
		catch (error) {
			LogError(`500 ${req.url} update user middlewares`,error,userId,req.ip,req.device.type,req.device.name);
			return res.render('error500');
		}

	}

	//Don't care to log access if the user is an Admin or SuperAdmin. Only log access if the request is from a regular user
	if (req.user && (req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin')) {
		LogActivity("Access",req.url,userId,req.ip,req.device.type,req.device.name,latitude,longitude);
	}

	next();
});

const adminAuth = require('./routes/adminAuth');
const statusMonitor = require('express-status-monitor')();
app.use(statusMonitor);
app.get('/status', adminAuth, statusMonitor.pageRoute);

// ===================== MIDDLEWARE =======================
// ========================================================
// ========================================================




// ========================================================
// ====================== Routers =========================

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const usersRouter = require('./routes/users');
const logsRouter = require('./routes/logs');
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/logs', logsRouter);


const apiUsersRouter = require('./routes/api/users');
const apiLogsRouter = require('./routes/api/logs');
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
  res.render('error400');
});

module.exports = app;
