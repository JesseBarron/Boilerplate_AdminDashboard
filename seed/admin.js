var bcrypt = require('bcrypt');
var User = require('../config/models/User').User;


(async()=>{
    try {
        for (let i = 1; i < 5; i++) {
            let _user = new User();
            _user.role = (i==1?'SuperAdmin':'Admin');
            _user.email = `test+${i}@gmail.com`;
            _user.password = await bcrypt.hash('password', 12);
            let user = await _user.save();
    
            console.log(`Created a new ${user.role} user!`);
            console.log(user);
        }
        console.log('Finished seeding!');
    }
    catch (error) {
        console.log('SEEDING ERROR:',error);
    }
})();
