const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../../models/User').User;
const LogError = require('../../../config/common').LogError;
const common = require('../../../config/common');

module.exports = async (req, res) => {

    let {email, password} = req.body;

    if (!email || !password) {
        return res.json({success:false,message:"Must provide both forms of credentials."});
    }

    try {
        let _user = await User.find({email});

        let passwordConfirmed = await bcrypt.compare(password,_user.password);
        if (!passwordConfirmed) {
            return res.json({success:false,message:"Incorrect email or password."});
        }

        let token = jwt.sign({_id:_user._id},process.env.SECRET);

        _user.jwt = token;
        let user = await _user.save();
        
        return res.json({success:true,content:token});

    }
    catch (error) {
        LogError("500 /enduser/api/login",error,null,req.ip,req.device.type,req.device.name);
        return res.json({success:false,message:common.errorMessages.generic500});
    }

}