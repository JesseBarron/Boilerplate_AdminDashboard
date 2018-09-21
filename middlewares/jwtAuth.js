
/**
 * Check if the req.validJwt exists and what its value is.
 * validJwt is set on the req object inside ./middlewares/jwtExtract.js
 */
module.exports = function(req, res, next){

    if (req.validJwt) {
        next();
    }
    else if (req.validJwt === false) {
        return res.json({success: false, error: 'Failed to authenticate token'});
    }
    else {
        return res.json({success: false, error: 'No token was provided'});
    }

};
