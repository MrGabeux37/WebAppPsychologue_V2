var express = require('express');
var router = express.Router();

//basic GET route
router.get('/', function(req, res){
  res.render('client/disponnibilite', {layout:'clientOui'})
});

//basic POST route
router.post('/', function(req, res){
  res.send('POST default route');
});


//export this router to use in index.js
module.exports = router;
