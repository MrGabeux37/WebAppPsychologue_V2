var express = require('express');
var router = express.Router();

//testing Route
router.get('/test', function(req, res){
  res.render('../public/views/psychologue/reservations', {layout: 'psychologue'})
})
//first route
router.get('/', function(req, res){
  res.redirect('/login');
})

//login page
router.get('/login', function(req, res){
  res.render('../public/views/main/login', {layout:'main'})
});

//register page
router.get('/register', function(req, res){
  res.render('../public/views/main/register', {layout: 'main'})
})

//basic POST route
router.post('/', function(req, res){
  res.send('POST default route');
});

//export this router to use in index.js
module.exports = router;
