const jwt = require('jsonwebtoken');
const common = require('../config/common');
const User = require('../models/User').User;

/**
 * Set validJwt boolean on the req object and set user on the req object also
 */
module.exports = (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token){
        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if(err){
                common.LogError("jwtAuth",err,null,req.ip,req.device.type,req.device.name);
                req.validJwt = false;
                next();
            }
            else{
                let user = await User.find({_id:decoded._id});
                req.user = user;
                req.validJwt = true;
                next();
            }
        });
    }
    else{
        req.validJwt = null;
        next();
    }
};