const ActivityLog = require('../../config/models/ActivityLog').ActivityLog;
const EmailLog = require('../../config/models/EmailLog').EmailLog;
const ErrorLog = require('../../config/models/ErrorLog').ErrorLog;
const express = require('express');
const router = express.Router();
const adminAuth = require('../adminAuth');
const common = require('../../config/common');
const moment = require('moment');

/* GET all logs */
router.get('/activity', adminAuth, async (req, res) => {
	
	try {
		let logs = await ActivityLog.find().sort({created:-1});
		console.log("Logs:",logs);
		return res.json({success:true,data:logs});
	}
	catch (error) {
		common.LogError('500 API GET /logs/activity',error,req.user._id,req.ip);
		return res.json({success:false,message:"There was a problem processing that request. If the problem persists, please contact support."});
	}
	
});

router.post('/activity/filter', adminAuth, async (req, res) => {

	try {
		let minDate = req.body.minDate;
		let maxDate = req.body.maxDate;
		let activityFilter = new RegExp(req.body.activity,"i");
		let filter = {
			created:{'$lte':moment(maxDate),'$gte':moment(minDate)},
			activity: activityFilter
		};
		let activities = await ActivityLog.find(filter);

		let dateTotals = activities.reduce((acc,curr,index)=>{
			let dateCreated = moment(curr.created).format('YYYY-MM-DD');
			if (acc[dateCreated]) {
				acc[dateCreated] += 1;
			}
			else {
				acc[dateCreated] = 1;
			}
			return acc;
		},{});

		let	start = moment(minDate).format('YYYY-MM-DD'),
			end = moment(maxDate).format('YYYY-MM-DD');

		let nextDay = moment(start).format('YYYY-MM-DD');

		while(nextDay <= end) {
			if(!dateTotals[nextDay]){
				dateTotals[nextDay] = 0;
			}
			nextDay = moment(nextDay).add(1,'days').format('YYYY-MM-DD');
		}

		//Format the dates to preset to flot chart [['datetime','amount'],['datetime','amount'],...]
		let flotFormattedDates = [];
		for (const date in dateTotals) {
			if (dateTotals.hasOwnProperty(date)) {
				flotFormattedDates.push([new Date(date).getTime(),dateTotals[date]]);
			}
		}
		flotFormattedDates = flotFormattedDates.sort((a,b)=> a[0] - b[0] );
		
		return res.json({success:true,content:flotFormattedDates})

	}
	catch (error) {
		common.LogError('API POST /activity/filter',error,req.user._id,req.ip);
		return res.json({success:false,message:"There was a problem processing that request. If the problem persists, please contact support."});
	}

});

router.get('/email', adminAuth, async (req, res) => {

	try {
		let logs = await EmailLog.find().sort({created:-1});
		return res.json({success:true,data:logs});
	}
	catch (error) {
		common.LogError('500 API GET /logs/email',error,req.user._id,req.ip);
		return res.json({success:false,message:"There was a problem processing that request. If the problem persists, please contact support."});
	}
	
});

router.get('/error', adminAuth, async (req, res) => {

	try {
		let logs = await ErrorLog.find().sort({created:-1});
		return res.json({success:true,data:logs});
	}
	catch (error) {
		common.LogError('500 API GET /logs/error',error,req.user._id,req.ip);
		return res.json({success:false,message:"There was a problem processing that request. If the problem persists, please contact support."});
	}
	
});

module.exports = router;