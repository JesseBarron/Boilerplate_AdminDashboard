const express = require('express');
const router = express.Router();
const adminAuth = require('./adminAuth');
const common = require('../config/common');

/* GET users listing. */
router.get('/', adminAuth, (req, res, next) => {
  res.render(
    'users',
    { 
      menu: 'users',
      title: 'Users'
    }
  );
});

module.exports = router;
