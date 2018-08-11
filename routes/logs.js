const express = require('express');
const router = express.Router();
const adminAuth = require('./adminAuth');

/* GET logs page. */
router.get('/', adminAuth, (req, res, next) => {
    res.render(
        'logs',
        {
            menu: 'logs',
            title: 'Logs'
        }
    );
});


module.exports = router;
