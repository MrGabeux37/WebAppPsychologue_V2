var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  res.send('GET default route');
});

router.post('/', function(req, res){
  res.send('POST default route');
});


//export this router to use in index.js
module.exports = router;
