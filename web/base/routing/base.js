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
Router.get('/test', function(req, res){
  res.render('../public/views/psychologue/reservations', {layout: 'psychologue'})
})
//first route
Router.get('/', function(req, res){
  res.redirect('/login');
})

//Post login
Router.post('/', function(req, res){

})

//login page
Router.get('/login', function(req, res){
  res.render('../public/views/main/login', {layout:'main'})
});

//register page
Router.get('/register', function(req, res){
  res.render('../public/views/main/register', {layout: 'main'})
})

//basic POST route
Router.post('/', function(req, res){
  res.send('POST default route');
});

//export this Router to use in index.js
module.exports = Router;
