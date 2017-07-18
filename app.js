const express = require('express');
const logger = require('morgan');
const path = require('path');
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const exphbs = require("express-handlebars");
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('config');
const index = require('./routes/index');
const users = require('./routes/users');

let app = express();
const db = require('db');
const sessionStore = require('lib/sessionStore');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//express session
app.use(session({
    secret: config.get('session:secret'),
    key: config.get('session:key'),
    saveUninitialized: false,
    resave: false,
    store: sessionStore
}));

//passport init
app.use(passport.initialize());
app.use(passport.session());

//express validator
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        let namespace = param.split(".")
        root = namespace.shift(),
            formParam = root;

        while(namespace.length){
            formParam += `[${namespace.shift()}]`;
        }
        return {
            param: formParam,
            msg,
            value
        }
    }
}));

//connect flash
app.use(flash());

//Gobal vars
app.use( (req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error =  req.flash("error");
    res.locals.user = req.user || null;
    next();
});

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;