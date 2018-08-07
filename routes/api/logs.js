var ActivityLog = require('../../config/models/ActivityLog').ActivityLog;
var express = require('express');
var router = express.Router();
var authCheck = require('../authcheck');
var moment = require('moment');
var common = require('../../config/common');

/* GET all logs */
router.get('/', authCheck, async (req, res) => {

	try {
		let logs = await ActivityLog.find().toArray();
		console.log(typeof logs);
		logs.forEach((e,i)=>{
			logs[i].date = moment(logs[i].date).format('YYYY');
		});
		return res.json({success:true,data:logs});
	}
	catch (error) {
		common.LogError('API GET /logs',error,req.user._id,req.ip);
		return res.json({success:false,message:"There was a problem processing that request. If the problem persists, please contact support."});
	}
	
});

module.exports = router;