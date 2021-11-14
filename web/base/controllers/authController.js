const Client = require('../models/client.js');
const Psychologue = require('../models/psychologue.js');
const Crypto = require('crypto');
const jwt = require('jsonwebtoken');
const maxAge = 3 * 24 * 60 * 60;

//hash password method
const getHashedPassword = (password) => {
  const sha256 = Crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
}

//handleErrors


//create jwt
const createToken = (item) => {
  return jwt.sign({ id:item.id, scope:item.scope }, 'Le Prince des Petits', {
    expiresIn: maxAge
  });
}

module.exports.register_post = async (req, res) => {
  try{
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
  }catch (err){
    //check to create a error handler function for different errors
    //const errors = handleErrors(err);
    console.log("erreur est:"+err);
  }
};

module.exports.login_post = async (req, res) => {
  try{
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
          const item = {id:user.id_psychologue, scope:'psychologue'};
          const token=createToken(item);
          res.cookie('jwt',token, { httpOnly: true, maxAge: maxAge * 1000});
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
        const scope = (user.permission) ? 'clientOui' : 'clientNon';
        const item = {id:user.id_client, scope:scope};
        const token=createToken(item);
        res.cookie('jwt',token, { httpOnly: true, maxAge: maxAge * 1000});
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
  }catch(err){
    //check to create a error handler function for different errors
    //const errors = handleErrors(err);
    console.log(err);
  }
}
