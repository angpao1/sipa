var User = require('mongoose').model('User');
var passport = require('passport');

var getErrorMessage = function (err) {
    var message = '';

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) {
                message = err.errors[errName].message;
            }
        }
    }
    return message;
}

// exports.login = function (req, res) {
//     console.log(req.body);
//     console.log('Email: ' + req.body.email);
//     console.log('Password: ' + req.body.password);

//     req.checkBody('email', 'Invalid email').notEmpty().isEmail();
//     req.sanitizeBody('email').normalizeEmail();
//     var errors = req.validationErrors();

//     if (req.body.remember === 'remember') {
//         req.session.remember = true;
//         req.session.email = req.body.email;
//         req.session.cookie.maxAge = 60000;
//     }

//     if (errors) {
//         res.render('index', {
//             message: 'There have been validation errors: ' + JSON.stringify(errors),
//             isLoggedIn: false
//         });
//         return;
//     }

//     res.render('index', {
//         message: 'Logged in as' + req.body.email,
//         isLoggedIn: true
//     });
// }

exports.logout = function (req, res) {
    // res.render('index', {
    //     message: 'See you again later',
    //     isLoggedIn: false
    // });
    // req.session = null;
    req.logout();
    res.redirect('/');
}

var User = require('mongoose').model('User');

exports.create = function (req, res, next) {
    var user = new User(req.body);

    user.save(function (err) {
        if (err) {
            return next(err);
        } else {
            res.json(user);
        }
    });
}

exports.list = function (req, res, next) {
    User.find({}, function (err, users) {
        if (err) {
            return next(err);
        } else {
            res.json(users);
        }
    });
}

exports.userByUsername = function (req, res, next, username) {
    User.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            return next(err);
        } else {
            req.user = user;
            next();
        }
    });
}

exports.read = function (req, res) {
    res.json(req.user);
}

exports.update = function (req, res, next) {
    User.findOneAndUpdate({ username: req.user.username }, req.body, function (err, user) {
        if (err) {
            return next(err);
        } else {
            res.json(user);
        }
    });
}

exports.delete = function (req, res, next) {
    req.user.remove(function (err) {
        if (err) {
            return next(err);
        } else {
            res.json(req.user);
        }
    });
}

exports.renderSignup = function (req, res) {
    if (!req.user) {
        res.render('signup', {
            title: 'Sign up',
            messages: req.flash('error')
        });
    } else {
        return res.redirect('/');
    }
}

exports.signup = function (req, res, next) {
    if (!req.user) {
        var user = new User(req.body);
        user.provider = 'local';

        user.save(function (err) {
            if (err) {
                var message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/signup');
            }
            req.login(user, function (err) {
                if (err) { return next(err); }
                return res.redirect('/');
            });
        });
    } else {
        return res.redirect('/');
    }
}

exports.renderLogin = function (req, res) {
    if (!req.user) {
        res.render('login', {
            title: 'Log in',
            messages: req.flash('error') || req.flash('info')
        });
    } else {
        return res.redirect('/');
    }
}

exports.saveOAuthUserProfile = function (req, profile, done) {
    User.findOne({
        provider: profile.provider,
        providerId: profile.providerId
    }), function (err, user) {
        if (err) return done(err);
        else {
            if (!user) {
                var possibleUsername = profile.username || (profile.email ? profile.email.split('@')[0] : '');
                User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
                    profile.username = availableUsername;
                    user = new User(profile);
                    user.save(function (err) {
                        if (err) {
                            var message = getErrorMessage(err);
                            req.flash('error', message);
                            return res.redirect('/signup');
                        }
                        return done(err, user);
                    });
                });
            } else {
                return done(err, user);
            }
        }
    }
}