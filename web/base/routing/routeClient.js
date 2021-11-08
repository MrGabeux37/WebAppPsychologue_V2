var express = require('express');
var router = express.Router();

router.get('/profil_client',async function(req, res){
  if(req.cookies.scope=='clientOui'){
    res.render('../public/views/client/profil', {layout:'clientOui'});
  }
  else if(req.cookies.scope=='clientNon'){
    res.render('../public/views/client/profil', {layout:'clientNon'});
  }
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
