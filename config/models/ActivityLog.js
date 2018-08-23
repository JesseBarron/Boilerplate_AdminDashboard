var mongoose = require("mongoose");

var ActivityLogSchema = mongoose.Schema({

    created: Date,
    deviceType: String,
    deviceName: String,
    activity: String,
    content: String,
    ip: String,
    latitude: Number,
    longitude: Number,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}

});

var ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);

module.exports = {
    ActivityLog
}