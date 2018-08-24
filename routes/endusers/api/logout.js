const User = require('../../../models/User').User;
const LogActivity = require('../../../config/common').LogActivity;
const LogError = require('../../../config/common').LogError;

module.exports = async (req, res) => {

    try {
        let _user = req.user;

        _user.jwt = null;
        let user = await _user.save();

        LogActivity("Logout",`User ${req.user.email} logged out.`,req.user._id,req.ip,req.device.type,req.device.name,(req.location.latitude||null),(req.location.longitude||null));
        return res.json({success:true,message:"Successfully logged out"});
    }
    catch (error) {
        LogError("500 Logout",error,req.user._id,req.ip,req.device.type,req.device.name);
        return res.json({success:false,message:"There was an problem processing that request. If this problem persists, please contact support"});
    }
    
}