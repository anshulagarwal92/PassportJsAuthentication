var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('express-flash');

var MongoStore = require('connect-mongo')(session);
var db = require('./config/db');


var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var signup = require('./routes/signup');
var dashboard = require('./routes/dashboard');
// global.jQuery = require('jquery');
// var bootstrap = require('bootstrap');

var app = express();

// view engine setup
app.engine('ejs', require('express-ejs-extend'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    key: 'session',
    secret: 'Lo-GiN@Pp-sc',
    saveUninitialized: true,
    resave: false,
    cookie: {
        expires: new Date(Date.now() + 1000*60*1000),
        maxAge: 1000*60*1000
    },
    store: new MongoStore({url: 'mongodb://localhost:27017/loginApp'})
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});


app.use('/', index);
app.use('/users', users);
app.use('/login', login);
app.use('/signup', signup);
app.use('/dashboard', dashboard);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
