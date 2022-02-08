var express = require('express');
var router = express.Router();
const Client = require('../../models/client.js');
const Contact = require('../../models/contact.js');
const Psychologue = require('../../models/psychologue.js');
const RendezVous = require('../../models/rendezvous.js');
const PlageHoraire = require('../../models/plagehoraire.js');
const Sequelize =require('sequelize');
const Op = Sequelize.Op;
const jwt = require('jsonwebtoken');
const authController = require('../../controllers/authController.js');
const url = require('url');

//get profil du psychologue
router.get('/profil_psychologue',async function(req, res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  console.log(decoded);
  if(decoded.scope=='psychologue'){
    //get contact
    var user = await Psychologue.findOne({
      where:{id_psychologue: decoded.id}
    });

    res.render('../public/views/psychologue/profil', {
      layout:'psychologue',
      post:"GET",
      nom:user.nom,
      prenom:user.prenom,
      courriel:user.courriel,
      telephone:user.num_telephone,
      buttonPassword:true,
      MessageButton:"Modifier les information du profil",
      condition:"disabled"
    });
  }
  else{
    res.redirect('/errorAccess');
  }
});

//get editable profil du psychologue
router.get('/profil_psychologue/update', async function(req,res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  console.log(decoded);
  if(decoded.scope=='psychologue'){
    //get contact
    var user = await Psychologue.findOne({
      where:{id_psychologue: decoded.id}
    });

    res.render('../public/views/psychologue/profil', {
      layout:'psychologue',
      post:"POST",
      nom:user.nom,
      prenom:user.prenom,
      courriel:user.courriel,
      telephone:user.num_telephone,
      buttonPassword:false,
      MessageButton:"Enregistrer",
      condition:"required"
    });
  }
  else{
    res.redirect('/errorAccess');
  }
});

//update info du psychologue dans la db
router.post('/profil_psychologue/update', async function(req,res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  if(decoded.scope=='psychologue'){
    //get payload
    var payload = req.body;
    //get contact
    var user = await Psychologue.findOne({
      where:{id_psychologue: decoded.id}
    });

    user.nom=payload.nom;
    user.prenom=payload.prenom;
    user.courriel=payload.courriel;
    user.num_telephone=payload.num_telephone;
    user.save();
    res.redirect('/profil_updated');
  }
  else{
    res.redirect('/errorAccess');
  }
});

router.get('/clients', async function(req,res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  if(decoded.scope=='psychologue'){
    //get url query
    const query = url.parse(req.url, true).query;
    console.log(query);

    //get client with or without query info
    var clients = await Client.findAll({
      where:{
        nom:{[Op.substring]:(query.nom_client==undefined ? '' : query.nom_client)},
        prenom:{[Op.substring]:(query.prenom_client==undefined ? '' : query.prenom_client)}
      }
    });
    console.log(clients);
    res.render('../public/views/psychologue/clients_recherche', {
      layout:'psychologue',
      nom : query.nom_client,
      prenom: query.prenom_client,
      resultats:clients
    });
  }
  else{
    res.redirect('/errorAccess');
  }
})

//export this router to use in index.js
module.exports = router;
