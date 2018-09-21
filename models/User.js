var mongoose = require("mongoose");

var UserSchema = mongoose.Schema({
    facebookId: String,
    alohaId: String,
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: String,
    created: Date,
    lastSeen: Date,
    status: {
        type: String,
        default: "Active"
    },
    ips: [{
        ip: String,
        accessCount: Number
    }],
    addresses: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Address" }
    ],
    allCoupons: [
        {type: mongoose.Schema.Types.ObjectId, ref: "Coupons" }
    ],
    redeemedCoupons: [
        {type: mongoose.Schema.Types.ObjectId, ref: "Coupons" }
    ]
    // profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
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