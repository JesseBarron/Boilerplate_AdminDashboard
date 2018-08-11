var mongoose = require("mongoose");

var ActivityLogSchema = mongoose.Schema({

    created: Date,
    activity: String,
    content: String,
    ip: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}

});

var ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);

module.exports = {
    ActivityLog
}