const ActivityLog = require('./models/ActivityLog').ActivityLog;
const ErrorLog = require('./models/ErrorLog').ErrorLog;
const EmailLog = require('./models/EmailLog').EmailLog;
const nodemailer = require('nodemailer');


/**
 * Function to send emails
 * 
 * @param {Object} emailArgs Object contains the following: "to", "subject", "html"
 * @param {function} callback The function the run after sending the email
 */
exports.SendEmail = async (emailArgs) => {
    var transport = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        let promises = [
            transport.sendMail(emailArgs),
            LogEmail(emailArgs.to,emailArgs.subject,emailArgs.html)
        ];
        await Promise.all(promises);
    }
    catch (error) {
        throw new Error(error);
    }
}
// =======================================================================|
// ============================ EMAIL EXAMPLE ============================|
// =======================================================================|
// const common = require("path_to_common.js");
// let emailArgs = {
//     to: "someone@email.com",
//     subject: "Important subject line",
//     html: `
//         <h1>Hello there</h1>
//         <p>I can send emails that contain html</p>
//     `
// }
// common.SendEmail(emailArgs, (error) => {
//     ...code to run after email is sent
// })
// =======================================================================|
// ============================ EMAIL EXAMPLE ============================|
// =======================================================================|

/**
 * Logs an email in the database for later reference
 * 
 * @param {string} subject The subject line of the email that was sent
 * @param {string} content The body/content of the email that was sent
 * @param {ObjectId} userId The id of the user that was referenced in for the email
 */
const LogEmail = async (to, subject, content) => {

    try {
        let _emailLog = new EmailLog();
        _emailLog.created = new Date();
        _emailLog.to = to;
        _emailLog.subject = subject;
        _emailLog.content = content;
        let emailLog = await _emailLog.save();
        return emailLog;
    }
    catch (error) {
        throw new Error(error);
    }

}


/**
 * Generic function to log errors into the database with relevant data.
 * Returns a Promise.
 * 
 * @param {string} category The cateogry of the error e.g. Login , Email , Message , etc...
 * @param {string} error The error message
 * @param {ObjectId} userId The id of the user that the error occurred for
 * @param {string} ip The ip address of the user that the error occured for
 */
exports.LogError = async (category, error, userId, ip) => {

    try {
        let _errorLog = new ErrorLog();
        _errorLog.created = new Date();
        _errorLog.category = category;
        _errorLog.error = error;
        _errorLog.user = userId;
        _errorLog.ip = ip;
        let errorLog = await _errorLog.save();
        return errorLog;
    }
    catch (error) {
        throw new Error(error);
    }

}


/**
 * Generic function for creating a new entry in the activity log.
 * Returns a Promise.
 * 
 * @param {string} activity The activity name
 * @param {string} content Any information relating to the activity that has taken place
 * @param {ObjectId} userId The users objectId that has performed the activity
 * @param {string} ip The ip address of the user. Accessed through req.ip
 */
exports.LogActivity = async (activity, content, userId, ip) => {

    try {
        let _activityLog = new ActivityLog();
        _activityLog.created = new Date();
        _activityLog.activity = activity;
        _activityLog.content = content;
        _activityLog.user = userId;
        _activityLog.ip = ip;
        let activityLog = await _activityLog.save();
        return activityLog;
    }
    catch (error) {
        throw new Error(error);
    }

}
