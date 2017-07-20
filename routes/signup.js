var express = require('express');
var router = express.Router();
var SignUpController = require('../controllers/signup')

/* GET users listing. */
router.get('/', SignUpController.getSignUpPage);
router.post('/', SignUpController.postUser);

module.exports = router;
