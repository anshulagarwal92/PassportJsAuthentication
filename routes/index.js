var express = require('express');
var router = express.Router();
var HomeController = require('../controllers/home');
var LoginController = require('../controllers/login');

/* GET home page. */
router.get('/', HomeController.getHomePage);
router.get('/logout', LoginController.logout);

module.exports = router;
