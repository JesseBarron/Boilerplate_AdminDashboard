var mongoose = require("mongoose");

var AccessLogSchema = mongoose.Schema({

    created: Date,
    deviceType: String,
    deviceName: String,
    route: String,
    ip: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}

});

var AccessLog = mongoose.model('AccessLog', AccessLogSchema);

module.exports = {
    AccessLog
}