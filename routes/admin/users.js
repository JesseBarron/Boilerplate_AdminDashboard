const express = require('express');
const router = express.Router();
const adminAuth = require('../../middlewares/adminAuth');
const common = require('../../config/common');
const permission = require('permission');
const bcrypt = require('bcrypt');
const User = require('../../models/User').User;

/* GET users listing. */
router.get('/', adminAuth, (req, res, next) => {
  res.render(
    'users',
    { 
      menu: 'users',
      title: 'Users'
    }
  );
});

router.post('/', adminAuth, async (req, res) => {

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
		_user.ips = [];
		_user.lastSeen = null;
		_user.location = {
			latitude: parseFloat(req.body.latitude) || null,
			longitude: parseFloat(req.body.longitude) || null
		}

		let user = await _user.save();

		let activityContent = "User "+req.user.email+" created a new user "+user.email;
		common.LogActivity("Create User",activityContent,req.user._id,req.ip,req.device.type,req.device.name);
		
		let email = {
			to: user.email,
			subject: process.env.COMPANY+" | New User",
			html: "Welcome to "+process.env.COMPANY
		}
		common.SendEmail(email);
		
		req.flash('successMessages',`Successfully created new user ${user.email}!`);
		return res.redirect('/admin/users');
		
		//If using ajax
		// return res.json({success:true,message:"Successfully created the new user!"});
		
	}
	catch (error) {
		common.LogError("Create User",error,req.user._id,req.ip,req.device.type,req.device.name);

		req.flash('errorMessages',"There was an problem processing that request. If this problem persists, please contact support");
		return res.redirect('/admin/users');
		
		// return res.json({success:false,message:"There was an problem processing that request. If this problem persists, please contact support"});
	}
	
});


router.delete('/:_id', adminAuth, permission(['SuperAdmin']), async (req, res) => {

	try {
		let _id = req.params._id;
		await User.deleteOne({_id});

		let activityContent = "User "+req.user.email+" deleted the user by id:"+_id;
		await common.LogActivity("Delete User",activityContent,req.user._id,req.ip,req.device.type,req.device.name);
		return res.json({success:true,message:"Successfully deleted user!"});
	}
	catch (error) {
		common.LogError('API DELETE /users',error,req.user._id,req.ip,req.device.type,req.device.name);
		return res.json({success:false,message:"There was a problem processing that request. If the problem persists, please contact support."});
	}
	
});

module.exports = router;
