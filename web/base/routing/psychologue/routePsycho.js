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

//affiche tous les clients et effectue la recherche dans les clients par le nom et le prenom
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

//affiche l'information d'un client choisie
router.get('/clients/profil/:id_client', async function(req,res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  if(decoded.scope=='psychologue'){
    //get le parametre dans le URL
    var params = req.params;
    console.log(params);
    //trouve le client choisi
    var client = await Client.findOne({
      where:{id_client:params.id_client}
    });
    //trouve les contacts associes au clients
    var contacts = await Contact.findAll({
      where:{Client:params.id_client}
    });



    res.render('../public/views/psychologue/clients_profil', {
      layout:'psychologue',
      client: client,
      contacts: contacts,
      condition: 'disabled',
      condition2: 'disabled',
      condition3:'disabled',
      post:'GET',
      boutton: 'Modifier les info du compte'
    });
  }
  else{
    res.redirect('/errorAccess');
  }
})

//affiche l'information d'un client choisie et active les input field
router.get('/clients/profil_update/:id_client', async function(req,res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  if(decoded.scope=='psychologue'){
    //get le parametre dans le URL
    var params = req.params;
    //trouve le client choisi
    var client = await Client.findOne({
      where:{id_client:params.id_client}
    });
    //trouve les contacts associes au clients
    var contacts = await Contact.findAll({
      where:{Client:params.id_client}
    });


    res.render('../public/views/psychologue/clients_profil', {
      layout:'psychologue',
      client: client,
      contacts: contacts,
      condition: 'required',
      condition2: '',
      condition3:'',
      post:'POST',
      boutton: 'Enregistrer'
    });
  }
  else{
    res.redirect('/errorAccess');
  }
})

//affiche l'information d'un client choisie et active les input field
router.post('/clients/profil_update/:id_client', async function(req,res){
  var decoded = authController.decodeCookie(req.cookies.jwt);

  if(decoded.scope=='psychologue'){
    //get le parametre dans le URL
    var params = req.params;
    //get payload
    var payload = req.body;
    console.log(payload);
    //trouve le client choisi
    var client = await Client.findOne({
      where:{id_client:params.id_client}
    });
    //trouve les contacts associes au clients
    var contacts = await Contact.findAll({
      where:{Client:params.id_client}
    });

    //update client info
    client.nom=payload.nom_client;
    client.prenom=payload.prenom_client;
    if(payload.permission=='on'){client.permission=true;}
    else{client.permission=false;}

    //update contact1 info
    contacts[0].Nom=payload.nom_contact[0];
    contacts[0].Prenom=payload.prenom_contact[0];
    contacts[0].Num_Tel=payload.telephone_contact[0];
    contacts[0].Email=payload.courriel_contact[0];
    contacts[0].Email_Extra1=payload.courriel_extra1[0];
    contacts[0].Email_Extra2=payload.courriel_extra2[0];
    contacts[0].Email_Extra3=payload.courriel_extra3[0];

    //update contact2 info
    contacts[1].Nom=payload.nom_contact[1];
    contacts[1].Prenom=payload.prenom_contact[1];
    contacts[1].Num_Tel=payload.telephone_contact[1];
    contacts[1].Email=payload.courriel_contact[1];
    contacts[1].Email_Extra1=payload.courriel_extra1[1];
    contacts[1].Email_Extra2=payload.courriel_extra2[1];
    contacts[1].Email_Extra3=payload.courriel_extra3[1];

    //save the client and both contacts
    client.save();
    contacts[0].save();
    contacts[1].save();

    var destination="/profil_client_updated/"+client.id_client;
    res.redirect(destination);
  }
  else{
    res.redirect('/errorAccess');
  }
})
//export this router to use in index.js
module.exports = router;
