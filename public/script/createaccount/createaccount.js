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
function ajoutChampContact(num){

  if(count1<3){
    const input = document.createElement("input");
    const button1 = document.getElementById("email"+num);
    const div = document.getElementById("divEmail"+num);
    input.setAttribute("class","form-control mt-1");
    input.setAttribute("type","email");
    input.setAttribute("name","courriel_extra"+count1);
    input.setAttribute("placeholder","Entrer l'adresse courriel du contact");
    div.insertBefore(input,button1);
    count1++;
  }
  else if(count1==3){
    const p = document.createElement("p");
    const button1 = document.getElementById("email"+num);
    const div = document.getElementById("divEmail"+num);
    p.setAttribute("class","mt-1");
    p.innerHTML="Vous pouvez seulement ajouter 3 adresse courriels"
    div.insertBefore(p,button1);
    count1++;
  }
  else if(count2<3){
    const input = document.createElement("input");
    const button2 = document.getElementById("email"+num);
    const div = document.getElementById("divEmail"+num);
    input.setAttribute("class","form-control mt-1");
    input.setAttribute("type","email");
    input.setAttribute("name","courriel_extra"+count2);
    input.setAttribute("placeholder","Entrer l'adresse courriel du contact");
    div.insertBefore(input,button2);
    count2++;
  }
  else if(count2==3){
    const p = document.createElement("p");
    p.setAttribute("class","mt-1");
    const button2 = document.getElementById("email"+num);
    const div = document.getElementById("divEmail"+num);
    p.innerHTML="Vous pouvez seulement ajouter 3 adresse courriels"
    div.insertBefore(p,button2);
    count2++;
  }
  else{}
}

function ajoutChampContact(num){
  if(num==1){
    if(count1<3){
      const input = document.createElement("input");
      const button1 = document.getElementById("email"+num);
      const div = document.getElementById("divEmail"+num);
      input.setAttribute("class","form-control mt-1");
      input.setAttribute("type","email");
      input.setAttribute("name","courriel_extra"+count1);
      input.setAttribute("placeholder","Entrer l'adresse courriel du contact");
      div.insertBefore(input,button1);
      count1++;
    }
    else if(count1==3){
      const p = document.createElement("p");
      const button1 = document.getElementById("email"+num);
      const div = document.getElementById("divEmail"+num);
      p.setAttribute("class","mt-1");
      p.innerHTML="Vous pouvez seulement ajouter 3 adresse courriels"
      div.insertBefore(p,button1);
      count1++;
    }
  }
  if(num==2){
    if(count2<3){
      const input = document.createElement("input");
      const button2 = document.getElementById("email"+num);
      const div = document.getElementById("divEmail"+num);
      input.setAttribute("class","form-control mt-1");
      input.setAttribute("type","email");
      input.setAttribute("name","courriel_extra"+count2);
      input.setAttribute("placeholder","Entrer l'adresse courriel du contact");
      div.insertBefore(input,button2);
      count2++;
    }
    else if(count2==3){
      const p = document.createElement("p");
      p.setAttribute("class","mt-1");
      const button2 = document.getElementById("email"+num);
      const div = document.getElementById("divEmail"+num);
      p.innerHTML="Vous pouvez seulement ajouter 3 adresse courriels"
      div.insertBefore(p,button2);
      count2++;
    }
  }
}
