var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    req.flash('successMessages', 'Successfully logged out!');
    req.logout();
    res.redirect('login');
});

module.exports = router;