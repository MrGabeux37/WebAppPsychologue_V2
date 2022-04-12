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
      boutton: 'Modifier les info du compte',
      reserve:'a'
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

    if(contacts.length>1){
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

      //save both contacts
      contacts[0].save();
      contacts[1].save();
    }

    else{
      //update contact info
      contacts[0].Nom=payload.nom_contact;
      contacts[0].Prenom=payload.prenom_contact;
      contacts[0].Num_Tel=payload.telephone_contact;
      contacts[0].Email=payload.courriel_contact;
      contacts[0].Email_Extra1=payload.courriel_extra1;
      contacts[0].Email_Extra2=payload.courriel_extra2;
      contacts[0].Email_Extra3=payload.courriel_extra3;
      //save the contact
      contacts[0].save();
    }

    //save the client
    client.save();

    var destination="/profil_client_updated/"+client.id_client;
    res.redirect(destination);
  }
  else{
    res.redirect('/errorAccess');
  }
})

//affiche les réservation du client
router.get('/clients/profil/:id_client/reservation', async function(req,res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  if(decoded.scope=='psychologue'){
    //get le parametre dans le URL
    var params = req.params;
    console.log('params: '+ params);
    //get payload
    var payload = req.body;
    console.log('payload: '+ payload);
    //trouve le client choisi
    var client = await Client.findOne({
      where:{id_client:params.id_client}
    });
    //trouve les contacts associes au clients
    var contacts = await Contact.findAll({
      where:{Client:params.id_client}
    });

    //get all the reservations
    var rendezVous = await RendezVous.findAll({
      order:[['date','ASC']],
      where:{id_client : params.id_client}
    });

    if(rendezVous.length>0){
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
    }
    else{
      var nomPsychologue='';
      var plageHoraire='';
    }

    res.render('../public/views/psychologue/reservation', {
      layout:'psychologue',
      client:client,
      resultats:rendezVous,
      resultatPsy:nomPsychologue,
      resultathoraire:plageHoraire
    });
  }
  else{
    res.redirect('/errorAccess');
  }
})

//affiche les réservation du client
router.get('/clients/profil/:id_client/reservation/ancienne', async function(req,res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  var today = new Date();
  if(decoded.scope=='psychologue'){
    //get le parametre dans le URL
    var params = req.params;
    console.log('params: '+ params);
    //get payload
    var payload = req.body;
    console.log('payload: '+ payload);
    //trouve le client choisi
    var client = await Client.findOne({
      where:{id_client:params.id_client}
    });
    //trouve les contacts associes au clients
    var contacts = await Contact.findAll({
      where:{Client:params.id_client}
    });

    //get all the reservations
    var rendezVous = await RendezVous.findAll({
      where:{
              [Op.and]:[
                {id_client:params.id_client},
                {date:{[Op.lte]:today}}
              ]
      },
      order:[['date','ASC']]
    });

    if(rendezVous.length>0){
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
    }
    else{
      var nomPsychologue='';
      var plageHoraire='';
    }

    res.render('../public/views/psychologue/reservation', {
      layout:'psychologue',
      client:client,
      resultats:rendezVous,
      resultatPsy:nomPsychologue,
      resultathoraire:plageHoraire
    });
  }
  else{
    res.redirect('/errorAccess');
  }
})

//affiche les réservation du client
router.get('/clients/profil/:id_client/reservation/future', async function(req,res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  var today = new Date();
  if(decoded.scope=='psychologue'){
    //get le parametre dans le URL
    var params = req.params;
    console.log('params: '+ params);
    //get payload
    var payload = req.body;
    console.log('payload: '+ payload);
    //trouve le client choisi
    var client = await Client.findOne({
      where:{id_client:params.id_client}
    });
    //trouve les contacts associes au clients
    var contacts = await Contact.findAll({
      where:{Client:params.id_client}
    });

    //get all the reservations
    var rendezVous = await RendezVous.findAll({
      where:{
              [Op.and]:[
                {id_client:params.id_client},
                {date:{[Op.gte]:today}}
              ]
      },
      order:[['date','ASC']]
    });

    if(rendezVous.length>0){
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
    }
    else{
      var nomPsychologue='';
      var plageHoraire='';
    }

    res.render('../public/views/psychologue/reservationFuture', {
      layout:'psychologue',
      client:client,
      resultats:rendezVous,
      resultatPsy:nomPsychologue,
      resultathoraire:plageHoraire
    });
  }
  else{
    res.redirect('/errorAccess');
  }
})

