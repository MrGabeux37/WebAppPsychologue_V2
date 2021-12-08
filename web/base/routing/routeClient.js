var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

//decode Cookie function
function decodeCookie(token){
  return jwt.verify(token, 'Le Prince des Petits');
};

router.get('/profil_client',async function(req, res){
  var decoded = decodeCookie(req.cookies.jwt);
  console.log(decoded);
  if(decoded.scope=='clientOui'){
    res.render('../public/views/client/profil', {layout:'clientOui'});
  }
  else if(decoded.scope=='clientNon'){
    res.render('../public/views/client/profil', {layout:'clientNon'});
  }
  //change this to a special page with a button to go back to their profile page
  else{
    res.render('../public/views/main/login', {
      layout:'main',
      message: 'Page non accessible pour vous',
      messageClass: 'alert-danger'
    });
  }
});

//export this router to use in index.js
module.exports = router;
