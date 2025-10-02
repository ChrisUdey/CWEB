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

const cors = require('cors');
const corsOptions = {
  origin:/localhost:\d{4,5}/i, //Allow requests from localhost on any 4 or 5 digit
  methods: 'GET,PUT,POST,DELETE,OPTIONS',
  credentials: true, //allows cookies over fetch
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  maxAge: 43200, // max time of check
}


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const exampleRouter = require('./routes/examples');
const stateRouter = require('./routes/state');
const secureRouter = require('./routes/secure');

//declare API routes
const userAPIRouter = require('./routes/api/user-api');


//declare UI routes
const uiExampleRouter = require('./routes/ui-example');


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
app.use('/api',cors(corsOptions)) //Add CORs headers to response automatically
app.options('*', cors(corsOptions)) //always allow option request for pre-flight checks

//This is like a switch statement that pivots on the url
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/examples', exampleRouter);
app.use('/state', stateRouter);
app.use('/secure', secureRouter)


//include the new api routes
app.use('/api', userAPIRouter);

//include the UI routes
app.use('/ui',uiExampleRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  if(!req.path.startsWith('/api')) {
    return next(createError(404)); //error in html format
  }
  const err = new Error('Not Found');
  err.status = 404;
  return next(err);

});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if(!req.path.startsWith('/api')) {
    return res.render('error');
  }

  return res.json({
    error: err.message,
    stack: res.locals.error?.stack?.split('\n'),
  });

});

module.exports = app;
