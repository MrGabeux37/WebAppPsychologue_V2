var express = require('express');
var router = express.Router();
const Client = require('../../models/client.js');
const Contact = require('../../models/contact.js');
const Psychologue = require('../../models/psychologue.js');
const jwt = require('jsonwebtoken');
const authController = require('../../controllers/authController.js');

router.get('/profil_psychologue',async function(req, res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  console.log(decoded);
  if(decoded.scope=='psychologue'){

    //get contact
    var user = await Psychologue.findOne({
      where:{id_psychologue: decoded.id}
    });

    res.render('../public/views/psychologue/profil', {layout:'psychologue'});
  }
  else{
    res.redirect('/errorAccess');
  }

});
//export this router to use in index.js
module.exports = router;
