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
})
//first route
Router.get('/',async function(req, res){
  res.redirect('/login');
})

//login page
Router.get('/login',async function(req, res){
  res.render('../public/views/main/login', {layout:'main'})
});

//Post login
Router.post('/login', async function(req, res){
  console.log(req.body.inputCourriel);
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
  res.render('../public/views/main/register', {layout: 'main'})
})

//basic POST route
Router.post('/',async function(req, res){
  res.send('POST default route');
});

//export this Router to use in index.js
module.exports = Router;
