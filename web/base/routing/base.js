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
  res.render('../public/views/psychologue/reservations', {layout: 'psychologue'})
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
  var scope="";
  var inputCourriel = req.body.inputCourriel;
  var inputPassword = req.body.inputPassword;

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
    else{
      res.render('../public/views/main/login', {
        layout:'main',
        message: 'Compte psychologue',
        messageClass: 'alert-success'
      });
    }
  }
  else{
    res.render('../public/views/main/login', {
      layout:'main',
      message: 'Compte client',
      messageClass: 'alert-success'
    });
  }
})

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
