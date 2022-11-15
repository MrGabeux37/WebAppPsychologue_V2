//Route qui montre les futures reservations sous forme de liste
router.get('/psychologue/reservations/listeReservations/future', async function(req,res){
  var decoded = authController.decodeCookie(req.cookies.jwt);
  var today = new Date();
  if(decoded.scope=='psychologue'){

    //get all the reservations
    var rendezVous = await RendezVous.findAll({
      order:[['date','ASC']],
      where:{date:{[Op.gte]:today}}
    });
    //get all the clients for Modal
    var clients = await Client.findAll({
      where:{permission:true}
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
      //get all the correct clients
      var client=[];
      for(var y=0;y<rendezVous.length;y++){
        if(rendezVous[y].id_client==null){
          client.push({prenom:null,nom:null});
        }
        else{
          var tempClient = await Client.findOne({
            where:{id_client:rendezVous[y].id_client}
          });
          var temp = {prenom:tempClient.prenom, nom:tempClient.nom, id_client:tempClient.id_client};
          client.push(temp);
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

    res.render('../public/views/psychologue/ListeReservations', {
      layout:'psychologue',
      client:client,
      Clients:clients,
      resultats:rendezVous,
      resultatPsy:nomPsychologue,
      resultathoraire:plageHoraire,
      HeureFins:plageHoraireController.heuresDeFin(),
      HeureDebuts:plageHoraireController.heuresDeDebut(),
      Future:true
    });
  }
  else{
    res.redirect('/errorAccess');
  }
});
