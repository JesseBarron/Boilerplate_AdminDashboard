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
		let logs = await ActivityLog.find({type:req.body.type});
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
		let filterDateRange = {created:{'$lte':moment(maxDate),'$gte':moment(minDate)}};
		let activities = await ActivityLog.find(filterDateRange);

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

		let dates = Object.keys(dateTotals),
			start = moment(minDate).format('YYYY-MM-DD'),
			end = moment(maxDate).format('YYYY-MM-DD');

		// console.log('dates:',dates);
		// console.log('start:',start);
		// console.log('end:',end);

		let nextDay = moment(start).format('YYYY-MM-DD');

		while(nextDay <= end) {
			// console.log('Checking if',nextDay,'exists');
			if(!dateTotals[nextDay]){
				// console.log('that day does not exist!');
				dateTotals[nextDay] = 0;
			}
			else {
				// console.log('Yup.. that day exists!');
			}
			nextDay = moment(nextDay).add(1,'days').format('YYYY-MM-DD');
		}

		let arrayOfArrays = [];
		for (const date in dateTotals) {
			if (dateTotals.hasOwnProperty(date)) {
				arrayOfArrays.push([new Date(date).getTime(),dateTotals[date]]);
			}
		}

		arrayOfArrays = arrayOfArrays.sort((a,b)=> a[0] - b[0] );
		
		return res.json({success:true,content:arrayOfArrays})

	}
	catch (error) {
		common.LogError('API POST /activity/filter',error,req.user._id,req.ip);
		return res.json({success:false,message:"There was a problem processing that request. If the problem persists, please contact support."});
	}

});

router.get('/email', adminAuth, async (req, res) => {

	try {
		let logs = await EmailLog.find();
		return res.json({success:true,data:logs});
	}
	catch (error) {
		common.LogError('500 API GET /logs/email',error,req.user._id,req.ip);
		return res.json({success:false,message:"There was a problem processing that request. If the problem persists, please contact support."});
	}
	
});

router.get('/error', adminAuth, async (req, res) => {

	try {
		let logs = await ErrorLog.find();
		return res.json({success:true,data:logs});
	}
	catch (error) {
		common.LogError('500 API GET /logs/error',error,req.user._id,req.ip);
		return res.json({success:false,message:"There was a problem processing that request. If the problem persists, please contact support."});
	}
	
});

module.exports = router;