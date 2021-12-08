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

//first route
Router.get('/',async function(req, res){
  //decode Cookie
  var decoded = authController.decodeCookie(req.cookies.jwt);
  console.log(decoded.scope);
  //check authentication
  if(decoded.scope=='clientOui'||decoded.scope=='clientNon'){res.redirect('/profil_client');}
  else if(decoded.scope=='psychologue'){res.redirect('/profil_psychologue');}
  else{res.redirect('/login');}
});

//login page
Router.get('/login',async function(req, res){
  //decode Cookie
  var decoded = authController.decodeCookie(req.cookies.jwt);
  console.log(decoded);
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
  console.log(decoded);
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

//GET non access page
Router.get('/errorAccess',async function(req, res){
    res.render('../public/views/main/accessRefused', {layout: 'main'})
});


//export this Router to use in index.js
module.exports = Router;
