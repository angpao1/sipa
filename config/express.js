var express = require('express');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var sass = require('node-sass-middleware');
var validator = require('express-validator');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var config = require('./config');
var flash = require('connect-flash');
var passport = require('passport');

module.exports = function () {
    var app = express();
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else {
        app.use(compression);
    }
    // app.use(bodyParser.urlencoded({
    //     extended: true
    // }));
    // app.use(bodyParser.json());
    // app.use(session({
    //     secret: config.sessionSecret,
    //     resave: false,
    //     saveUninitialized: true
    // }));
    // app.use(flash());
    // app.use(passport.initialize());
    // app.use(passport.session());


    app.use(session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: true
    }));

    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(validator());

    app.set('views', './app/views');
    app.set('view engine', 'jade');

    require('../app/routes/index.server.route')(app);
    require('../app/routes/user.server.route')(app);

    app.use(sass({
        src: './sass',
        dest: './public/css',
        outputStyle: 'compressed',
        prefix: '/css',
        debug: true
    }));
    app.use(express.static('./public'));

    return app;
}