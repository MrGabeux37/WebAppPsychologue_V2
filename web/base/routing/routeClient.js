var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController.js');


router.get('/profil_client',async function(req, res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  console.log(decoded);
  if(decoded.scope=='clientOui'){
    res.render('../public/views/client/profil', {layout:'clientOui'});
  }
  else if(decoded.scope=='clientNon'){
    res.render('../public/views/client/profil', {layout:'clientNon'});
  }
  else{
    res.redirect('/errorAccess');
  }
});

//export this router to use in index.js
module.exports = router;
