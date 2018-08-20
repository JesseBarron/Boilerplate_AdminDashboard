var mongoose = require("mongoose");

var UserSchema = mongoose.Schema({

    email: String,
    password: String,
    role: String,
    // profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    jwt: String,
    created: Date,
    lastSeen: Date,
    ips: [{
        ip: String,
        accessCount: Number
    }]
    // ips: [{ type: String, unique: true }]
    // {
    //     ip: String,
    //     count: Number
    // }
    // Keep track of number of logins per ip address.. potential use case is keeping track of home/work machines

})


var User = mongoose.model('User', UserSchema);

module.exports = {
    User
}