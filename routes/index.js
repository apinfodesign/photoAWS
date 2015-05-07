var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: 'Photo Albums Project with AWS' });
//   //res.render('index.html');
// });

// router.get('/', function(req, res, next) {
//   res.sendFile('index.html');
// });

router.get('/', function(req, res) {
  res.sendfile("views/index.html");
});


module.exports = router;
