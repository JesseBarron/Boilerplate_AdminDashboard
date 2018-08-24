const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    req.flash('successMessages', 'Successfully logged out!');
    req.logout();
    res.redirect('/admin/login');
});

module.exports = router;