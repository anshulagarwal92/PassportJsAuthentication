/**
 * Created by devesh on 4/8/15.
 */
var mongoose = require('mongoose');
var User = require('../models/user');

mongoose.connect('mongodb://localhost:27017/loginApp');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("Database connection opened...!!");
});

module.exports = db;
