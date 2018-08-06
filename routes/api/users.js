var express = require('express');
var router = express.Router();
var authCheck = require('../authcheck');
var User = require('../../config/models/User').User;
var common = require('../../config/common');
var permission = require('permission');
var bcrypt = require('bcrypt');

/* GET all users */
router.get('/', authCheck, async (req, res) => {

	try {
		let users = await User.find();
		return res.json({success:true,data:users});
	}
	catch (error) {
		common.LogError('API GET /users',error,req.user._id,req.ip);
		return res.json({success:false,message:"There was a problem processing that request. If the problem persists, please contact support."});
	}
	
});

router.post('/', authCheck, async (req, res) => {

	if (!req.body.email || !req.body.password || !req.body.passwordConfirm || !req.body.role) {
		return res.json({success:false,message:"Must fill in all fields to create a new user."});
	}

	if (req.body.password !== req.body.passwordConfirm) {
		return res.json({success:false,message:"The password must match the password confirm"});
	}
	
	try {
		
		let foundUser = await User.findOne({email:req.body.email});
		if (foundUser) {
			return res.json({success:false,message:"That email address is already in use"});
		}

		let hash = await bcrypt.hash(req.body.password,12);
		
		let _user = new User();
		_user.email = req.body.email;
		_user.password = hash;
		_user.role = req.body.role;
		_user.created = new Date();

		let user = await _user.save();

		let activityContent = "User by id "+req.user._id+" created a new user by id "+user._id;
		common.LogActivity("Create User",activityContent,req.user._id,req.ip);

		req.flash('successMessages','Successfully create the new user!');
		return res.redirect('/users');
		
		//If using ajax
		// return res.json({success:true,message:"Successfully created the new user!"});
		
	}
	catch (error) {
		console.log('failed to create user because:',error);
		common.LogError("Create User",error,req.user._id,req.ip);

		req.flash('errorMessages',"There was an problem processing that request. If this problem persists, please contact support");
		return res.redirect('/users');
		
		// return res.json({success:false,message:"There was an problem processing that request. If this problem persists, please contact support"});
	}
	
});


router.delete('/:_id', authCheck, permission(['SuperAdmin']), async (req, res) => {

	try {
		let _id = req.params._id;
		await User.deleteOne({_id});

		let activityContent = "User by id:"+req.user._id+" deleted the user by id:"+_id;
		await common.LogActivity("Delete User",activityContent,req.user._id,req.ip);
		return res.json({success:true,message:"Successfully deleted user!"});
	}
	catch (error) {
		common.LogError('API DELETE /users',error,req.user._id,req.ip);
		return res.json({success:false,message:"There was a problem processing that request. If the problem persists, please contact support."});
	}
	
});

module.exports = router;
