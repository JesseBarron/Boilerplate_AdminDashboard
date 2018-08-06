var express = require('express');
var router = express.Router();
var passport = require('passport');
var common = require('../config/common');

router.get('/', (req, res) => {
    return res.render(
        'login',
        { 
            title: 'Login',
            errorMessages: req.flash('errorMessages'),
            successMessages: req.flash('successMessages')
        }
    );
});

router.post('/', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
)

module.exports = router;
