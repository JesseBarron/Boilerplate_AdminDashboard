const LogActivity = require('../config/common').LogActivity;
const LogError = require('../config/common').LogError;

/**
 * This is the main middleware that will take care of:
 * - Updating user IP address and count
 * - Updating the Users lat/lng if passed along
 * - Logging 'Access' activity in the Activity Log
 * - Setting the res.locals variables that will be accessible in the view
 */
module.exports = async (req,res,next)=>{
	res.locals.successMessages = req.flash('successMessages');
	res.locals.errorMessages = req.flash('errorMessages');

	//Pass location object with latitude/longitude as header from app to api as often as possible to get latest updated location record
	let location = null;
	if (req.headers.location) {
		location = JSON.parse(req.headers.location)
	}

	let userId = null,
		latitude = ((location && location.latitude) || null),
		longitude = ((location && location.longitude) || null);
	if (req.user) {
		//Store the user in "locals" in order to access in the view
		userId = req.user._id;
		res.locals.user = req.user;
		
		try {
			let _user = req.user;
			let indexOfIp = _user.ips.findIndex( e => e.ip == req.ip );
			//Keep track of users ip addresses and the access count per ip address
			if (indexOfIp == -1) {
				_user.ips.push({ip:req.ip,accessCount:1});
			}
			else {
				_user.ips[indexOfIp].accessCount += 1;
			}
			_user.lastSeen = new Date();

			//Update the users lat/lng if it's provided in the req header
			if (location && latitude && longitude) {
				if (typeof parseFloat(latitude) == 'number' && typeof parseFloat(longitude) == 'number') {
					_user.location.latitude = parseFloat(latitude);
					_user.location.longitude = parseFloat(longitude);
					latitude = parseFloat(latitude);
					longitude = parseFloat(longitude);
				}
			}
			let user = await _user.save();
		}
		catch (error) {
			LogError(`500 ${req.url} update user middlewares`,error,userId,req.ip,req.device.type,req.device.name);
			return res.render('error500');
		}
		
	}
	
	//Don't care to log access if the user is an Admin or SuperAdmin. Only log access if the request is from a regular user
	if (req.user && req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin') {
		LogActivity("Access",req.url,userId,req.ip,req.device.type,req.device.name,latitude,longitude);
	}
	req.location = location;

	next();
};