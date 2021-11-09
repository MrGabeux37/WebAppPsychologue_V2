var express = require('express');
var Router = express.Router();
const Crypto = require('crypto');
const Sequelize =require('sequelize');
const Op = Sequelize.Op;
const Client = require('../models/client.js');
const Psychologue = require('../models/psychologue.js');
const PlageHoraire = require('../models/plagehoraire.js');
const RendezVous = require('../models/rendezvous.js');

//hash password method
const getHashedPassword = (password) => {
  const sha256 = Crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
}

//testing Route
Router.get('/test',async function(req, res){
  console.log('Cookies', req.cookies);
  res.redirect('/login');
  //res.render('../public/views/psychologue/reservations', {layout: 'psychologue'})
});

//first route
Router.get('/',async function(req, res){
  console.log(req.cookies);
  //check authentication
  if(req.cookies.scope==('clientOui'||'clientNon')){res.redirect('/profil_client');}
  else if(req.cookies.scope=='psychologue'){res.redirect('/profil_psychologue');}
  else{res.redirect('/login');}
});

//login page
Router.get('/login',async function(req, res){
  //check authentication
  if(req.cookies.scope==('clientOui'||'clientNon')){res.redirect('/profil_client');}
  else if(req.cookies.scope=='psychologue'){res.redirect('/profil_psychologue');}
  else{res.render('../public/views/main/login', {layout:'main'})}
});

//Post login
Router.post('/login', async function(req, res){
  var inputCourriel = req.body.inputCourriel;
  var inputPassword = getHashedPassword(req.body.inputPassword);
  console.log(inputPassword)

  //cherche un utilisateur dans la table client avec le courriel entré
  var user=await Client.findOne({
    where:{courriel: inputCourriel}
  });

  //verifie s'il la requete précédente donne un résultat null
  if(!user){
    //cherche un utilisateur dans la table psychologue avec le courriel entré
    user=await Psychologue.findOne({
      where:{courriel:inputCourriel}
    })
    //verifie s'il la requete précédente donne un résultat null
    if(!user){
      res.render('../public/views/main/login', {
        layout:'main',
        message: 'Compte introuvable',
        messageClass: 'alert-danger'
      });
    }
    //si compte psy est vrai
    else{
      //si mot de passe est correct
      if(inputPassword==user.mot_de_passe){
        res.cookie('userID',user.id_psychologue);
        res.cookie('scope','psychologue');
        res.redirect('/profil_psychologue');

      }
      //si mot de passe est pas bon pour psy
      else{
        res.render('../public/views/main/login', {
          layout:'main',
          message: 'Mauvais mot de passe',
          messageClass: 'alert-danger'
        });
      }
    }
  }
  //si compte client est vrai
  else{
    //si mot de passe est correct pour client
    if(inputPassword==user.mot_de_passe){
      var scope = (user.permission) ? 'clientOui' : 'clientNon';
      res.cookie('userID',user.id_client);
      res.cookie('scope',scope);
      //change to redirect
      res.redirect('/profil_client');
    }
    //mot de passe pas bon
    else{
      res.render('../public/views/main/login', {
        layout:'main',
        message: 'Mauvais mot de passe',
        messageClass: 'alert-danger'
      });
    }
  }
});

//register page
Router.get('/register',async function(req, res){
  //check authentication
  if(req.cookies.scope==('clientOui'||'clientNon')){res.redirect('/profil_client');}
  else if(req.cookies.scope=='psychologue'){res.redirect('/profil_psychologue');}
  else{res.render('../public/views/main/register', {layout: 'main'})}
});

//POST register
Router.post('/register',async function(req, res){
  //initialisation des variables
  var payload = req.body;
  var parent1, parent2, enfant;
  var password_parent1=null;
  var password_parent2=null;
  var password_enfant=null;
  var courriel_enfant=null;
  //encryption du mot de passe
  var password = getHashedPassword(payload.mot_de_passe[1]);
  if(payload.courriel_utilise1)password_parent1=password;
  if(payload.courriel_utilise2)password_parent2=password;
  if(payload.courriel_utilise3)password_enfant=password;
  if(payload.courrielcheckenfant!=true){
    courriel_enfant=payload.courriel_enfant;
    password_enfant=password;
  }
  //creation de l'objet enfant
  enfant = await Client.build({
    nom:payload.nom_enfant,
    prenom:payload.prenom_enfant,
    date_de_naissance:payload.date_de_naissance_enfant,
    sexe:payload.sexe_enfant,
    courriel:courriel_enfant,
    num_telephone:payload.num_telephone_parent1,
    permission:false,
    mot_de_passe:password_enfant,
    id_parent1:null,
    id_parent2:null
  });
  enfant.save();

  //creation de l'objet parent1
  parent1 = await Client.build({
    nom:payload.nom_parent1,
    prenom:payload.prenom_parent1,
    date_de_naissance:payload.date_de_naissance_parent1,
    sexe:payload.sexe_parent1,
    courriel:payload.courriel_parent1,
    num_telephone:payload.num_telephone_parent1,
    permission:false,
    mot_de_passe:password_parent1
  })
  //sauvegarde dans la bd et ajout de id_parent1 à l'enfant
  parent1.save().then(function(id1){
    enfant.update({
      id_parent1:id1.id_client
    });
  });

  if(!payload.famillecheck){
    //creation de l'objet parent2
    parent2 = await Client.build({
      nom:payload.nom_parent2,
      prenom:payload.prenom_parent2,
      date_de_naissance:payload.date_de_naissance_parent2,
      sexe:payload.sexe_parent2,
      courriel:payload.courriel_parent2,
      num_telephone:payload.num_telephone_parent2,
      permission:false,
      mot_de_passe:password_parent2
    });
    //sauvegarde dans la bd et ajout de id_parent2 à l'enfant
    parent2.save().then(function(id2){
      enfant.update({
        id_parent2:id2.id_client
      });
    });
  }
  res.redirect('/');
});

//route de deconnection
Router.get('/logout', async function(req, res){
  //clear Cookies
  res.clearCookie('userID');
  res.clearCookie('scope');

  res.redirect('/');
});


//export this Router to use in index.js
module.exports = Router;
