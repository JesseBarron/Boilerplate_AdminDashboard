const express = require('express');
const router = express.Router();
const adminAuth = require('../../middlewares/adminAuth');

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
