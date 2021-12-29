var express = require('express');
var router = express.Router();
const Client = require('../models/client.js');
const Contact = require('../models/contact.js');
const Psychologue = require('../models/psychologue.js');
const RendezVous = require('../models/rendezvous.js');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController.js');

//Get client profile
router.get('/profil_client',async function(req, res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
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
      enfantPrenom: client.prenom,
      condition: "disabled",
      conditionExtra: "disabled",
      post:"GET",
      buttonPassword: true,
      MessageButton:"Modifier les informations du profil"

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

    res.render('../public/views/client/profil',{
      layout:'clientnon',
      nomContact: contact.Nom,
      prenomContact: contact.Prenom,
      courrielContact: contact.Email,
      numTelContact: contact.Num_Tel,
      courriel_extra1: contact.Email_Extra1,
      courriel_extra2: contact.Email_Extra2,
      courriel_extra3: contact.Email_Extra3,
      enfantNom: client.nom,
      enfantPrenom: client.prenom,
      condition: "disabled",
      conditionExtra: "disabled",
      post:"GET",
      buttonPassword: true,
      MessageButton:"Modifier les informations du profil"

    });
  }
  else{
    res.redirect('/errorAccess');
  }
});

//enable les champs pour modifier le profil
router.get('/profil_update',async function(req,res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
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
      enfantPrenom: client.prenom,
      condition: "required",
      conditionExtra: "",
      post:"POST",
      buttonPassword: false,
      MessageButton:"Enregistrer"

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

    res.render('../public/views/client/profil',{
      layout:'clientNon',
      nomContact: contact.Nom,
      prenomContact: contact.Prenom,
      courrielContact: contact.Email,
      numTelContact: contact.Num_Tel,
      courriel_extra1: contact.Email_Extra1,
      courriel_extra2: contact.Email_Extra2,
      courriel_extra3: contact.Email_Extra3,
      enfantNom: client.nom,
      enfantPrenom: client.prenom,
      condition: "required",
      conditionExtra: "",
      post:"POST",
      buttonPassword: false,
      MessageButton:"Enregistrer"

    });
  }
  else{
    res.redirect('/errorAccess');
  }
});

//enregistre l'information dans le profil
router.post('/profil_update', async function(req, res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  if(decoded.scope=='clientOui' || decoded.scope=='clientNon'){
    //get payload
    var payload = req.body;

    //get contact
    var contact = await Contact.findOne({
      where:{ID_Contact: decoded.id}
    });

    //get client of Contact
    var client = await Client.findOne({
      where:{id_client : contact.Client}
    });
    contact.Nom=payload.nom_contact1;
    contact.Prenom=payload.prenom_contact1;
    contact.Num_Tel=payload.num_telephone_contact1;
    contact.Email=payload.courriel_contact1;
    (payload.courriel_extra1) ? contact.Email_Extra1=payload.courriel_extra1 : contact.Email_Extra1=null ;

    (payload.courriel_extra2) ? contact.Email_Extra2=payload.courriel_extra2 : contact.Email_Extra2=null ;

    (payload.courriel_extra3) ? contact.Email_Extra3=payload.courriel_extra3 : contact.Email_Extra3=null;


    client.nom=payload.nom_client;
    client.prenom=payload.prenom_client;

    client.save();
    contact.save();
    res.redirect('/profil_updated');

  }
  else{
    res.redirect('/errorAccess');
  }
});

router.get('/reservation', async function(req, res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  if(decoded.scope=='clientOui'){

    //get contact
    var contact = await Contact.findOne({
      where:{ID_Contact: decoded.id}
    });

    //get client of Contact
    var client = await Client.findOne({
      where:{id_client : contact.Client}
    });

    //get all the reservations
    var rendezVous = await RendezVous.findAll({
      where:{id_client : contact.Client}
    });

    res.render('../public/views/client/reservation',{
      layout:'clientOui',
      resultat:rendezVous
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

    //get all the reservations
    var rendezVous = await RendezVous.findAll({
      where:{id_client : contact.Client}
    });

    res.render('../public/views/client/reservation',{
      layout:'clientNon',
      resultat:rendezVous
    });
  }
  else{
    res.redirect('/errorAccess');
  }
});

//export this router to use in index.js
module.exports = router;
