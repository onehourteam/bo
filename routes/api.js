var express = require('express');
var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

/* POST install */
router.get('/install', function (req, res, next) {
  res.json({ message: 'OK' });
});

module.exports = router;
