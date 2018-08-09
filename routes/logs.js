var express = require('express');
var router = express.Router();
var adminAuth = require('./adminAuth');

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
