const Client = require('../models/client.js');
const Contact = require('../models/contact.js');
const Psychologue = require('../models/psychologue.js');
const Crypto = require('crypto');
const jwt = require('jsonwebtoken');
const maxAge = 3 * 24 * 60 * 60; //3 days

//hash password method
const getHashedPassword = (password) => {
  const sha256 = Crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
}

//decode Cookie function
function decodeCookie(token){
  try{
    return jwt.verify(token, 'Le Prince des Petits');
  }catch(error){
    return 0;
  }
};
exports.decodeCookie = decodeCookie;

//handleErrors (wiil need to add something here)


//create jwt
const createToken = (item) => {
  return jwt.sign({ id:item.id, scope:item.scope, enfant:item.enfant}, 'Le Prince des Petits', {
    expiresIn: maxAge
  });
}

module.exports.login_get = async (req, res) => {
  try{
    var decoded = decodeCookie(req.cookies.jwt);
    console.log(decoded.scope);
    //check authentication
    if(decoded.scope=='clientOui'||decoded.scope=='clientNon'){res.redirect('/profil_client');}
    else if(decoded.scope=='psychologue'){res.redirect('/profil_psychologue');}
    else{res.redirect('/login');}
  }
  catch(error){
    console.log('Erreur est: '+error);
  }
}

module.exports.register_post = async (req, res) => {
  try{
    //initialisation des variables
    var temp_password= "Canada123!";
    var payload = req.body;
    var contact1, contact2, client;
    var password_contact1=null;
    var password_contact2=null;
    var courriel_client=null;
    console.log(payload)
    //encryption du mot de passe
    var password = getHashedPassword(temp_password);
    password_contact1=password;
    password_contact2=password;

    //creation de l'objet client
    client0 = await Client.create({
      nom:payload.nom_client,
      prenom:payload.prenom_client,
      permission:false,
    });

    //creation de l'objet contact1
    contact1 = await Contact.create({
      Nom:payload.nom_contact1,
      Prenom:payload.prenom_contact1,
      Num_Tel:payload.num_telephone_contact1,
      Email:payload.courriel_contact1,
      Mot_Passe:password_contact1,
      Email_Extra1:(payload.Contact1_courriel_extra1===null ? null : payload.Contact1_courriel_extra1),
      Email_Extra2:(payload.Contact1_courriel_extra2===null ? null : payload.Contact1_courriel_extra2),
      Email_Extra3:(payload.Contact1_courriel_extra3===null ? null : payload.Contact1_courriel_extra3),
      Client:client0.id_client
    })

    if(!payload.famillecheck){
      //creation de l'objet contact2
      contact2 = await Contact.create({
        Nom:payload.nom_contact2,
        Prenom:payload.prenom_contact2,
        Num_Tel:payload.num_telephone_contact2,
        Email:payload.courriel_contact2,
        Mot_Passe:password_contact2,
        Email_Extra1:(payload.Contact2_courriel_extra1===null ? null : payload.Contact2_courriel_extra1),
        Email_Extra2:(payload.Contact2_courriel_extra2===null ? null : payload.Contact2_courriel_extra2),
        Email_Extra3:(payload.Contact2_courriel_extra3===null ? null : payload.Contact2_courriel_extra3),
        Client:client0.id_client
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
    var user = await Contact.findOne({
      where:{Email: inputCourriel}
    });

    //verifie s'il la requete précédente donne un résultat null
    if(!user){
      //cherche un utilisateur dans la table psychologue avec le courriel entré
      user = await Psychologue.findOne({
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
          const item = {id:user.id_psychologue, scope:'psychologue', enfant:-1};
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
      //Get enfant (ou ado) du contact
      var client = await Client.findOne({
        where:{id_client : user.Client}
      });
      //si mot de passe est correct pour client
      if(inputPassword==user.Mot_Passe){
        const scope = (client.permission) ? 'clientOui' : 'clientNon';
        const item = {id:user.ID_Contact, scope:scope, enfant:client.id_client,};
        const token = createToken(item);
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

module.exports.passUpdate_post = async (req, res) => {
  try{
    //get payload
    var payload = req.body;
    var password = getHashedPassword(payload.password1);
    //decode jwt cookie
    var decoded = decodeCookie(req.cookies.jwt);
    //finds user with id in the cookie
    var user = await Contact.findOne({
      where:{ID_Contact:decoded.id}
    });
    //if contact is null
    if(!user){

      //finds psychologue with ID in JWT cookie
      user = await Psychologue.findOne({
        where:{id_psychologue:decoded.id}
      });
      //if psychologue is null
      if(!user){
        //maybe check for different route for a different message (Oops error happened)
        res.redirect('/errorAccess');
      }
      //if psychologue is true
      else{
        user.mot_de_passe=password;
        user.save();
        res.redirect('/goodPassword');
      }
    }
    //if contact is true
    else{
      user.Mot_Passe=password;
      user.save();
      res.redirect('/goodPassword');
    }
  }catch(error){
    console.log("erreur est: "+error);
  }
}
