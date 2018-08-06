var mongoose = require("mongoose");

var UserSchema = mongoose.Schema({

    email: String,
    password: String,
    role: String,
    // profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    jwt: String,
    created: Date
    
})


var User = mongoose.model('User', UserSchema);

module.exports = {
    User
}