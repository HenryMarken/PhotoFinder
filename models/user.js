const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema ({
    email: {
        type: String,
        require: true,
        unique:true,

    }
});

UserSchema.plugin(passportLocalMongoose);///add username and password fields

module.exports = mongoose.model('User', UserSchema);