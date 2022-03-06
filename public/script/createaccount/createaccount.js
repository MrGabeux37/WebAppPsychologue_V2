//selection 1 seul contact
function onSelectMono(checkbox){
  if(checkbox.checked == true){
    document.getElementById("nom_contact2").disabled=true;
    document.getElementById("prenom_contact2").disabled=true;
    document.getElementById("courriel_contact2").disabled=true;
    document.getElementById("num_telephone_contact2").disabled=true;
    document.getElementById("email2").disabled=true;
  }
  else{
    document.getElementById("nom_contact2").disabled=false;
    document.getElementById("prenom_contact2").disabled=false;
    document.getElementById("courriel_contact2").disabled=false;
    document.getElementById("num_telephone_contact2").disabled=false;
    document.getElementById("email2").disabled=false;
  }
}
var count1=0;
var count2=0;
//ajout champ courriel
function ajoutChampContact1(num){
  if(count1<3){
    const input = document.createElement("input");
    const button1 = document.getElementById("email"+num);
    const div = document.getElementById("divEmail"+num);
    var temp=count1+1;
    input.setAttribute("class","form-control mt-1");
    input.setAttribute("type","email");
    input.setAttribute("name","Contact1_courriel_extra"+temp);
    input.setAttribute("placeholder","Entrer l'adresse courriel du contact");
    input.setAttribute("pattern","[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$");
    div.insertBefore(input,button1);
    count1++;
  }
  else if(count1==3){
    const p = document.createElement("p");
    const button1 = document.getElementById("email"+num);
    const div = document.getElementById("divEmail"+num);
    p.setAttribute("class","mt-1");
    p.innerHTML="Vous pouvez seulement ajouter 3 adresses courriel"
    div.insertBefore(p,button1);
    count1++;
  }
  else{}
}

function ajoutChampContact2(num){
    if(count2<3){
      const input = document.createElement("input");
      const button2 = document.getElementById("email"+num);
      const div = document.getElementById("divEmail"+num);
      var temp=count2+1;
      input.setAttribute("class","form-control mt-1");
      input.setAttribute("type","email");
      input.setAttribute("name","Contact2_courriel_extra"+temp);
      input.setAttribute("placeholder","Entrer l'adresse courriel du contact");
      input.setAttribute("pattern","[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$");
      div.insertBefore(input,button2);
      count2++;
    }
    else if(count2==3){
      const p = document.createElement("p");
      p.setAttribute("class","mt-1");
      const button2 = document.getElementById("email"+num);
      const div = document.getElementById("divEmail"+num);
      p.innerHTML="Vous pouvez seulement ajouter 3 adresses courriel"
      div.insertBefore(p,button2);
      count2++;
    }
    else{}
}

//check mot de Mot de passe
function CheckPW(){
  //assigne les passwords
  var firstPW = document.getElementById("password1").value ;
  var confirmPW = document.getElementById("password2").value ;

  if(firstPW!=confirmPW){
    document.getElementById("alertPW").innerHTML="Mots de passe non identiques ";
    document.getElementById("bouton").disabled=true;
  }
  else{
    document.getElementById("alertPW").innerHTML="";
    document.getElementById("bouton").disabled=false;
  }
}
