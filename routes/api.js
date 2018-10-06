var express = require('express');
var router = express.Router();

/* POST install */
router.post('/install', function (req, res, next) {
  // TODO install db schema structure
  res.json({ message: 'Success' });
});

module.exports = router;
