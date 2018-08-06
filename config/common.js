const ActivityLog = require('./models/ActivityLog').ActivityLog;
const ErrorLog = require('./models/ErrorLog').ErrorLog;
const nodemailer = require('nodemailer');


/**
 * Function to send emails
 * 
 * @param {Object} emailArgs Object contains the following: "to", "subject", "html"
 * @param {function} callback The function the run after sending the email
 */
exports.SendEmail = function (emailArgs, callback) {
    var transport = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    transport.sendMail(emailArgs, (error, info) => {
        if (error) {
            exports.LogError("Email",error,null,null);
            callback(error);
        }
        else {
            callback(null);
        }
    })
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
 * Generic function to log errors into the database with relevant data.
 * Returns a Promise.
 * 
 * @param {string} category The cateogry of the error e.g. Login , Email , Message , etc...
 * @param {string} error The error message
 * @param {ObjectId} userId The id of the user that the error occurred for
 * @param {string} ip The ip address of the user that the error occured for
 */
exports.LogError = (category, error, userId, ip) => {

    return new Promise(async (resolve, reject) => {

        try {
            let _errorLog = new ErrorLog();
            _errorLog.date = new Date();
            _errorLog.category = category;
            _errorLog.error = error;
            _errorLog.user = userId;
            _errorLog.ip = ip;
            await _errorLog.save();
            resolve();
        }
        catch (error) {
            reject(error);
        }

    });

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
exports.LogActivity = (activity, content, userId, ip) => {

    return new Promise(async (resolve, reject) => {

        try {
            let _activityLog = new ActivityLog();
            _activityLog.date = new Date();
            _activityLog.activity = activity;
            _activityLog.content = content;
            _activityLog.user = userId;
            _activityLog.ip = ip;
            await _activityLog.save();
            resolve();
        }
        catch (error) {
            reject(error);
        }

    });

}