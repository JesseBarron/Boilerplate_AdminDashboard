var ActivityLog = require('../../config/models/ActivityLog').ActivityLog;
var EmailLog = require('../../config/models/EmailLog').EmailLog;
var ErrorLog = require('../../config/models/ErrorLog').ErrorLog;
var express = require('express');
var router = express.Router();
var adminAuth = require('../adminAuth');
var common = require('../../config/common');

/* GET all logs */
router.get('/activity', adminAuth, async (req, res) => {

	try {
		let logs = await ActivityLog.find();
		return res.json({success:true,data:logs});
	}
	catch (error) {
		common.LogError('API GET /logs/activity',error,req.user._id,req.ip);
		return res.json({success:false,message:"There was a problem processing that request. If the problem persists, please contact support."});
	}
	
});

router.get('/email', adminAuth, async (req, res) => {

	try {
		let logs = await EmailLog.find();
		return res.json({success:true,data:logs});
	}
	catch (error) {
		common.LogError('API GET /logs/email',error,req.user._id,req.ip);
		return res.json({success:false,message:"There was a problem processing that request. If the problem persists, please contact support."});
	}
	
});

router.get('/error', adminAuth, async (req, res) => {

	try {
		let logs = await ErrorLog.find();
		return res.json({success:true,data:logs});
	}
	catch (error) {
		common.LogError('API GET /logs/error',error,req.user._id,req.ip);
		return res.json({success:false,message:"There was a problem processing that request. If the problem persists, please contact support."});
	}
	
});

module.exports = router;