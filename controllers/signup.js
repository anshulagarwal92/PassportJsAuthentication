var passport = require('passport'),
    User = require("../models/user"),
    LocalStrategy = require('passport-local').Strategy;



passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var LoginController = {
    getSignUpPage: function(req, res, next){
        if(typeof req.user === "undefined" || req.user == null) {
            res.render('signup/index', { title: 'Sign Up Page', user : req.user });
        } else {
            res.redirect('/dashboard');
        }
    },

    postUser: function(req, res, next) {
        var info = {},
        data = {},
        query = {};
        if(typeof req.body.email !== "undefined" && req.body.email != ""
        && typeof req.body.password !== "undefined" && req.body.password != ""
        && typeof req.body.confirm_password !== "undefined" && req.body.confirm_password != "") {

            req.body.email = req.body.email.toLowerCase();

            if(req.body.password == req.body.confirm_password) {

                var emailRegex = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i),
                mobRegex = new RegExp(/^[0-9]{10}$/);
                // verification_code = Math.floor(Math.random()*90000) + 10000;

                if(emailRegex.test(req.body.email)){
                    query = {username : req.body.email, email: req.body.email};
                    data = {
                        username : req.body.email,
                        email : req.body.email,
                        'authType' : 'local'
                    };
                    LoginController.findAndCreateUser(query, data, res, req, next);

                } else {
                    req.flash('danger', 'Email format is not correct');
                    res.redirect('/signup');
                }
            } else {
                req.flash('danger', 'Password and confirm password does not match');
                res.redirect('/signup');
            }
        }
    },

    findAndCreateUser : function(query, data, res, req, next) {
        var info = {};
        User.findOne(query,(function(err, user){
            if (err) {
                res.redirect('/');
            } else if (user) {
                var errMsg = "a user is already registered with this mobile";
                if(query.hasOwnProperty('email')) {
                    errMsg = "a user is already registered with this email";
                }
                req.flash('danger', errMsg);
                res.redirect('/signup');
            } else {
                User.register(new User(data), req.body.password, function(err, user) {
                    if (err) {
                        req.flash('danger', 'Something went wrong');
                        res.redirect('/signup');
                    } else {
                        req.flash('danger', 'User successfully registered');
                        res.redirect('/login');
                    }
                });
            }
        })
    );
    }

};

module.exports = LoginController;
