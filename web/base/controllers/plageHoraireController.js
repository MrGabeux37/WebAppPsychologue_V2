function heuresDeDebut(){
  //générer les heures
  var heureDebuts=[];
  var heureDebut=6;
  var minuteDebut=0;

  heureDebuts.push("06:00");

  for(var i=0;i<56;i++){
    var temp1="";
    minuteDebut=minuteDebut+15;
    if(minuteDebut==60){
      heureDebut=heureDebut+1;
      minuteDebut=0;

      if(heureDebut<10){
        temp1="0"+heureDebut+":0"+minuteDebut;
      }
      else{
        temp1=heureDebut+":0"+minuteDebut;
      }
    }
    else{
      if(heureDebut<10){
        if(minuteDebut==0){
          temp1="0"+heureDebut+":0"+minuteDebut;
        }
        else{
          temp1="0"+heureDebut+":"+minuteDebut;
        }
      }
      else{
        if(minuteDebut==0){
          temp1=heureDebut+":0"+minuteDebut;
        }
        else{
        temp1=heureDebut+":"+minuteDebut;
        }
      }
    }
    heureDebuts.push(temp1);
  }
  return heureDebuts
}

function heuresDeFin(){
  //générer les heures
  var heureFins=[];
  var heureFin=6;
  var minuteFin=0;

  heureFins.push("06:00");

  for(var i=0;i<56;i++){
    var temp1="";
    var temp2="";
    minuteFin=minuteFin+15;
    if(minuteFin==60){
      heureFin=heureFin+1;
      minuteFin=0;

      if(heureFin<10){
        temp2="0"+heureFin+":0"+minuteFin;
      }
      else{
        temp2=heureFin+":0"+minuteFin;
      }
    }
    else{
      if(heureFin<10){
        if(minuteFin==0){
          temp2="0"+heureFin+":0"+minuteFin;
        }
        else{
          temp2="0"+heureFin+":"+minuteFin;
        }
      }
      else{
        if(minuteFin==0){
          temp2=heureFin+":0"+minuteFin;
        }
        else{
        temp2=heureFin+":"+minuteFin;
        }
      }
    }
    heureFins.push(temp2);
  }
  return heureFins
};

exports.heuresDeFin = heuresDeFin;
exports.heuresDeDebut = heuresDeDebut;
