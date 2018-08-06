var mongoose = require("mongoose");

var ErrorLogSchema = mongoose.Schema({

    date: Date,
    category: String,
    error: String,
    ip: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
        
});

var ErrorLog = mongoose.model('ErrorLog', ErrorLogSchema);

module.exports = {
    ErrorLog
}