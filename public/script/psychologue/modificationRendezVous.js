
function checkHeures(){
  var heureDebut = document.getElementById('m_hrDebut').value ;
  var heureFin = document.getElementById('m_hrFin').value ;
  //Parse heure fin for comparaison
  switch(heureFin.charAt(3)){
    case '0':
      heureFin=parseFloat(heureFin);
      break;
    case '1':
      heureFin=parseFloat(heureFin)+0.25;
      break;
    case '3':
      heureFin=parseFloat(heureFin)+0.5;
      break;
    case '4':
      heureFin=parseFloat(heureFin)+0.75;
      break;
  }
  //Parse heure debut for comparaison
  switch(heureDebut.charAt(3)){
    case '0':
      heureDebut=parseFloat(heureDebut);
      break;
    case '1':
      heureDebut=parseFloat(heureDebut)+0.25;
      break;
    case '3':
      heureDebut=parseFloat(heureDebut)+0.5;
      break;
    case '4':
      heureDebut=parseFloat(heureDebut)+0.75;
      break;
  }
  //check for lower or Equal
  if(heureFin<=heureDebut){
    var temp=document.getElementById('messageErreur');
    temp.style.visibility="visible";
    document.getElementById('m_hrDebut').setCustomValidity("Invalid field.");
    document.getElementById('m_hrFin').setCustomValidity("Invalid field.");
  }
  else{
    var temp=document.getElementById('messageErreur');
    temp.style.visibility="hidden";
    document.getElementById('m_hrDebut').setCustomValidity("");
    document.getElementById('m_hrFin').setCustomValidity("");
  }

}
