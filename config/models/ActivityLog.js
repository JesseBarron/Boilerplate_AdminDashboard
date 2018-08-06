var mongoose = require("mongoose");

var ActivityLogSchema = mongoose.Schema({

    date: Date,
    activity: String,
    content: String,
    ip: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
        
});

var ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);

module.exports = {
    ActivityLog
}