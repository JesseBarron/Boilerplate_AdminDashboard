var mongoose = require("mongoose");

var EmailLogSchema = mongoose.Schema({

    date: Date,
    to: String,
    subject: String,
    content: String
        
});

var EmailLog = mongoose.model('EmailLog', EmailLogSchema);

module.exports = {
    EmailLog
}