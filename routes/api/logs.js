var ActivityLog = require('../../config/models/ActivityLog').ActivityLog;
var express = require('express');
var router = express.Router();
var authCheck = require('../authcheck');

/* GET all logs */
router.get('/', authCheck, async (req, res) => {

	try {
		let logs = await ActivityLog.find();
		return res.json({success:true,data:logs});
	}
	catch (error) {
		common.LogError('API GET /logs',error,req.user._id,req.ip);
		return res.json({success:false,message:"There was a problem processing that request. If the problem persists, please contact support."});
	}
	
});

module.exports = router;