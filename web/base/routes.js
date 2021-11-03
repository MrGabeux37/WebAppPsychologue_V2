var express = require('express');
var router = express.Router();

//first route
router.get('/', function(req, res){
  res.redirect('/login');
})

//login page
router.get('/login', function(req, res){
  res.render('main/login', {layout:'main'})
});

router.get('/register', function(req, res){
  res.render('main/register', {layout: 'main'})
})

//basic POST route
router.post('/', function(req, res){
  res.send('POST default route');
});


//export this router to use in index.js
module.exports = router;
