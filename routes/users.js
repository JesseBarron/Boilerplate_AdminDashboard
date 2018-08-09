var express = require('express');
var router = express.Router();
var adminAuth = require('./adminAuth');
var common = require('../config/common');

/* GET users listing. */
router.get('/', adminAuth, (req, res, next) => {
  res.render(
    'users',
    { 
      menu: 'users',
      title: 'Users',
      successMessages: req.flash('successMessages'),
      errorMessages: req.flash('errorMessages')
    }
  );
});

module.exports = router;
