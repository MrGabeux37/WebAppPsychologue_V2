function CheckPW(){
  //assigne les passwords
  var firstPW = document.getElementById("firstPW").value ;
  var confirmPW = document.getElementById("confirmPW").value ;

  if(firstPW!=confirmPW){
    document.getElementById("alertPW").innerHTML="Mots de passe non identiques ";
  }
  else{
    document.getElementById("alertPW").innerHTML="";
  }
}

//selection 1 seul contact
function onSelectMono(checkbox){
  if(checkbox.checked == true){
    document.getElementById("nom_contact2").disabled=true;
    document.getElementById("prenom_contact2").disabled=true;
    document.getElementById("btnradio2").disabled=true;
    document.getElementById("btnradio3").disabled=true;
    document.getElementById("courriel_contact2").disabled=true;
    document.getElementById("num_telephone_contact2").disabled=true;
    document.getElementById("btnemail2").disabled=true;
  }
  else{
    document.getElementById("nom_contact2").disabled=false;
    document.getElementById("prenom_contact2").disabled=false;
    document.getElementById("date_de_naissance_contact2").disabled=false;
    document.getElementById("btnradio2").disabled=false;
    document.getElementById("btnradio3").disabled=false;
    document.getElementById("courriel_contact2").disabled=false;
    document.getElementById("num_telephone_contact2").disabled=false;
    document.getElementById("btnemail2").disabled=false;
  }
}
