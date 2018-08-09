var express = require('express');
var router = express.Router();
var authCheck = require('./authcheck');
var User = require('../config/models/User').User;
var ErrorLog = require('../config/models/ErrorLog').ErrorLog;
var ActivityLog = require('../config/models/ActivityLog').ActivityLog;
var moment = require('moment');

/* GET home page. */
router.get('/', authCheck, async (req, res, next) => {

	let promises = [
		User.find(),
		ErrorLog.find(),
		ActivityLog.find()
	]
	let [allUsers, allErrors, allActivities] = await Promise.all(promises);

	let [thisWeeksRegistrations, weeklyRegistrationIncreasePercent] = weekTotalAndPercentIncrease(allUsers);

	let [thisWeeksErrors, weeklyErrorIncreasePercent] = weekTotalAndPercentIncrease(allErrors);

	let allLogins = allActivities.filter( a => a.activity == 'Login' );
	let [thisWeeksLogins, weeklyLoginIncreasePercent] = weekTotalAndPercentIncrease(allLogins);
	
	res.render(
		'index',
		{
			menu: 'dashboard',
			title: 'Dashboard',
			successMessages: req.flash('successMessages'),
			errorMessages: req.flash('errorMessages'),
			totalUsers: allUsers.length,
			thisWeeksRegistrations,
			weeklyRegistrationIncreasePercent,
			thisWeeksErrors,
			weeklyErrorIncreasePercent,
			thisWeeksLogins,
			weeklyLoginIncreasePercent
		}
	);
});

/**
 * Get the percent increase in 2 numbers. If the result is a negative number then this is a percentage decrease.
 * @param {number} newNumber The new number
 * @param {number} originalNumber The original number
 */
function percentIncrease(newNumber, originalNumber){
	let increase = newNumber - originalNumber;
	return ((increase+originalNumber)*100);
}

/**
 * Returns Array[thisWeeksItems, weeklyItemsIncreasePercent]
 * Assumes that the elements are objects with a 'created' propert that is a Javascript Date
 * Use ES6 Array destructuring with the return
 * 
 * @param {Array} items The items to get the weekly total of and the percent increase from previous week
 */
function weekTotalAndPercentIncrease(items){
	let thisWeeksItems = items.filter( i => i.created > moment().subtract(1,'weeks') ).length;
	let previousWeeksItems = items.filter( i => ( i.created > moment().subtract(2,'weeks') ) && ( i.created < moment().subtract(1,'weeks') ) ).length;
	let weeklyItemsIncreasePercent = 0;
	if (previousWeeksItems!==0) {
		weeklyItemsIncreasePercent = percentIncrease(thisWeeksItems, previousWeeksItems);
	}
	else {
		weeklyItemsIncreasePercent = parseInt(`${thisWeeksItems}00`);
	}
	return [thisWeeksItems, weeklyItemsIncreasePercent];
}

module.exports = router;
