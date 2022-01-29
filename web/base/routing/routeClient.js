var express = require('express');
var router = express.Router();
const Client = require('../models/client.js');
const Contact = require('../models/contact.js');
const Psychologue = require('../models/psychologue.js');
const RendezVous = require('../models/rendezvous.js');
const PlageHoraire = require('../models/plagehoraire.js');
const Sequelize =require('sequelize');
const Op = Sequelize.Op;
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

//route de base des réservations
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
      order:[['date','ASC']],
      where:{id_client : contact.Client}
    });

    //get all the correct plagehoraire
    var plageHoraire=[];
    for(var i=0;i<rendezVous.length;i++){
      var temp = await PlageHoraire.findOne({
        where:{id_plage_horaire:rendezVous[i].id_plage_horaire}
      });
      if(temp){
        temp.heure_fin=temp.heure_fin.substr(0,5);
        temp.heure_debut=temp.heure_debut.substr(0,5);
        plageHoraire.push(temp)
      }
    }

    //get psychologue
    var psy = await Psychologue.findOne({
      where:{id_psychologue : rendezVous[0].id_psychologue}
    });
    var nomPsychologue = psy.prenom + " " + psy.nom;

    res.render('../public/views/client/reservation',{
      layout:'clientOui',
      resultats:rendezVous,
      resultatPsy:nomPsychologue,
      resultathoraire:plageHoraire
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
      order:[['date','ASC']],
      where:{id_client : contact.Client}
    });

    //get all the correct plagehoraire
    var plageHoraire=[];
    for(var i=0;i<rendezVous.length;i++){
      var temp = await PlageHoraire.findOne({
        where:{id_plage_horaire:rendezVous[i].id_plage_horaire}
      });
      if(temp){
        temp.heure_fin=temp.heure_fin.substr(0,5);
        temp.heure_debut=temp.heure_debut.substr(0,5);
        plageHoraire.push(temp)
      }
    }

    //get psychologue
    var psy = await Psychologue.findOne({
      where:{id_psychologue : rendezVous[0].id_psychologue}
    });
    var nomPsychologue = psy.prenom + " " + psy.nom;

    res.render('../public/views/client/reservation',{
      layout:'clientNon',
      resultats:rendezVous,
      resultatPsy:nomPsychologue,
      resultathoraire:plageHoraire
    });
  }
  else{
    res.redirect('/errorAccess');
  }
});

//route des réservations anciennes
router.get('/reservation/ancienne', async function(req, res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  var today = new Date();
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
      where:{
              [Op.and]:[
                {id_client:contact.Client},
                {date:{[Op.lte]:today}}
              ]
      },
      order:[['date','ASC']]
    });

    //get all the correct plagehoraire
    var plageHoraire=[];
    for(var i=0;i<rendezVous.length;i++){
      var temp = await PlageHoraire.findOne({
        where:{id_plage_horaire:rendezVous[i].id_plage_horaire}
      });
      if(temp){
        temp.heure_fin=temp.heure_fin.substr(0,5);
        temp.heure_debut=temp.heure_debut.substr(0,5);
        plageHoraire.push(temp)
      }
    }

    //get psychologue
    var psy = await Psychologue.findOne({
      where:{id_psychologue : rendezVous[0].id_psychologue}
    });
    var nomPsychologue = psy.prenom + " " + psy.nom;

    res.render('../public/views/client/reservation',{
      layout:'clientOui',
      resultats:rendezVous,
      resultatPsy:nomPsychologue,
      resultathoraire:plageHoraire
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
      where:{
              [Op.and]:[
                {id_client:contact.Client},
                {date:{[Op.lte]:today}}
              ]
      },
      order:[['date','ASC']]
    });

    //get all the correct plagehoraire
    var plageHoraire=[];
    for(var i=0;i<rendezVous.length;i++){
      var temp = await PlageHoraire.findOne({
        where:{id_plage_horaire:rendezVous[i].id_plage_horaire}
      });
      if(temp){
        temp.heure_fin=temp.heure_fin.substr(0,5);
        temp.heure_debut=temp.heure_debut.substr(0,5);
        plageHoraire.push(temp)
      }
    }

    //get psychologue
    var psy = await Psychologue.findOne({
      where:{id_psychologue : rendezVous[0].id_psychologue}
    });
    var nomPsychologue = psy.prenom + " " + psy.nom;

    res.render('../public/views/client/reservation',{
      layout:'clientNon',
      resultats:rendezVous,
      resultatPsy:nomPsychologue,
      resultathoraire:plageHoraire
    });
  }
  else{
    res.redirect('/errorAccess');
  }
});

