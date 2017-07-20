var express = require('express');
var router = express.Router();
var passport = require('passport');
var LoginController = require('../controllers/login');

/* GET users listing. */
router.get('/', LoginController.getLoginPage);
router.post('/', LoginController.postLogin);

router.get('/auth/google',
    passport.authenticate('google', {
            scope: [ 'https://www.googleapis.com/auth/plus.login'
                , 'https://www.googleapis.com/auth/plus.profile.emails.read' ]
        }
    ));

router.get( '/auth/google/callback',passport.authenticate( 'google', {failureRedirect: '/login'}), function(req, res, next) {
    res.redirect('/dashboard');
});

router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res, next) {
    res.redirect('/dashboard');
});

router.get('/auth/linkedin', passport.authenticate('linkedin'));
router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}));


module.exports = router;
