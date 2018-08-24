const express = require('express');
const router = express.Router();
const adminAuth = require('../../../middlewares/adminAuth');
const User = require('../../../models/User').User;
const common = require('../../../config/common');

/* GET all users */
router.get('/', adminAuth, async (req, res) => {

	try {
		let users = await User.find();
		return res.json({success:true,data:users});
	}
	catch (error) {
		common.LogError('API GET /users',error,req.user._id,req.ip,req.device.type,req.device.name);
		return res.json({success:false,message:"There was a problem processing that request. If the problem persists, please contact support."});
	}
	
});

module.exports = router;
