var express = require('express');
var router = express.Router();
var authCheck = require('./authcheck');

/* GET logs page. */
router.get('/', authCheck, (req, res, next) => {
    res.render(
        'logs',
        {
            menu: 'logs',
            title: 'Logs'
        }
    );
});


module.exports = router;
