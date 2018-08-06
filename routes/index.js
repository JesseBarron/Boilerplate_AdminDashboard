var express = require('express');
var router = express.Router();
var authCheck = require('./authcheck');

/* GET home page. */
router.get('/', authCheck, (req, res, next) => {
	res.render(
		'index',
		{
			menu: 'dashboard',
			title: 'Dashboard',
			successMessages: req.flash('successMessages'),
			errorMessages: req.flash('errorMessages')
		}
	);
});


module.exports = router;