//route confirmation d'annulation du rendezvous
router.get('/clients/profil/:id_client/reservation/annulation/:id_RV', async function(req,res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  var params = req.params;
  console.log(params);
  if(decoded.scope=='psychologue'){
    //trouve le client choisi
    var client = await Client.findOne({
      where:{id_client:params.id_client}
    });

    //get Rendezvous choisi
    var rendezvous = await RendezVous.findOne({
      where:{id_RV : params.id_RV}
    });

    console.log(rendezvous);

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
    var adresseURL="/clients/profil/"+client.id_client+"/reservation/annulation/";
    var retourURL="/clients/profil/"+client.id_client+"/reservation/future";

    res.render('../public/views/psychologue/confirmationRDV',{
      layout:'psychologue',
      client:client,
      resultats:rendezvous,
      resultatPsy:nomPsychologue,
      heure_debut:heure_debut,
      heure_fin:heure_fin,
      adresseURL:adresseURL,
      retourURL:retourURL,
      message:'Confirmer la réservation a annuler'
    });
  }
  else{
    res.redirect('/errorAccess');
  }
});

//route POST d'annulation du rendez-Vous
router.post('/clients/profil/:id_client/reservation/annulation/:idRendezVous', async function(req,res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  var params = req.params;
  console.log(params);

  if(decoded.scope=='psychologue'){
    //get Rendezvous choisi
    var rendezvous = await RendezVous.findOne({
      where:{id_RV : params.idRendezVous}
    });

    rendezvous.id_client=null;
    rendezvous.disponibilite=true;
    rendezvous.save();

    var retourURL='/clients/profil/'+params.id_client+'/reservation/annulation/RendezVousAnnule/'+params.idRendezVous;

    res.redirect(retourURL);
  }
  else{
    res.redirect('/errorAccess');
  }
});

//route confirmation d'annulation de rendez-vous
router.get('/clients/profil/:id_client/reservation/annulation/RendezVousAnnule/:idRendezVous', async function(req,res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  var params = req.params;
  console.log(params);

  var retourURL='/clients/profil/'+params.id_client+'/reservation/future';

  if(decoded.scope=='psychologue'){
    res.render('../public/views/client/confirmed',{
      layout:'psychologue',
      message:'Le rendez-vous est annulé!',
      adresseURL:retourURL,
      MsgBouton:'Retour aux réservations'
    });
  }
  else{
    res.redirect('/errorAccess');
  }
});

//Route qui montre le calendrier avec les reservations
router.get('/psychologue/reservations/', async function(req,res){
  var decoded = authController.decodeCookie(req.cookies.jwt);

  //get client with or without query info
  var clients = await Client.findAll({
    where:{permission:true}
  });

  //générer les heures
  var heureFins=[];
  var heureDebuts=[];
  var heureFin=6;
  var minuteFin=0;
  var heureDebut=6;
  var minuteDebut=0;

  heureFins.push("06:00");
  heureDebuts.push("06:00");

  for(var i=0;i<56;i++){
    var temp1="";
    var temp2="";
    minuteDebut=minuteDebut+15;
    minuteFin=minuteFin+15;
    if(minuteDebut==60){
      heureDebut=heureDebut+1;
      heureFin=heureFin+1;
      minuteDebut=0;
      minuteFin=0;

      if(heureDebut<10){
        temp1="0"+heureDebut+":0"+minuteDebut;
        temp2="0"+heureFin+":0"+minuteFin;
      }
      else{
        temp1=heureDebut+":0"+minuteDebut;
        temp2=heureFin+":0"+minuteFin;
      }
    }
    else{
      if(heureDebut<10){
        if(minuteDebut==0){
          temp1="0"+heureDebut+":0"+minuteDebut;
          temp2="0"+heureFin+":0"+minuteFin;
        }
        else{
          temp1="0"+heureDebut+":"+minuteDebut;
          temp2="0"+heureFin+":"+minuteFin;
        }
      }
      else{
        if(minuteDebut==0){
          temp1=heureDebut+":0"+minuteDebut;
          temp2=heureFin+":0"+minuteFin;
        }
        else{
        temp1=heureDebut+":"+minuteDebut;
        temp2=heureFin+":"+minuteFin;
        }
      }
    }
    heureFins.push(temp2);
    heureDebuts.push(temp1);
  }


  if(decoded.scope=='psychologue'){
    res.render('../public/views/psychologue/calendar',{
      layout:'psychologue',
      Clients:clients,
      HeureFins:heureFins,
      HeureDebuts:heureDebuts
    });
  }
  else{
    res.redirect('/errorAccess');
  }
});
//export this router to use in index.js

router.post('/psychologue/reservations/nouvelleDispo', async function(req,res){
    var decoded = authController.decodeCookie(req.cookies.jwt);

    var payload = req.body;
    console.log(payload);

    if(decoded.scope=='psychologue'){
      res.redirect('/psychologue/reservations/nouvelleDispo/confirmation');
    }
    else{
      res.redirect('/errorAccess');
    }
});

module.exports = router;
