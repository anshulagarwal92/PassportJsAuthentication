var passport = require('passport'),
    User = require("../models/user"),
    LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google-oauth2').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;


passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({
        $or:[
            {username: username},
            {email: username}
        ],
        authType : 'local'
    }, (function(err, user){
        if (err) {
            return done(err);
        } else if (!user) {
            return done(null, false, {message: 'This user is not registered.'});
        } else {
            var checkPass = User.authenticate();
            checkPass(user.username, password, function(err, user) {
                if(!user) {
                    return done(null, false, {message: 'Invalid credentials.'});
                } else {
                    return done(null, user);
                }
            })
        }
    }));
}));

//passport login controller
passport.use(new GoogleStrategy({
    clientID:     "178990002540-n0dvr98n7155puavjisv488oqhrl172t.apps.googleusercontent.com",
    clientSecret: "A6cZApobwEBlWMOHtG67_UGM",
    callbackURL: '/login/auth/google/callback',
    passReqToCallback   : true
}, function(request, accessToken, refreshToken, profile, done) {
    User.findOne({
        $or: [
            {'google.id' : profile.id},
            {
                $and: [
                    {'email': profile.emails[0].value},
                    {'username': profile.emails[0].value}
                ]
            }
        ]

    }, function(err, user) {
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err) {
            return done(err);
        } else if (user) {
            user.google.id = profile.id;
            user.google.token = accessToken;
            user.save(function(err, response){
                if(err) {
                    throw err;
                } else {
                    return done(null, user); // user found, return that user
                }
            })
        } else {
            // if there is no user found with that facebook id, create them
            var data = {
                'username' : profile.emails[0].value,
                'name' : profile.displayName,
                'email' : profile.emails[0].value,
                'google.id' :  profile.id,
                'google.token' :  accessToken,
                'authType' : 'google'
            };

            var userData = new User(data);

            // save our user to the database
            userData.save(function(err, userData) {
                if (err) {
                    throw err;
                } else {
                    // if successful, return the new user
                    return done(null, userData);
                }

            });
        }

    });
}));

//passpeort facebook Strategy

passport.use(new FacebookStrategy({
    clientID: '828626920632325',
    clientSecret: 'b6a1bc348b1fb58784743a894a5537c7',
    callbackURL: '/login/auth/facebook/callback',
    profileFields: ['id', 'emails']
},
function(accessToken, refreshToken, profile, done) {
    User.findOne({
        $or: [
            {'facebook.id' : profile.id},
            {
                $and: [
                    {'email': profile.emails[0].value},
                    {'username': profile.emails[0].value}
                ]
            }
        ]
    }, function(err, user) {
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err) {
            return done(err);
        } else if (user) {
            user.facebook.id = profile.id;
            user.facebook.token = accessToken;
            user.save(function(err, response){
                if(err) {
                    throw err;
                } else {
                    return done(null, user); // user found, return that user
                }
            })
        } else {
            // if there is no user found with that facebook id, create them
            var data = {
                'username' : profile.emails[0].value,
                'name' : profile.displayName,
                'email' : profile.emails[0].value,
                'facebook.id' :  profile.id,
                'facebook.token' :  accessToken,
                'authType' : 'facebook'
            };

            var userData = new User(data);

            // save our user to the database
            userData.save(function(err, userData) {
                if (err) {
                    throw err;
                } else {
                    // if successful, return the new user
                    return done(null, userData);
                }
            });
        }
    });
}));

//passport linkedin Strategy
passport.use(new LinkedInStrategy({
  clientID: '8136l1dc5xcnfp',
  clientSecret: 'GWkhkKQPsnenhO0V',
  callbackURL: "/login/auth/linkedin/callback",
  scope: ['r_emailaddress', 'r_basicprofile'],
  state: true
}, function(accessToken, refreshToken, profile, done) {
    User.findOne({
        $or: [
            {'linkedin.id' : profile.id},
            {
                $and: [
                    {'email': profile.emails[0].value},
                    {'username': profile.emails[0].value}
                ]
            }
        ]
    }, function(err, user) {
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err) {
            return done(err);
        } else if (user) {
            user.linkedin.id = profile.id;
            user.linkedin.token = accessToken;
            user.save(function(err, response){
                if(err) {
                    throw err;
                } else {
                    return done(null, user); // user found, return that user
                }
            })
        } else {
            // if there is no user found with that facebook id, create them
            var data = {
                'username' : profile.emails[0].value,
                'name' : profile.displayName,
                'email' : profile.emails[0].value,
                'linkedin.id' :  profile.id,
                'linkedin.token' :  accessToken,
                'authType' : 'linkedin'
            };

            var userData = new User(data);

            // save our user to the database
            userData.save(function(err, userData) {
                if (err) {
                    throw err;
                } else {
                    // if successful, return the new user
                    return done(null, userData);
                }
            });
        }
    });
}));






passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var LoginController = {
    getLoginPage: function(req, res, next){
        if(typeof req.user === "undefined" || req.user == null) {
            res.render('login/index', { title: 'Login Page', user : req.user});
        } else {
            res.redirect('/dashboard');
        }
    },

    logout: function(req, res, next) {
        req.session.destroy();
        req.logout();
        res.redirect('/');
    },

    postLogin: function(req, res, next) {
        if(typeof req.body.username !== "undefined" && req.body.password !== "undefined") {
            req.body.username = req.body.username.toLowerCase();
            passport.authenticate('local', function(err, user, info) {
                if (err || !user) {
                    req.flash('danger', 'User not found');
                    res.redirect('/login')
                } else {
                    req.logIn(user, function(err) {
                        if (err) {
                            req.flash('danger', 'Invalid credentials');
                            res.redirect('/login')
                        } else {
                            res.redirect('/dashboard');
                        }
                    });
                }
            })(req, res, next);
        } else {
            req.flash('danger', 'Please enter username and password');
            res.redirect('/login')
        }

    }
};

module.exports = LoginController;