//route des réservations anciennes
router.get('/reservation/future', async function(req, res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  var today = new Date();
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
      where:{
              [Op.and]:[
                {id_client:contact.Client},
                {date:{[Op.gte]:today}}
              ]
      },
      order:[['date','ASC']]
    });

    //get all the correct plagehoraire
    var plageHoraire=[];
    for(var i=0;i<rendezVous.length;i++){
      var temp = await PlageHoraire.findOne({
        where:{id_plage_horaire:rendezVous[i].id_plage_horaire}
      });
      if(temp){
        temp.heure_fin=temp.heure_fin.substr(0,5);
        temp.heure_debut=temp.heure_debut.substr(0,5);
        plageHoraire.push(temp)
      }
    }

    //get psychologue
    var psy = await Psychologue.findOne({
      where:{id_psychologue : rendezVous[0].id_psychologue}
    });
    var nomPsychologue = psy.prenom + " " + psy.nom;

    res.render('../public/views/client/reservation',{
      layout:'clientOui',
      resultats:rendezVous,
      resultatPsy:nomPsychologue,
      resultathoraire:plageHoraire
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
      where:{
              [Op.and]:[
                {id_client:contact.Client},
                {date:{[Op.gte]:today}}
              ]
      },
      order:[['date','ASC']]
    });

    //get all the correct plagehoraire
    var plageHoraire=[];
    for(var i=0;i<rendezVous.length;i++){
      var temp = await PlageHoraire.findOne({
        where:{id_plage_horaire:rendezVous[i].id_plage_horaire}
      });
      if(temp){
        temp.heure_fin=temp.heure_fin.substr(0,5);
        temp.heure_debut=temp.heure_debut.substr(0,5);
        plageHoraire.push(temp)
      }
    }

    //get psychologue
    var psy = await Psychologue.findOne({
      where:{id_psychologue : rendezVous[0].id_psychologue}
    });
    var nomPsychologue = psy.prenom + " " + psy.nom;

    res.render('../public/views/client/reservation',{
      layout:'clientNon',
      resultats:rendezVous,
      resultatPsy:nomPsychologue,
      resultathoraire:plageHoraire
    });
  }
  else{
    res.redirect('/errorAccess');
  }
});

//route des disponibilite
router.get('/calendrier', async function(req, res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  var today = new Date();
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
      where:{
              [Op.and]:[
                {disponibilite:true},
                {date:{[Op.gte]:today}}
              ]
      },
      order:[['date','ASC']]
    });

    if(rendezVous[0]){
      //get all the correct plagehoraire
      var plageHoraire=[];
      for(var i=0;i<rendezVous.length;i++){
        var temp = await PlageHoraire.findOne({
          where:{id_plage_horaire:rendezVous[i].id_plage_horaire}
        });
        if(temp){
          temp.heure_fin=temp.heure_fin.substr(0,5);
          temp.heure_debut=temp.heure_debut.substr(0,5);
          plageHoraire.push(temp);
        }
      }

      //get psychologue
      var psy = await Psychologue.findOne({
        where:{id_psychologue : rendezVous[0].id_psychologue}
      });
      var nomPsychologue = psy.prenom + " " + psy.nom;

      res.render('../public/views/client/calendar',{
        layout:'clientOui',
        resultats:rendezVous,
        resultatPsy:nomPsychologue,
        resultathoraire:plageHoraire
      });

    }

    else{
      res.render('../public/views/client/disponnibilite',{layout:'clientOui'});
    }

  }
  else{
    res.redirect('/errorAccess');
  }
});

//route confirmation d'acceptation du rendezvous
router.get('/calendrier/confirmation/:idRendezVous', async function(req,res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  var params = req.params;
  console.log(params);
  if(decoded.scope=='clientOui'){
    //get Rendezvous choisi
    var rendezvous = await RendezVous.findOne({
      where:{id_RV : params.idRendezVous}
    });

    //get plagehoraire
    var plagehoraire = await PlageHoraire.findOne({
    where:{id_plage_horaire : rendezvous.id_plage_horaire}
    });
    var heure_debut = plagehoraire.heure_debut.substr(0,5);
    var heure_fin = plagehoraire.heure_fin.substr(0,5);

    console.log(plagehoraire);

    //get psychologue
    var psy = await Psychologue.findOne({
      where:{id_psychologue : rendezvous.id_psychologue}
    });
    var nomPsychologue = psy.prenom + " " + psy.nom;

    res.render('../public/views/client/confirmationRDV',{
      layout:'clientOui',
      resultats:rendezvous,
      resultatPsy:nomPsychologue,
      heure_debut:heure_debut,
      heure_fin:heure_fin
    });
  }
  else{
    res.redirect('/errorAccess');
  }
});

//route POST d'acceptation du rendez-Vous
router.post('/calendrier/confirmation/:idRendezVous', async function(req,res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  var params = req.params;
  console.log(params);
  if(decoded.scope=='clientOui'){

    //get contact
    var contact = await Contact.findOne({
      where:{ID_Contact: decoded.id}
    });

    //get client of Contact
    var client = await Client.findOne({
      where:{id_client : contact.Client}
    });

    //get Rendezvous choisi
    var rendezvous = await RendezVous.findOne({
      where:{id_RV : params.idRendezVous}
    });

    rendezvous.id_client=client.id_client;
    rendezvous.disponibilite=false;
    rendezvous.save();

    res.redirect('/RendezVousConfirme');
  }
  else{
    res.redirect('/errorAccess');
  }
});

//route confirmation de confirmation de rendez-vous
router.get('/RendezVousConfirme', async function(req,res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  if(decoded.scope=='clientOui'){
    res.render('../public/views/client/confirmed',{
      layout:'clientOui',
      message:'Le rendez-vous est confirmé!',
      adresseURL:'/calendrier',
      MsgBouton:'Retour aux disponibilités'
    });
  }
  else{
    res.redirect('/errorAccess');
  }
});

//export this router to use in index.js
module.exports = router;
