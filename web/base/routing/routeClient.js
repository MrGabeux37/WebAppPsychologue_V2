var express = require('express');
var router = express.Router();
const Client = require('../models/client.js');
const Contact = require('../models/contact.js');
const Psychologue = require('../models/psychologue.js');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController.js');

//Get client profile
router.get('/profil_client',async function(req, res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  console.log(decoded);
  if(decoded.scope=='clientOui'){

    //get contact
    var contact = await Contact.findOne({
      where:{ID_Contact: decoded.id}
    });

    //get client of Contact
    var client = await Client.findOne({
      where:{id_client : contact.Client}
    });

    res.render('../public/views/client/profil',{
      layout:'clientOui',
      nomContact: contact.Nom,
      prenomContact: contact.Prenom,
      courrielContact: contact.Email,
      numTelContact: contact.Num_Tel,
      courriel_extra1: contact.Email_Extra1,
      courriel_extra2: contact.Email_Extra2,
      courriel_extra3: contact.Email_Extra3,
      enfantNom: client.nom,
      enfantPrenom: client.prenom
    });
  }
  else if(decoded.scope=='clientNon'){
    //get contact
    var contact = await Contact.findOne({
      where:{ID_Contact: decoded.id}
    });

    //get client of Contact
    var client = await Client.findOne({
      where:{id_client : contact.Client}
    });

    res.render('../public/views/client/profil', {
      layout:'clientNon',
      nomContact: contact.Nom,
      prenomContact: contact.Prenom,
      courrielContact: contact.Email,
      numTelContact: contact.Num_Tel,
      courriel_extra1: contact.Email_Extra1,
      courriel_extra2: contact.Email_Extra2,
      courriel_extra3: contact.Email_Extra3,
      enfantNom: client.nom,
      enfantPrenom: client.prenom
    });
  }
  else{
    res.redirect('/errorAccess');
  }
});

//export this router to use in index.js
module.exports = router;
