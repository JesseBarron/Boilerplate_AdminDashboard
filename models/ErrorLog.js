var mongoose = require("mongoose");

var ErrorLogSchema = mongoose.Schema({

    created: Date,
    deviceType: String,
    deviceName: String,
    category: String,
    error: String,
    ip: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
        
});

var ErrorLog = mongoose.model('ErrorLog', ErrorLogSchema);

module.exports = {
    ErrorLog
}