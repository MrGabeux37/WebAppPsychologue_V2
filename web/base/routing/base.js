var express = require('express');
var Router = express.Router();
const Crypto = require('crypto');
const Sequelize =require('sequelize');
const Op = Sequelize.Op;
const Client = require('../models/client.js');
const Psychologue = require('../models/psychologue.js');
const PlageHoraire = require('../models/plagehoraire.js');
const RendezVous = require('../models/rendezvous.js');
const authController = require('../controllers/authController.js');

//testing Route
Router.get('/test',async function(req, res){
  console.log('Cookies', req.cookies);
  res.redirect('/login');
  //res.render('../public/views/psychologue/reservations', {layout: 'psychologue'})
});

/* Emergency password change Route
//GET modification du mot de passe
Router.get('/changement_de_mot_de_passe_Test',async function(req, res){
    res.render('../public/views/main/PasswordChangeTest', {layout: 'main'})
});
//POST modification du mot de passe
Router.post('/changement_de_mot_de_passe_Test',authController.passUpdate_post_Test);
*/

//first route
Router.get('/',authController.login_get);

//login page
Router.get('/login',async function(req, res){
  //decode Cookie
  var decoded = authController.decodeCookie(req.cookies.jwt);
  //check authentication
  if(decoded.scope=='clientOui'||decoded.scope=='clientNon'){res.redirect('/profil_client');}
  else if(decoded.scope=='psychologue'){res.redirect('/profil_psychologue');}
  else{res.render('../public/views/main/login', {layout:'main'})}
});

//Post login
Router.post('/login', authController.login_post);

//register page
Router.get('/register',async function(req, res){
  //decode Cookie
  var decoded = authController.decodeCookie(req.cookies.jwt);
  //check authentication
  if(decoded.scope=='clientOui'||decoded.scope=='clientNon'){res.redirect('/profil_client');}
  else if(decoded.scope=='psychologue'){res.redirect('/profil_psychologue');}
  else{res.render('../public/views/main/register', {layout: 'main'})}
});

//POST register
Router.post('/register',authController.register_post);

//route de deconnection
Router.get('/logout', async function(req, res){
  //clear Cookies
  res.clearCookie('jwt');
  res.redirect('/');
});

//GET modification du mot de passe
Router.get('/changement_de_mot_de_passe',async function(req, res){
    res.render('../public/views/main/PasswordChange', {layout: 'main'})
});

//POST modification du mot de passe
Router.post('/changement_de_mot_de_passe',authController.passUpdate_post);

//page intermediaire pour mot de passe
Router.get('/goodPassword', async function(req, res){
  res.render('../public/views/main/passwordChanged', {
    layout: 'main',
    message: "Votre mot de passe a été changé avec succès!"
  })
});

//get page redirection
Router.get('/profil_updated',async function(req,res){
  res.render('../public/views/main/passwordChanged', {
    layout: 'main',
    message: "Votre profil a été enregistré avec succès!"
  })
});

//get page redirection apres modification du profil client
Router.get('/profil_client_updated/:id_client', async function(req, res){
  var params = req.params;
  console.log(params);
  res.render('../public/views/main/profil_client_updated', {
    layout: 'main',
    message: "Le profil du client a été enregistré avec succès!",
    idclient:params.id_client
  })
})

//tri vers la bonne page profil
Router.get('/retour_du_mot_de_passe', authController.login_get);

//GET non access page
Router.get('/errorAccess',async function(req, res){
    res.render('../public/views/main/404', {
      layout: 'main',
      message: "Vous n'avez pas accès à cette page"
    })
});

//get page redirection apres creation de nouvelle dispo
Router.get('/psychologue/reservations/nouvelleDispo/confirmation/:date_rv/:plageHoraire', async function(req, res){
  var params = req.params;
  console.log(params);

  //get PlageHoraire en parametre
  var plageHoraire = await PlageHoraire.findOne({
    where:{id_plage_horaire:params.plageHoraire}
  });

  res.render('../public/views/psychologue/dispoCreated', {
    layout: 'main',
    LienRetour:"/psychologue/reservations/",
    MessageButton:'du Calendrier',
    message: "La nouvelle disponibilité est créée pour le " + params.date_rv + " entre " + plageHoraire.heure_debut + " et " + plageHoraire.heure_fin +"."
  })
})

//get page redirection apres creation d'un nouveau rendezvous
Router.get('/psychologue/reservations/nouvelleDispo/confirmation/:date_rv/:plageHoraire/:id_client', async function(req, res){
  var params = req.params;
  console.log(params);
  //find client to add info on page
  var client = await Client.findOne({
    where:{id_client:params.id_client}
  });

  //get PlageHoraire en parametre
  var plageHoraire = await PlageHoraire.findOne({
    where:{id_plage_horaire:params.plageHoraire}
  });

  res.render('../public/views/psychologue/dispoCreated', {
    layout: 'main',
    LienRetour:"/psychologue/reservations/",
    MessageButton:'du Calendrier',
    message: "Le rendez-vous est créé pour le client " + client.id_client + ": " + client.prenom + " " + client.nom + " le " + params.date_rv + " entre " + plageHoraire.heure_debut + " et " + plageHoraire.heure_fin +"."
  })
})

//get page redirection apres modification de dispo (sans client)
Router.get('/psychologue/reservations/listeReservations/modifier/confirmation/:date_rv/:plageHoraire', async function(req, res){
  var params = req.params;
  console.log(params);

  //get PlageHoraire en parametre
  var plageHoraire = await PlageHoraire.findOne({
    where:{id_plage_horaire:params.plageHoraire}
  });

  res.render('../public/views/psychologue/dispoCreated', {
    layout: 'main',
    LienRetour:"/psychologue/reservations/listeReservations",
    MessageButton:'des Réservations',
    message: "Le rendez-vous a été modifié. <br>Voici la nouvelle information: <br>Client: Auncun Client <br>Date: " + params.date_rv + " <br>Heure Début: " + plageHoraire.heure_debut + " <br>Heure Fin: " + plageHoraire.heure_fin +"."
  })
})

//get page redirection apres modification d'un rendezvous
Router.get('/psychologue/reservations/listeReservations/modifier/confirmation/:date_rv/:plageHoraire/:id_client', async function(req, res){
  var params = req.params;
  console.log(params);
  //find client to add info on page
  var client = await Client.findOne({
    where:{id_client:params.id_client}
  });

  //get PlageHoraire en parametre
  var plageHoraire = await PlageHoraire.findOne({
    where:{id_plage_horaire:params.plageHoraire}
  });

  res.render('../public/views/psychologue/dispoCreated', {
    layout: 'main',
    LienRetour:"/psychologue/reservations/listeReservations",
    MessageButton:'des Réservations',
    message: "Le rendez-vous a été modifié. <br>Voici la nouvelle information: <br><br>Client: " + client.id_client + " | " + client.prenom + " " + client.nom + " <br>Date: " + params.date_rv + " <br>Heure Début: " + plageHoraire.heure_debut + " <br>Heure Fin: " + plageHoraire.heure_fin +"."
  })
})




//export this Router to use in index.js
module.exports = Router;
