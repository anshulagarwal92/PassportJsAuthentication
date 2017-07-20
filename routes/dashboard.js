var express = require('express');
var router = express.Router();
var DashboardController = require('../controllers/dashboard')

/* GET users listing. */
router.get('/', DashboardController.getDashboardPage);

module.exports = router;
