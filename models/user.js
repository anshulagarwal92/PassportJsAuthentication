var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
    username: String,
    name : String,
    mobile : String,
    email: String,
    authType : String,
    facebook : {
        id : String,
        token : String
    },
    linkedin : {
        id : String,
        token : String
    },
    google : {
        id : String,
        token : String
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
