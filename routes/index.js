var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST install */
router.get('/install', function(req, res, next) {
  //res.
});

module.exports = router;
