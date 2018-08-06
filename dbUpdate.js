// var bcrypt = require('bcrypt');
// var User = require('./config/models/User').User;


// (async()=>{
//     try {
//         for (let i = 0; i < 12; i++) {
//             let _user = new User();
//             _user.role = 'Admin';
//             _user.email = `dillonstreator+${i}@gmail.com`;
//             _user.password = await bcrypt.hash('password', 12);
//             console.log('finished hashing and starting save');
//             console.log(_user.password);
//             let user = await _user.save();
    
//             console.log("new user!");
//             console.log(user);
//         }
        
//     }
//     catch (error) {
//         console.log('USER CREATION ERROR:::',error);
//     }
// })();

