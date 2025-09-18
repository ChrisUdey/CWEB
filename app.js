var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const sessOptions = {
  // set secret from environment variable used to encode the session cookie
  secret: 'shhhhhhh_this-is+SECret' , // should be the same for cookie-parser
  name: 'session-id', // name of the session cookie default: connect.sid
  resave: false, // store session after every request
  saveUninitialized: false, // if true sets a cookie even if no session info
  cookie: {httpOnly: false, maxAge: 1000*60*60}, //session cookie options
  store: new SQLiteStore({ db: 'sessions.db'}),
};

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const exampleRouter = require('./routes/examples');
const stateRouter = require('./routes/state');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(sessOptions.secret));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bw', express.static(path.join(__dirname, 'node_modules/bootswatch/dist')));
app.use(session(sessOptions))


//This is like a switch statement that pivots on the url
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/examples', exampleRouter);
app.use('/state', stateRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
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
