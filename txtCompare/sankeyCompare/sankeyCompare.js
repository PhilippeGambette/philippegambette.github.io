/*
    sankeyCompare, a script of txtCompare to compare the order of texts
    inside two books
    Copyright (C) 2020, Philippe Gambette

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
    
$(document).ready(function(){   

    var couleurTitresIdentiques = "#CCCCCC99";
    var couleurTitresDifferents = "#99999999";
    
    $(document).on("click",".lien",function(){
       // Changement de couleur du lien au clic
       if($(this).attr("fill")==couleurTitresDifferents){
           $(this).attr("fill",couleurTitresIdentiques);
       } else {
           $(this).attr("fill",couleurTitresDifferents);
       }
       $(".svg").html($(".svg").html());
    })

function loadSankeyCompare(){

    // Choix du corpus 
    var corpusNumber = $("#choix").val();
    $("#titreCourt").html(data[corpusNumber].titreCourt);
    $("#titreLong").html(data[corpusNumber].titreLong);
    $("#sourceData").attr("href",data[corpusNumber].sourceData);
    var texts = data[corpusNumber].texts;
    var ecart = data[corpusNumber].ecart;
    var liensVersDroite = {};
    var liensVersGauche = {};
    var numPartieExtrait = {};
    var nbPagesExtrait = {};
    
    // Initialisation
    var xLeft = 380;
    var xRight = 620;
    var i = 1;
    var hauteurParDefaut = 16;
    var pixelsParPage = data[corpusNumber].pixelsParPage;
    $("#label").css("font-size",hauteurParDefaut+"px");
    var hauteurRecueils = [];
    var ordonneeTextes = {};
    var hauteurTextes = {};
    var titreTextes = {}
    var recueils = [];
    var couleurs = ["#DDDDDD","#CC5555","#55CC55","#5555CC","#CC55CC","#55CCCC","#CCCC55","#5599EE","#EE5599"];
    var numPartie = 0;
    var partie = "";
    var y = hauteurParDefaut+10;
    
    // Ajout des paramètres de style dans l'image SVG
    $(".svg").html('  <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="300" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"><style>.titre { font: italic '+(hauteurParDefaut+2)+'px Calibri; fill: grey;}</style>	<title>sankeyCompare</title><g font-family="Calibri"></g></svg>')
    
    // Parcours des données
    while(i < texts.length){
       if(recueils.length == 0){
          // Début de l'ajout du premier texte
          recueils.push(texts[i][1]);
          // Ajout du titre du premier texte
          $("#label").css("font-size",(hauteurParDefaut+2)+"px");
          $("#label").html(recueils[0]);
          $(".svg g").append('<text class="titre" x="'+(xLeft-parseInt($("#label").css("width"))-20)+'" y="'+(y)+'" font-size="'+(hauteurParDefaut+2)+'">'+recueils[0]+'</text>');
          $("#label").css("font-size",hauteurParDefaut+"px");
          y += 5;

       } else {
          if(texts[i][1] != recueils[recueils.length-1]){
             // Début de l'ajout du deuxième texte
             recueils.push(texts[i][1]);
             y = hauteurParDefaut+10;
             // Ajout du titre du deuxième texte
             $("#label").css("font-size",(hauteurParDefaut+2)+"px");
             $("#label").html(recueils[1]);
             $(".svg g").append('<text class="titre" x="'+(xRight+20)+'" y="'+(y)+'" fill="grey" font-size="'+(hauteurParDefaut+2)+'">'+recueils[1]+'</text>');
             $("#label").css("font-size",hauteurParDefaut+"px");
             partie = "";
             numPartie = 0;
             y += 5;
          }
       }
       
       // Calcul de la hauteur du prochain texte ajouté :
       var hauteurTexte = parseInt(texts[i][4])*pixelsParPage;
       y = y+hauteurTexte+ecart;
       
       // Mise à jour du numéro de partie du texte
       if(texts[i][2] != partie){
          partie = texts[i][2];
          numPartie = texts[i][2][0];
       } 
       hauteurRecueils[recueils.length-1] = y;
       ordonneeTextes["i"+texts[i][0]] = y;
       hauteurTextes["i"+texts[i][0]] = hauteurTexte;
       titreTextes["i"+texts[i][0]] = texts[i][3];
       numPartieExtrait[texts[i][0]] = texts[i][2][0];
       nbPagesExtrait[texts[i][0]] = texts[i][4];
       var url = texts[i][6];
       
       if(texts[i][1] == recueils[0]){
          // Affichage du titre de l'extrait sur la gauche
          $("#label").html(texts[i][3]+"…");
          $(".svg g").append('		<path id="r_'+texts[i][0]+'" fill="'+couleurs[numPartie]+'" d="M'+(xLeft-10)+' '+y+' H '+(xLeft)+' V '+(y-hauteurTexte)+' H '+(xLeft-10)+' L '+(xLeft-10)+' '+y+'">');          
          // Ajout d'un lien vers l'extrait
          $(".svg g").append('    <a xlink:show="new" xlink:href="'+url+'" xlink:title="Accéder au texte…"><text id="t_'+texts[i][0]+'" x="'+(xLeft-parseInt($("#label").css("width"))-20)+'" y="'+(y)+'" fill="'+couleurs[numPartie]+'" font-size="'+hauteurParDefaut+'">'+texts[i][3]+'</text></a>');
       } else {
          // Affichage du titre de l'extrait sur la droite
          $(".svg g").append('		<path id="r_'+texts[i][0]+'" fill="'+couleurs[numPartie]+'" d="M'+(xRight+10)+' '+y+' H '+(xRight)+' V '+(y-hauteurTexte)+' H '+(xRight+10)+' L '+(xRight+10)+' '+y+'">');
          // Ajout d'un lien vers l'extrait
          $(".svg g").append('    <a xlink:show="new" xlink:href="'+url+'" xlink:title="Accéder au texte…"><text id="t_'+texts[i][0]+'" x="'+(xRight+20)+'" y="'+(y)+'" fill="'+couleurs[numPartie]+'" font-size="'+hauteurParDefaut+'">'+texts[i][3]+'</text></a>');       

          if(texts[i][5]!="" && titreTextes["i"+texts[i][5]]!=undefined){
             // Ajout du lien entre l'extrait de droite et un extrait de gauche
             var y2 = ordonneeTextes["i"+texts[i][5]];
             var h2 = hauteurTextes["i"+texts[i][5]];
             liensVersGauche[texts[i][0]]=texts[i][5];
             liensVersDroite[texts[i][5]]=texts[i][0];
             var couleurLien = couleurTitresIdentiques;
             //console.log("i"+texts[i][5])
             //console.log(titreTextes["i"+texts[i][5]])
             //console.log(titreTextes)
             console.log(texts[i])
             if (texts[i][3].toLowerCase() != titreTextes["i"+texts[i][5]].toLowerCase() ){
                // Lien plus foncé entre des titres différents
                couleurLien = couleurTitresDifferents;
             }
             $(".svg g").append('		<a xlink:title="'+nbPagesExtrait[texts[i][5]]+' pages &rarr; '+texts[i][4]+' pages"><path class="lien" fill="'+couleurLien+'" d="M'+(xLeft)+','+y2+' C'+((xRight+xLeft)/2)+','+y2+' '+((xRight+xLeft)/2)+','+y+' '+(xRight)+','+y+' V '+(y-hauteurTexte)+' C'+((xRight+xLeft)/2)+','+(y-hauteurTexte)+' '+((xRight+xLeft)/2)+','+(y2-h2)+' '+(xLeft)+','+(y2-h2)+'"/></a>')
          }
       }
       i ++;
    }
    
    // Mise à jour de la hauteur de l'image SVG
    var hauteurMax = hauteurRecueils[0];    
    if(hauteurMax < hauteurRecueils[1]){
       hauteurMax = hauteurRecueils[1];
    }
    $("svg").attr("height",hauteurMax + hauteurParDefaut*3+2)
    
    // Affectation des couleurs du livre de droite à celui de gauche pour l'Heptaméron
    if(corpusNumber == 0){
       extraitsGauche = Object.keys(liensVersDroite);
       extraitsGauche.forEach(function(e){
          $("#t_"+e).attr("fill",$("#t_"+liensVersDroite[e]).attr("fill")).append("&rarr;"+numPartieExtrait[liensVersDroite[e]]).attr("x",parseInt($("#t_"+e).attr("x"))-10);
          $("#r_"+e).attr("fill",$("#r_"+liensVersDroite[e]).attr("fill"));
       });
    };
    
    // Mise à jour de l'image SVG
    $(".svg").html($(".svg").html());
    
}

    var data = [
   { 
   titreLong : 'nouvelles de <i>L’Heptaméron</i> de Marguerite de Navarre, dans les éditions <a href="https://gallica.bnf.fr/ark:/12148/bpt6k1519008r">par Pierre Boaistuau en 1558</a> et <a href="https://gallica.bnf.fr/ark:/12148/btv1b86171930">par Pierre Gruget en 1559</a>',
   titreCourt : 'nouvelles de <i>L’Heptaméron</i>',
   option: 'éditions de 1558 et 1559 de l’<i>Heptaméron</i> de Marguerite de Navarre',
   ecart : 11,
   pixelsParPage : 3,
   sourceData : "https://docs.google.com/spreadsheets/d/11dMJLEs1Bo_C0Wfsgrz3a_Yw6H0Ow-4pRI2dxGiAXbM/edit?usp=sharing",
   texts : [
["identifiant","recueil","partie","texte","nb-pages","lien","url"],
["Boaistuau-01","Boaistuau (1558)","1","De l’incontinence d’une Duchesse de Bourgongne…","19","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f45"],
["Boaistuau-02","Boaistuau (1558)","1","D’une dame d’Alemaigne…","4","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f64"],
["Boaistuau-03","Boaistuau (1558)","1","D’un Roy de Naples…","6","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f68"],
["Boaistuau-04","Boaistuau (1558)","1","D’une princesse de Flandres…","6","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f74"],
["Boaistuau-05","Boaistuau (1558)","1","D’une bastelliere…","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f80"],
["Boaistuau-06","Boaistuau (1558)","1","Du seigneur de Bonnivet…","7","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f83"],
["Boaistuau-07","Boaistuau (1558)","1","D’un gentilhomme…","12","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f90"],
["Boaistuau-08","Boaistuau (1558)","1","D’une veuve Millannoise…","4","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f102"],
["Boaistuau-09","Boaistuau (1558)","1","De la façon dont usa le Roy François…","4","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f106"],
["Boaistuau-10","Boaistuau (1558)","1","De l’amour d’une dame et d’un escollier…","5","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f110"],
["Boaistuau-11","Boaistuau (1558)","1","De l’amour d’une damoiselle nommée Pauline…","10","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f115"],
["Boaistuau-12","Boaistuau (1558)","1","D’un gentilhomme François…","4","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f125"],
["Boaistuau-13","Boaistuau (1558)","1","De l’honneste amitié d’une dame…","17","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f129"],
["Boaistuau-14","Boaistuau (1558)","1","De l’hypocrisie d’un prieur…","10","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f146"],
["Boaistuau-15","Boaistuau (1558)","1","Du grand scandalle qui survint à la maison…","7","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f156"],
["Boaistuau-16","Boaistuau (1558)","1","De l’artifice dont usa un gentilhomme…","8","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f163"],
["Boaistuau-17","Boaistuau (1558)","1","De la piteuse mort d’un gentilhomme…","6","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f171"],
["Boaistuau-18","Boaistuau (1558)","1","Des amours de Florinde, & d’Amadour…","29","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f177"],
["Boaistuau-19","Boaistuau (1558)","1","Histoire dixneuvfiesme","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f206"],
["Boaistuau-20","Boaistuau (1558)","1","De l’habomination d’un prestre incestueux…","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f208"],
["Boaistuau-21","Boaistuau (1558)","1","De deux freres mineurs…","4","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f211"],
["Boaistuau-22","Boaistuau (1558)","1","De la loüable industrie d’un sage mary…","6","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f215"],
["Boaistuau-23","Boaistuau (1558)","1","D’un president de Grenoble…","4","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f221"],
["Boaistuau-24","Boaistuau (1558)","1","De l’extreme charité d’une bourgeoise de Tours…","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f225"],
["Boaistuau-25","Boaistuau (1558)","1","D’un grand seigneur de France…","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f227"],
["Boaistuau-26","Boaistuau (1558)","1","Malice extreme d’un predicateur…","4","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f229"],
["Boaistuau-27","Boaistuau (1558)","1","De la merveilleuse continence d’une damoiselle…","9","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f233"],
["Boaistuau-28","Boaistuau (1558)","1","De la ruse d’une dame courtisanne…","5","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f242"],
["Boaistuau-29","Boaistuau (1558)","1","Du tapissier qui donna les innocens…","4","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f247"],
["Boaistuau-30","Boaistuau (1558)","1","D’une Contesse estrangere…","5","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f251"],
["Boaistuau-31","Boaistuau (1558)","1","Finesse d’une Espagnolle…","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f256"],
["Boaistuau-32","Boaistuau (1558)","1","D’un cordelier d’Italie…","5","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f259"],
["Boaistuau-33","Boaistuau (1558)","1","D’un mylhort d’Angleterre…","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f264"],
["Boaistuau-34","Boaistuau (1558)","1","D’une femme d’Autun…","6","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f267"],
["Boaistuau-35","Boaistuau (1558)","1","De l’amour d’un Curé et d’une femme de village…","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f273"],
["Boaistuau-36","Boaistuau (1558)","1","De la grande simplicité d’une bonne vieille…","1","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f275"],
["Boaistuau-37","Boaistuau (1558)","1","De la femme d’un procureur nommé sainct Aignan…","7","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f276"],
["Boaistuau-38","Boaistuau (1558)","1","De la femme d’un muletier…","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f283"],
["Boaistuau-39","Boaistuau (1558)","1","Artifice merveilleux qu’une femme inventa…","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f286"],
["Boaistuau-40","Boaistuau (1558)","1","D’un marchant de Paris…","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f288"],
["Boaistuau-41","Boaistuau (1558)","1","D’un quidam…","6","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f290"],
["Boaistuau-42","Boaistuau (1558)","1","De l’incontinence d’un Duc…","7","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f296"],
["Boaistuau-43","Boaistuau (1558)","1","D’une dame qui ayant receu un anneau…","13","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f303"],
["Boaistuau-44","Boaistuau (1558)","1","De la temerité d’un sot secretaire…","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f316"],
["Boaistuau-45","Boaistuau (1558)","1","Encore d’un secretaire…","4","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f318"],
["Boaistuau-46","Boaistuau (1558)","1","De la cruauté d’un cordelier flamment…","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f322"],
["Boaistuau-47","Boaistuau (1558)","1","De la prudence d’une femme…","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f325"],
["Boaistuau-48","Boaistuau (1558)","1","D’un Conte qui tua un gentilhomme…","7","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f328"],
["Boaistuau-49","Boaistuau (1558)","1","De la merveilleuse amitié de deux gentilzhommes…","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f335"],
["Boaistuau-50","Boaistuau (1558)","1","De deux cordeliers de perigort…","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f338"],
["Boaistuau-51","Boaistuau (1558)","1","D’un aymant…","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f341"],
["Boaistuau-52","Boaistuau (1558)","1","De la subtilité d’une dame…","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f343"],
["Boaistuau-53","Boaistuau (1558)","1","De l’amour d’un chantre…","4","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f346"],
["Boaistuau-54","Boaistuau (1558)","1","D’une damoiselle…","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f350"],
["Boaistuau-55","Boaistuau (1558)","1","De certain gentilhomme de Valence…","5","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f352"],
["Boaistuau-56","Boaistuau (1558)","1","Merveilleuse austerité de la vie d’un homme…","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f357"],
["Boaistuau-57","Boaistuau (1558)","1","De la femme d’un apoticaire…","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f360"],
["Boaistuau-58","Boaistuau (1558)","1","De la prudence d’une femme à surprendre son mary…","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f363"],
["Boaistuau-59","Boaistuau (1558)","1","D’une femme presque morte…","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f365"],
["Boaistuau-60","Boaistuau (1558)","1","Comme une damoiselle donna assignation…","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f367"],
["Boaistuau-61","Boaistuau (1558)","1","Comme une damoiselle trompa son mary…","5","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f370"],
["Boaistuau-62","Boaistuau (1558)","1","De la cruauté d’un Italien…","6","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f375"],
["Boaistuau-63","Boaistuau (1558)","1","Comme un serviteur d’apoticaire…","1","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f381"],
["Boaistuau-64","Boaistuau (1558)","1","De l’astuce d’un prince…","6","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f382"],
["Boaistuau-65","Boaistuau (1558)","1","Du subtil moyen dont usoit un grand seigneur…","4","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f388"],
["Boaistuau-66","Boaistuau (1558)","1","Plaisant discours d’un autre grand seigneur…","13","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f392"],
["Boaistuau-67","Boaistuau (1558)","1","D’une femme que son filz engrossa…","6","","https://gallica.bnf.fr/ark:/12148/bpt6k1519008r/f405"],
["Gruget01","Gruget (1559)","1re journée","Une femme d’Alençon…","7","Boaistuau-37","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f31"],
["Gruget02","Gruget (1559)","1re journée","Piteuse & chaste mort de la femme…","3","Boaistuau-38","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f38"],
["Gruget03","Gruget (1559)","1re journée","Un roy de Naples…","6","Boaistuau-03","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f41"],
["Gruget04","Gruget (1559)","1re journée","Temeraire entreprinse d’un gentil-homme…","6","Boaistuau-04","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f47"],
["Gruget05","Gruget (1559)","1re journée","Une basteliere s’eschappa de deux cordeliers…","4","Boaistuau-05","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f53"],
["Gruget06","Gruget (1559)","1re journée","Subtilité d’une femme…","2","Boaistuau-39","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f57"],
["Gruget07","Gruget (1559)","1re journée","Un marchant de Paris trompe la mere de s’amie…","2","Boaistuau-40","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f59"],
["Gruget08","Gruget (1559)","1re journée","Un quidam…","6","Boaistuau-41","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f61"],
["Gruget09","Gruget (1559)","1re journée","Piteuse mort d’un gentil-homme amoureux…","5","Boaistuau-17","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f67"],
["Gruget10","Gruget (1559)","1re journée","Amours d’Amadour & Florinde…","30","Boaistuau-18","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f72"],
["Gruget11","Gruget (1559)","2e journée","Propos facetieux d’un cordelier…","3","","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f103"],
["Gruget12","Gruget (1559)","2e journée","L’incontinence d’un Duc…","7","Boaistuau-42","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f106"],
["Gruget13","Gruget (1559)","2e journée","Un capitaine de galeres…","13","Boaistuau-43","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f113"],
["Gruget14","Gruget (1559)","2e journée","Subtilité d’un amoureux…","6","Boaistuau-06","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f126"],
["Gruget15","Gruget (1559)","2e journée","Une dame de la court du Roy…","12","Boaistuau-07","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f132"],
["Gruget16","Gruget (1559)","2e journée","Une dame Millannoise…","5","Boaistuau-08","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f144"],
["Gruget17","Gruget (1559)","2e journée","Le Roy François monstra sa generosité…","4","Boaistuau-09","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f149"],
["Gruget18","Gruget (1559)","2e journée","Une belle jeune dame experimente la foy d’un jeune…","5","Boaistuau-10","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f153"],
["Gruget19","Gruget (1559)","2e journée","De deux amans…","11","Boaistuau-11","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f158"],
["Gruget20","Gruget (1559)","2e journée","Un gentil-homme est inopinément guary du mal…","6","Boaistuau-12","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f169"],
["Gruget21","Gruget (1559)","3e journée","L’Honneste & merveilleuse amitié d’une fille…","15","Boaistuau-13","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f176"],
["Gruget22","Gruget (1559)","3e journée","Un prieur reformateur…","10","Boaistuau-14","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f191"],
["Gruget23","Gruget (1559)","3e journée","Trois meurtres advenuz en une maison…","7","Boaistuau-15","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f201"],
["Gruget24","Gruget (1559)","3e journée","Gentile invention d’un gentil-homme…","9","Boaistuau-16","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f208"],
["Gruget25","Gruget (1559)","3e journée","Subtil moyen, dont usoit un grand prince…","5","Boaistuau-65","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f217"],
["Gruget26","Gruget (1559)","3e journée","Plaisant discours d’un grand seigneur…","13","Boaistuau-66","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f222"],
["Gruget27","Gruget (1559)","3e journée","Temerité d’un sot secrettaire…","2","Boaistuau-44","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f235"],
["Gruget28","Gruget (1559)","3e journée","Un secrettaire pensait affiner quelqu’un qui l’affina…","2","Boaistuau-45","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f237"],
["Gruget29","Gruget (1559)","3e journée","Un bon Jannin de village…","3","Boaistuau-35","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f239"],
["Gruget30","Gruget (1559)","3e journée","Merveilleuse exemple de la fragilité humaine…","6","Boaistuau-67","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f242"],
["Gruget31","Gruget (1559)","4e journée","Exécrable cruauté d’un cordelier…","5","Boaistuau-46","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f249"],
["Gruget32","Gruget (1559)","4e journée","Punition plus rigoureuse que la mort…","5","Boaistuau-02","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f254"],
["Gruget33","Gruget (1559)","4e journée","Abomination d’un prestre incestueux…","3","Boaistuau-20","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f259"],
["Gruget34","Gruget (1559)","4e journée","Deux cordeliers trop curieux d’escouter…","4","Boaistuau-21","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f262"],
["Gruget35","Gruget (1559)","4e journée","Industrie d’un sage mary…","6","Boaistuau-22","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f266"],
["Gruget36","Gruget (1559)","4e journée","Un président de Grenoble…","5","Boaistuau-23","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f272"],
["Gruget37","Gruget (1559)","4e journée","Prudence d’une femme…","3","Boaistuau-47","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f277"],
["Gruget38","Gruget (1559)","4e journée","Memorable charité d’une femme de Tours…","3","Boaistuau-24","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f280"],
["Gruget39","Gruget (1559)","4e journée","Bonne invention pour chasser le Lutin…","2","Boaistuau-25","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f283"],
["Gruget40","Gruget (1559)","4e journée","Un seigneur fait mourir son beau-frere…","7","Boaistuau-48","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f285"],
["Gruget41","Gruget (1559)","5e journée","Estrange & nouvelle penitence…","3","Boaistuau-26","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f293"],
["Gruget42","Gruget (1559)","5e journée","Continence d’une jeune fille…","10","Boaistuau-27","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f296"],
["Gruget43","Gruget (1559)","5e journée","L’hypocrisie d’une dame de court…","5","Boaistuau-28","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f306"],
["Gruget44","Gruget (1559)","5e journée","De deux amans, qui ont subtilement jouy…","7","","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f311"],
["Gruget45","Gruget (1559)","5e journée","Un mary baillant les innocens à sa chambriere…","4","Boaistuau-29","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f318"],
["Gruget46","Gruget (1559)","5e journée","D’un cordelier…","3","","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f322"],
["Gruget47","Gruget (1559)","5e journée","Un gentil-homme du Perche…","3","Boaistuau-49","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f325"],
["Gruget48","Gruget (1559)","5e journée","Deux cordeliers une premiere nuict de nopces…","3","Boaistuau-50","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f328"],
["Gruget49","Gruget (1559)","5e journée","Subtilité d’une Comtesse…","5","Boaistuau-30","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f331"],
["Gruget50","Gruget (1559)","5e journée","Un amoureux, apres la saignée…","6","Boaistuau-51","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f336"],
["Gruget51","Gruget (1559)","6e journée","Perfidie & cruauté d’un Duc italien…","2","Boaistuau-62","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f343"],
["Gruget52","Gruget (1559)","6e journée","Du sale desjeuner preparé par un varlet d’apoticaire…","3","Boaistuau-63","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f345"],
["Gruget53","Gruget (1559)","6e journée","Diligence personelle d’un prince…","6","Boaistuau-64","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f348"],
["Gruget54","Gruget (1559)","6e journée","D’une damoiselle de si bonne nature…","3","Boaistuau-52","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f354"],
["Gruget55","Gruget (1559)","6e journée","Finesse d’une Espaignole…","2","Boaistuau-31","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f357"],
["Gruget56","Gruget (1559)","6e journée","Un cordelier marie frauduleusement un autre…","5","Boaistuau-32","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f359"],
["Gruget57","Gruget (1559)","6e journée","Compte ridicule d’un Milhort d’Angleterre…","4","Boaistuau-33","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f364"],
["Gruget58","Gruget (1559)","6e journée","Une dame de court se venge plaisamment…","3","Boaistuau-60","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f368"],
["Gruget59","Gruget (1559)","6e journée","Un gentil-homme pensant acoler en secret…","5","Boaistuau-61","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f371"],
["Gruget60","Gruget (1559)","6e journée","Une Parisienne abandonne son mary…","5","Boaistuau-53","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f376"],
["Gruget61","Gruget (1559)","7e journée","Merveilleuse pertinacité d’amour effrontée…","6","Boaistuau-34","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f382"],
["Gruget62","Gruget (1559)","7e journée","Une damoiselle, faisant un compte de l’amour…","3","Boaistuau-54","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f388"],
["Gruget63","Gruget (1559)","7e journée","Notable chasteté d’un seigneur François…","3","","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f391"],
["Gruget64","Gruget (1559)","7e journée","Un gentil-homme desdaigné pour mary…","5","Boaistuau-55","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f394"],
["Gruget65","Gruget (1559)","7e journée","Simplicité d’une vieille…","2","Boaistuau-36","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f399"],
["Gruget66","Gruget (1559)","7e journée","Compte risible advenu au Roy & Royne de Navarre…","2","","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f401"],
["Gruget67","Gruget (1559)","7e journée","Extreme amour & austerité de femme…","3","Boaistuau-56","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f403"],
["Gruget68","Gruget (1559)","7e journée","Une femme faict manger des cantarides à son mary…","3","Boaistuau-57","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f406"],
["Gruget69","Gruget (1559)","7e journée","Un Italien se laisse affiner par sa chambriere…","2","Boaistuau-58","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f409"],
["Gruget70","Gruget (1559)","7e journée","L’incontinence furieuse d’une Duchesse…","20","Boaistuau-01","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f411"],
["Gruget71","Gruget (1559)","8e journée","Une femme estant aux aboiz de la mort…","2","Boaistuau-59","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f432"],
["Gruget72","Gruget (1559)","8e journée","Continuelle repentance d’une religieuse…","5","","https://gallica.bnf.fr/ark:/12148/btv1b86171930/f434"],
    ]
   },
   { 
   titreLong : '<i>Conversations d’Émilie</i> de Louise d’Épinay, dans les éditions <a href="https://books.google.fr/books?id=olZ9vgAACAAJ&hl=fr&pg=PR1#v=onepage&q&f=false">de 1774</a> et <a href="https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie">de 1781</a>',
   titreCourt : '<i>Conversations d’Émilie</i> de Louise d’Épinay',
   option: 'éditions de 1774 et 1781 des <i>Conversations d’Émilie</i> de Louise d’Épinay',
   ecart : 13,
   pixelsParPage : 0.5,
   sourceData : "https://docs.google.com/spreadsheets/d/1wqyxRS_6LTE5gAPa8qxydS2dHLSUxTUYJ43467Rn6pM/edit?usp=sharing",
   texts : [
["identifiant","recueil","partie","texte","nb-pages","lien","url"],
["1774-01","Les Conversations d'Émilie (1774)","2","Lettre de l’auteur à l’éditeur","4","","https://books.google.fr/books?id=olZ9vgAACAAJ&hl=fr&pg=PR3#v=onepage&q&f=false"],
["1774-02","Les Conversations d'Émilie (1774)","3","Première conversation","26","","https://books.google.fr/books?id=olZ9vgAACAAJ&hl=fr&pg=PA1#v=onepage&q&f=false"],
["1774-03","Les Conversations d'Émilie (1774)","3","Deuxième conversation","16","","https://books.google.fr/books?id=olZ9vgAACAAJ&hl=fr&pg=PA27#v=onepage&q&f=false"],
["1774-04","Les Conversations d'Émilie (1774)","3","Troisième conversation","24","","https://books.google.fr/books?id=olZ9vgAACAAJ&hl=fr&pg=PA43#v=onepage&q&f=false"],
["1774-05","Les Conversations d'Émilie (1774)","3","Quatrième conversation","30","","https://books.google.fr/books?id=olZ9vgAACAAJ&hl=fr&pg=PA67#v=onepage&q&f=false"],
["1774-06","Les Conversations d'Émilie (1774)","3","Cinquième conversation","42","","https://books.google.fr/books?id=olZ9vgAACAAJ&hl=fr&pg=PA97#v=onepage&q&f=false"],
["1774-07","Les Conversations d'Émilie (1774)","3","Sixième conversation","33","","https://books.google.fr/books?id=olZ9vgAACAAJ&hl=fr&pg=PA139#v=onepage&q&f=false"],
["1774-08","Les Conversations d'Émilie (1774)","3","Septième conversation","29","","https://books.google.fr/books?id=olZ9vgAACAAJ&hl=fr&pg=PA172#v=onepage&q&f=false"],
["1774-09","Les Conversations d'Émilie (1774)","3","Huitième conversation","41","","https://books.google.fr/books?id=olZ9vgAACAAJ&hl=fr&pg=PA201#v=onepage&q&f=false"],
["1774-10","Les Conversations d'Émilie (1774)","3","Neuvième conversation","50","","https://books.google.fr/books?id=olZ9vgAACAAJ&hl=fr&pg=PA242#v=onepage&q&f=false"],
["1774-11","Les Conversations d'Émilie (1774)","3","Dixième conversation","31","","https://books.google.fr/books?id=olZ9vgAACAAJ&hl=fr&pg=PA292#v=onepage&q&f=false"],
["1774-12","Les Conversations d'Émilie (1774)","3","Onzième conversation","86","","https://books.google.fr/books?id=olZ9vgAACAAJ&hl=fr&pg=PA323#v=onepage&q&f=false"],
["1774-13","Les Conversations d'Émilie (1774)","3","Douzième conversation","22","","https://books.google.fr/books?id=olZ9vgAACAAJ&hl=fr&pg=PA409#v=onepage&q&f=false"],
["1781-01","Les Conversations d'Émilie (1781)","1","Avertissement sur cette seconde édition","10","","https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie/Avertissement"],
["1781-02","Les Conversations d'Émilie (1781)","2","Lettre de l’auteur à l’éditeur","2","1774-01","https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie/Lettre_de_l%E2%80%99auteur_%C3%A0_l%E2%80%99%C3%A9diteur"],
["1781-03","Les Conversations d'Émilie (1781)","3","Première conversation","26","1774-02","https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie/01"],
["1781-04","Les Conversations d'Émilie (1781)","3","Deuxième conversation","15","1774-03","https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie/02"],
["1781-05","Les Conversations d'Émilie (1781)","3","Troisième conversation","23","1774-04","https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie/03"],
["1781-06","Les Conversations d'Émilie (1781)","3","Quatrième conversation","31","1774-05","https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie/04"],
["1781-07","Les Conversations d'Émilie (1781)","3","Cinquième conversation","34","","https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie/05"],
["1781-08","Les Conversations d'Émilie (1781)","3","Sixième conversation","47","1774-06","https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie/06"],
["1781-09","Les Conversations d'Émilie (1781)","3","Septième conversation","41","1774-07","https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie/07"],
["1781-10","Les Conversations d'Émilie (1781)","3","Huitième conversation","37","1774-08","https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie/08"],
["1781-11","Les Conversations d'Émilie (1781)","3","Neuvième conversation","49","1774-09","https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie/09"],
["1781-12","Les Conversations d'Émilie (1781)","3","Dixième conversation","64","1774-11","https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie/10"],
["1781-13","Les Conversations d'Émilie (1781)","3","Onzième conversation","33","1774-10","https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie/11"],
["1781-14","Les Conversations d'Émilie (1781)","3","Douzième conversation","73","","https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie/12"],
["1781-15","Les Conversations d'Émilie (1781)","3","Treizième conversation","48","1774-12","https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie/13"],
["1781-16","Les Conversations d'Émilie (1781)","3","Quatorzième conversation","109","","https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie/14"],
["1781-17","Les Conversations d'Émilie (1781)","3","Quinzième conversation","59","","https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie/15"],
["1781-18","Les Conversations d'Émilie (1781)","3","Seizième conversation","40","","https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie/16"],
["1781-19","Les Conversations d'Émilie (1781)","3","Dix-septième conversation","50","","https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie/17"],
["1781-20","Les Conversations d'Émilie (1781)","3","Dix-huitième conversation","45","","https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie/18"],
["1781-21","Les Conversations d'Émilie (1781)","3","Dix-neuvième conversation","68","","https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie/19"],
["1781-22","Les Conversations d'Émilie (1781)","3","Vingtième conversation","51","","https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie/20"],
["1781-23","Les Conversations d'Émilie (1781)","4","Privilège du roi","4","","https://fr.wikisource.org/wiki/Les_Conversations_d%E2%80%99%C3%89milie/21"],
    ]
    },
   { 
   titreLong : '<i>Fables</i> de Marie-Amable Petiteau, dans les éditions <a href="https://gallica.bnf.fr/ark:/12148/bpt6k1653982">de 1806</a> et <a href="https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables">de 1816</a>',
   titreCourt : '<i>Fables</i> de Marie-Amable Petiteau',
   option: 'éditions de 1806 et 1816 des <i>Fables</i> de Marie-Amable Petiteau',
   ecart : 10,
   pixelsParPage : 2,
   sourceData : "https://docs.google.com/spreadsheets/d/1bpPV2cxNWTGo_Qj0tNVXVfMzfMDGAzm50Srnvt3Kd-E/edit?usp=sharing",
   texts : [
["identifiant","recueil","partie","texte","nb-pages","lien","url"],
["1806-lenfantetlaruche","Fables (1806)","3","L'enfant et la ruche","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f4.item"],
["1806-lagneauetsamère","Fables (1806)","3","L'agneau et sa mère","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f6.item"],
["1806-lépagneuletlemâtin","Fables (1806)","3","L'épagneul et le mâtin","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f7.item"],
["1806-lepapillonetlachenille","Fables (1806)","3","Le papillon et la chenille","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f8.item"],
["1806-lesdeuxloups","Fables (1806)","3","Les deux loups","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f9.item"],
["1806-levillageoisetlafauvette","Fables (1806)","3","Le villageois et la fauvette","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f11.item"],
["1806-lanaissancedulionceau","Fables (1806)","3","La naissance du lionceau","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f12.item"],
["1806-mahometetlepauvrehomme","Fables (1806)","3","Mahomet et le pauvre homme","4","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f13.item"],
["1806-lavacheetleloup","Fables (1806)","3","La vache et le loup","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f16.item"],
["1806-lelionlachèvreetlerenard","Fables (1806)","3","Le lion, la chèvre et le renard","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f17.item"],
["1806-laconsultation","Fables (1806)","3","La consultation","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f19.item"],
["1806-lesdeuxvillageois","Fables (1806)","3","Les deux villageois","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f20.item"],
["1806-lhirondelleetlapie","Fables (1806)","3","L'hirondelle et la pie,","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f21.item"],
["1806-lessourisetlevieuxchien","Fables (1806)","3","Les souris et le vieux chien","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f22.item"],
["1806-lericheetlepauvre","Fables (1806)","3","Le riche et le pauvre","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f24.item"],
["1806-lhermiteetlefermier","Fables (1806)","3","L'hermite et le fermier","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f25.item"],
["1806-lapouleetlerenard","Fables (1806)","3","La poule et le renard","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f26.item"],
["1806-lafemmeconséquenteavecsonmari","Fables (1806)","3","La femme conséquente avec son mari","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f27.item"],
["1806-lavacheetlâne","Fables (1806)","3","La vache et l'âne","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f28.item"],
["1806-damisoulhommemalcorrigé","Fables (1806)","3","Damis, ou l'homme mal corrigé","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f29.item"],
["1806-lelislaroseetletilleul","Fables (1806)","3","Le lis, la rose et le tilleul","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f31.item"],
["1806-leserinetlavolière","Fables (1806)","3","Le serin et la volière","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f32.item"],
["1806-lesdeuxrêveursetlemédecin","Fables (1806)","3","Les deux rêveurs et le médecin","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f33.item"],
["1806-laigleetlepaon","Fables (1806)","3","L'aigle et le paon","1","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f35.item"],
["1806-lemerleetlhirondelle","Fables (1806)","3","Le merle et l'hirondelle","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f35.item"],
["1806-lhommeetlecheval","Fables (1806)","3","L homme et le cheval","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f36.item"],
["1806-lesdeuxcampagnards","Fables (1806)","3","Les deux campagnards","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f37.item"],
["1806-lepinsonetlapie","Fables (1806)","3","Le pinson et la pie","1","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f39.item"],
["1806-laleçon","Fables (1806)","3","La leçon","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f39.item"],
["1806-lesenfans","Fables (1806)","3","Les enfans","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f40.item"],
["1806-lesamisdisputeurs","Fables (1806)","3","Les amis disputeurs","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f42.item"],
["1806-lachattevoyageuse","Fables (1806)","3","La chatte voyageuse","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f43.item"],
["1806-levéritableami","Fables (1806)","3","Le véritable ami","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f45.item"],
["1806-laveuglelesourdetlevoyageur","Fables (1806)","3","L'aveugle, le sourd et le voyageur","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f46.item"],
["1806-laroseetlimmortelle","Fables (1806)","3","La rose et l'immortelle","1","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f47.item"],
["1806-lesansonnetetsacompagne","Fables (1806)","3","Le sansonnet et sa compagne","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f47.item"],
["1806-lavieillefauvette","Fables (1806)","3","La vieille Fauvette","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f49.item"],
["1806-lesdeuxvoisins","Fables (1806)","3","Les deux voisins","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f50.item"],
["1806-lesgrenouillesetlespoissons","Fables (1806)","3","Les grenouilles et les poissons","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f51.item"],
["1806-lemoineauetlepinson","Fables (1806)","3","Le moineau et le pinson","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f52.item"],
["1806-lesingeàlacourdulion","Fables (1806)","3","Le singe à la cour du lion","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f53.item"],
["1806-levieuxlionetlesanimaux","Fables (1806)","3","Le vieux lion et les animaux","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f55.item"],
["1806-lhommedupedesesdéfauts","Fables (1806)","3","L'homme dupe de ses défauts","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f56.item"],
["1806-levoyageurmalheureux","Fables (1806)","3","Le voyageur malheureux","4","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f58.item"],
["1806-lelionetlours","Fables (1806)","3","Le lion et l'ours","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f61.item"],
["1806-legeaietlepinson","Fables (1806)","3","Le geai et le pinson","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f62.item"],
["1806-labrebisetlagneau","Fables (1806)","3","La brebis et l'agneau","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f63.item"],
["1806-levieuxménage","Fables (1806)","3","Le vieux ménage","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f64.item"],
["1806-levieillard","Fables (1806)","3","Le vieillard","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f65.item"],
["1806-lamortdurenard","Fables (1806)","3","La mort du renard","1","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f66.item"],
["1806-lebourdonetlhirondelle","Fables (1806)","3","Le bourdon et l'hirondelle","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f66.item"],
["1806-jupiteretlesanimaux","Fables (1806)","3","Jupiter et les animaux","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f68.item"],
["1806-lelionetleloup","Fables (1806)","3","Le lion et le loup","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f70.item"],
["1806-lechatetlasouris","Fables (1806)","3","Le chat et la souris","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f71.item"],
["1806-lechevaletleloup","Fables (1806)","3","Le cheval et le loup","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f72.item"],
["1806-lesdeuxvoyageurs","Fables (1806)","3","Les deux voyageurs","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f73.item"],
["1806-lehibouetlhirondelle","Fables (1806)","3","Le hibou et l'hirondelle","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f75.item"],
["1806-lescorbeauxetlesvautours","Fables (1806)","3","Les corbeaux et les vautours.","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f76.item"],
["1806-loiseaudepassageetlespigeons","Fables (1806)","3","L'oiseau de passage et les pigeons","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f77.item"],
["1806-léléphantetlesinge","Fables (1806)","3","L'éléphant et le singe","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f78.item"],
["1806-leconseildesrenards","Fables (1806)","3","Le conseil des renards","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f79.item"],
["1806-labeilleetlelimaçon","Fables (1806)","3","L'abeille et le limaçon. .","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f81.item"],
["1806-jupiteretlhommemarié","Fables (1806)","3","Jupiter et l'homme marié.","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f82.item"],
["1806-lechevaletlâne","Fables (1806)","3","Le cheval et l'âne. . .","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f83.item"],
["1806-lejeunehommeetlevieillard","Fables (1806)","3","Le jeune homme et le vieillard","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f84.item"],
["1806-lagénisseetsamère","Fables (1806)","3","La génisse et sa mère. .","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f85.item"],
["1806-lelouplerenardletaureauetlecheval","Fables (1806)","3","Le loup, le renard, le taureau et le cheval","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f86.item"],
["1806-lebrochetetlagrenouille","Fables (1806)","3","Le brochet et la grenouille","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f88.item"],
["1806-lestroupeauxetleberger","Fables (1806)","3","Les troupeaux et le berger","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f89.item"],
["1806-latourterelleetlafauvette","Fables (1806)","3","La tourterelle et la fauvette","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f91.item"],
["1806-jupiterlaigleetleballon","Fables (1806)","3","Jupiter, l'aigle et le ballon","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f92.item"],
["1806-lechienetlechat","Fables (1806)","3","Le chien et le chat","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f93.item"],
["1806-lhermiteetlejeunehomme","Fables (1806)","3","L'hermite et le jeune homme","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f94.item"],
["1806-lesinconséquens","Fables (1806)","3","Les inconséquens","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f95.item"],
["1806-leserpentetlesfourmis","Fables (1806)","3","Le serpent et les fourmis","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f96.item"],
["1806-lempereurdumogoletsonprécepteur","Fables (1806)","3","L'empereur du Mogol et son précepteur","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f98.item"],
["1806-lepongooulhommedesboiseneurope","Fables (1806)","3","Le pongo ou l'homme des bois en Europe","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f99.item"],
["1806-lemaîtreetsonvalet","Fables (1806)","3","Le maître et son valet","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f101.item"],
["1806-lalouetteetsespetits","Fables (1806)","3","L'alouette et ses petits","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f102.item"],
["1806-levieillardetlejeunemilitaire","Fables (1806)","3","Le vieillard et le jeune militaire","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f103.item"],
["1806-laiglelamésangeetlespetitsoiseaux","Fables (1806)","3","L'aigle, la mésange et les petits oiseaux","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f105.item"],
["1806-lesdeuxpaysans","Fables (1806)","3","Les deux paysans","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f106.item"],
["1806-lerenardetledindon","Fables (1806)","3","Le renard et le dindon","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f107.item"],
["1806-ledangerdelexemple","Fables (1806)","3","Le danger de l'exemple","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f108.item"],
["1806-letigreetlechat","Fables (1806)","3","Le tigre et le chat","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f109.item"],
["1806-lepaonetlemerle","Fables (1806)","3","Le paon et le merle","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f111.item"],
["1806-lecorbeauetlatourterelle","Fables (1806)","3","Le corbeau et la tourterelle","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f112.item"],
["1806-lekhandebukarieetsonfils","Fables (1806)","3","Le kan de Bukarie et son fils","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f113.item"],
["1806-lerossignoletletourtereau","Fables (1806)","3","Le rossignol et le tourtereau","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f115.item"],
["1806-jupiteretlemalade","Fables (1806)","3","Jupiter et le malade","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f116.item"],
["1806-lacolombeetlesoisons","Fables (1806)","3","Les colombes et les oisons","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f117.item"],
["1806-laigleetsonfils","Fables (1806)","3","L'aigle et son fils","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f118.item"],
["1806-ledangerdelacuriosité","Fables (1806)","3","Les dangers de la curiosité","4","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f119.item"],
["1806-lerenardchassédelacourdulion","Fables (1806)","3","Le renard chassé de la cour du lion","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f122.item"],
["1806-lemoineauetlafourmi","Fables (1806)","3","Le moineau et la fourmi","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f123.item"],
["1806-lemisanthropeetsonami","Fables (1806)","3","Le misantrope et son ami","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f124.item"],
["1806-leloupetlerenard","Fables (1806)","3","Le loup et le renard","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f126.item"],
["1806-lesexagénaireetlejeunehomme","Fables (1806)","3","Le sexagénaire et le jeune homme","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f128.item"],
["1806-lefinancieretlemendiant","Fables (1806)","3","Le financier et le mendiant","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f129.item"],
["1806-lechienbarbetetsonpetit","Fables (1806)","3","Le chien barbet et son petit","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f130.item"],
["1806-lapieetlacolombe","Fables (1806)","3","La pie et la colombe","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f131.item"],
["1806-lagneauetleloup","Fables (1806)","3","L'agneau et le loup","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f132.item"],
["1806-lavieilleetsaservante","Fables (1806)","3","La vieille et sa servante","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f133.item"],
["1806-lemilanetlesmoineaux","Fables (1806)","3","Le milan et les moineaux","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f135.item"],
["1806-lhommevertueuxetlhommevicieux","Fables (1806)","3","L'homme vertueux et l'homme vicieux","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f136.item"],
["1806-laraignéelachauvesourisetlabeille","Fables (1806)","3","L'araignée, la chauve-souris et l'abeille","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f137.item"],
["1806-lachèvreetlâne","Fables (1806)","3","La chèvre et l'âne","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f139.item"],
["1806-lamèreetsajeunefille","Fables (1806)","3","La mère et sa jeune fille","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f140.item"],
["1806-loursetlesinge","Fables (1806)","3","L'ours et le singe","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f141.item"],
["1806-laigleetlechat","Fables (1806)","3","L'aigle et le chat","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f142.item"],
["1806-lechevallâneetlavache","Fables (1806)","3","Le cheval, l'âne et la vache.","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f143.item"],
["1806-laigleetlhirondelle","Fables (1806)","3","L'aigle et l'hirondelle","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f144.item"],
["1806-lerenardetlechien","Fables (1806)","3","Le renard et le chien","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f145.item"],
["1806-lestourtereauxetlepinson","Fables (1806)","3","Les tourtereaux et le pinson","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f146.item"],
["1806-lacolombeetleramier","Fables (1806)","3","La colombe et le ramier","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f147.item"],
["1806-lejugementduloup","Fables (1806)","3","Le jugement du loup","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f148.item"],
["1806-lépagneuletlegrillon","Fables (1806)","3","L'épagneul et le grillon","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f149.item"],
["1806-lesdeuxorgueilleuxetlevieillard","Fables (1806)","3","Les deux orgueilleux et le vieillard","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f151.item"],
["1806-lesdeuxtourtereaux","Fables (1806)","3","Les deux tourtereaux","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f152.item"],
["1806-lelaboureuretsesbœufs","Fables (1806)","3","Le laboureur et ses bœufs","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f153.item"],
["1806-lelionmourant","Fables (1806)","3","Le lion mourant","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f155.item"],
["1806-leratlechatetlaraignée","Fables (1806)","3","Le rat, le chat et l'araignée","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f156.item"],
["1806-lataupeetlelimaçon","Fables (1806)","3","La taupe et le limaçon","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f157.item"],
["1806-lavacheetlemulet","Fables (1806)","3","La vache et le mulet","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f158.item"],
["1806-leramieretlecorbeau","Fables (1806)","3","Le ramier et le corbeau","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f159.item"],
["1806-lesdeuxvieillards","Fables (1806)","3","Les deux vieillards","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f160.item"],
["1806-letyranetlavillageoise","Fables (1806)","3","Le tyran et la villageoise","3","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f161.item"],
["1806-lebaudetetlechiendemétairie","Fables (1806)","3","Le baudet et le chien de métairie","2","","https://gallica.bnf.fr/ark:/12148/bpt6k1653982/f163.item"],
["1816-1","Fables (1816)","3","Les deux fauvettes.","1","1806-1","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_001"],
["1816-lachattevoyageuse","Fables (1816)","3","La chatte voyageuse.","2","1806-lachattevoyageuse","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_002"],
["1816-2","Fables (1816)","3","Le maître de maison et son jardinier.","1","1806-2","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_003"],
["1816-lépagneuletlemâtin","Fables (1816)","3","L’épagneul et le mâtin.","1","1806-lépagneuletlemâtin","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_004"],
["1816-lepapillonetlachenille","Fables (1816)","3","Le papillon et la chenille.","1","1806-lepapillonetlachenille","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_005"],
["1816-laconsultation","Fables (1816)","3","La consultation.","1","1806-laconsultation","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_006"],
["1816-lhirondelleetlapie","Fables (1816)","3","L’hirondelle et la pie.","1","1806-lhirondelleetlapie","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_007"],
["1816-lessourisetlevieuxchien","Fables (1816)","3","Les souris et le vieux chien.","2","1806-lessourisetlevieuxchien","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_008"],
["1816-lhermiteetlefermier","Fables (1816)","3","L’hermite et le fermier.","1","1806-lhermiteetlefermier","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_009"],
["1816-lapouleetlerenard","Fables (1816)","3","La poule et le renard.","1","1806-lapouleetlerenard","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_010"],
["1816-lavacheetlâne","Fables (1816)","3","La vache et l’âne.","1","1806-lavacheetlâne","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_011"],
["1816-lelislaroseetletilleul","Fables (1816)","3","Le lis, la rose et le tilleul.","1","1806-lelislaroseetletilleul","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_012"],
["1816-lesdeuxrêveursetlemédecin","Fables (1816)","3","Les deux rêveurs et le médecin.","1","1806-lesdeuxrêveursetlemédecin","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_013"],
["1816-laleçon","Fables (1816)","3","La leçon.","1","1806-laleçon","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_014"],
["1816-lavieillefauvette","Fables (1816)","3","La vieille fauvette.","1","1806-lavieillefauvette","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_015"],
["1816-3","Fables (1816)","3","L’homme et la chenille.","1","1806-3","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_016"],
["1816-4","Fables (1816)","3","Le pigeon et la fauvette.","1","1806-4","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_017"],
["1816-5","Fables (1816)","3","Le lion et l’étourdi.","1","1806-5","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_018"],
["1816-6","Fables (1816)","3","Les différens souhaits.","1","1806-6","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_019"],
["1816-7","Fables (1816)","3","L’anon et la brebis.","1","1806-7","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_020"],
["1816-lenfantetlaruche","Fables (1816)","3","L’enfant et la ruche.","2","1806-lenfantetlaruche","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_021"],
["1816-lesdeuxloups","Fables (1816)","3","Les deux loups.","1","1806-lesdeuxloups","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_022"],
["1816-lesgrenouillesetlespoissons","Fables (1816)","3","Les grenouilles et les poissons.","1","1806-lesgrenouillesetlespoissons","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_023"],
["1816-levillageoisetlafauvette","Fables (1816)","3","Le villageois et la fauvette.","1","1806-levillageoisetlafauvette","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_024"],
["1816-lanaissancedulionceau","Fables (1816)","3","La naissance du lionceau.","2","1806-lanaissancedulionceau","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_025"],
["1816-8","Fables (1816)","3","Les deux hiboux et la fauvette.","1","1806-8","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_026"],
["1816-9","Fables (1816)","3","La jeune orguleilleuse humiliée.","1","1806-9","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_027"],
["1816-10","Fables (1816)","3","Le lion l’ours et le renard.","1","1806-10","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_028"],
["1816-labrebisetlagneau","Fables (1816)","3","La brebis et l’agneau.","1","1806-labrebisetlagneau","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_029"],
["1816-mahometetlepauvrehomme","Fables (1816)","3","Mahomet et le pauvre homme.","2","1806-mahometetlepauvrehomme","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_030"],
["1816-lavacheetleloup","Fables (1816)","3","La vache et le loup.","1","1806-lavacheetleloup","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_031"],
["1816-lesingeàlacourdulion","Fables (1816)","3","Le singe à la cour du lion.","2","1806-lesingeàlacourdulion","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_032"],
["1816-lesdeuxvillageois","Fables (1816)","3","Les deux villageois.","1","1806-lesdeuxvillageois","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_033"],
["1816-leserinetlavolière","Fables (1816)","3","Le serin et la volière.","2","1806-leserinetlavolière","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_034"],
["1816-levieuxlionetlesanimaux","Fables (1816)","3","Le vieux lion, et les animaux.","1","1806-levieuxlionetlesanimaux","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_035"],
["1816-damisoulhommemalcorrigé","Fables (1816)","3","Damis ou l’homme mal corrigé.","1","1806-damisoulhommemalcorrigé","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_036"],
["1816-laigleetlepaon","Fables (1816)","3","L’aigle et le paon.","1","1806-laigleetlepaon","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_037"],
["1816-11","Fables (1816)","3","La femme et le miroir.","1","1806-11","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_038"],
["1816-12","Fables (1816)","3","Le paon et le moineau.","1","1806-12","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_039"],
["1816-13","Fables (1816)","3","Les deux visites.","1","1806-13","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_040"],
["1816-lechatetlasouris","Fables (1816)","3","Le chat et la souris.","1","1806-lechatetlasouris","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_041"],
["1816-lelionlachèvreetlerenard","Fables (1816)","3","Le lion la chèvre et le renard.","2","1806-lelionlachèvreetlerenard","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_042"],
["1816-lafemmeconséquenteavecsonmari","Fables (1816)","3","La femme conséquente avec son mari.","1","1806-lafemmeconséquenteavecsonmari","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_043"],
["1816-lehibouetlhirondelle","Fables (1816)","3","Le hibou et l’hirondelle.","1","1806-lehibouetlhirondelle","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_044"],
["1816-lhommeetlecheval","Fables (1816)","3","L’homme et le cheval.","0","1806-lhommeetlecheval","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_045"],
["1816-lepinsonetlapie","Fables (1816)","3","Le pinson et la pie.","1","1806-lepinsonetlapie","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_046"],
["1816-levieuxménage","Fables (1816)","3","Le vieux ménage.","2","1806-levieuxménage","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_047"],
["1816-lemerleetlhirondelle","Fables (1816)","3","Le merle et l’hirondelle.","1","1806-lemerleetlhirondelle","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_048"],
["1816-lesdeuxcampagnards","Fables (1816)","3","Les deux campagnards.","2","1806-lesdeuxcampagnards","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_049"],
["1816-14","Fables (1816)","3","Le lion et son successeur.","1","1806-14","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_050"],
["1816-15","Fables (1816)","3","Le vieillard et son fils.","2","1806-15","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_051"],
["1816-16","Fables (1816)","3","L’ambassade du tigre au lion.","1","1806-16","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_052"],
["1816-léléphantetlesinge","Fables (1816)","3","L’éléphant et le singe.","1","1806-léléphantetlesinge","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_053"],
["1816-lesenfans","Fables (1816)","3","Les enfans.","1","1806-lesenfans","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_054"],
["1816-laroseetlimmortelle","Fables (1816)","3","La rose et l’immortelle.","1","1806-laroseetlimmortelle","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_055"],
["1816-leconseildesrenards","Fables (1816)","3","Le conseil des renards.","1","1806-leconseildesrenards","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_056"],
["1816-lesamisdisputeurs","Fables (1816)","3","Les amis disputeurs.","1","1806-lesamisdisputeurs","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_057"],
["1816-lesansonnetetsacompagne","Fables (1816)","3","Le sansonnet et sa compagne.","2","1806-lesansonnetetsacompagne","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_058"],
["1816-labeilleetlelimaçon","Fables (1816)","3","L’abeille et le limaçon.","1","1806-labeilleetlelimaçon","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_059"],
["1816-levéritableami","Fables (1816)","3","Le véritable ami.","1","1806-levéritableami","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_060"],
["1816-lemoineauetlepinson","Fables (1816)","3","Le moineau et le pinson.","1","1806-lemoineauetlepinson","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_061"],
["1816-lelouplerenardletaureauetlecheval","Fables (1816)","3","Le loup, le renard, le taureau et le cheval.","2","1806-lelouplerenardletaureauetlecheval","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_062"],
["1816-laveuglelesourdetlevoyageur","Fables (1816)","3","L’aveugle, le sourd et le voyageur.","1","1806-laveuglelesourdetlevoyageur","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_063"],
["1816-lelionetlours","Fables (1816)","3","Le lion et l’ours.","1","1806-lelionetlours","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_064"],
["1816-lebrochetetlagrenouille","Fables (1816)","3","Le brochet et la grenouille.","2","1806-lebrochetetlagrenouille","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_065"],
["1816-lesdeuxvoisins","Fables (1816)","3","Les deux voisins.","1","1806-lesdeuxvoisins","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_066"],
["1816-legeaietlepinson","Fables (1816)","3","Le geai et le pinson.","1","1806-legeaietlepinson","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_067"],
["1816-lechienetlechat","Fables (1816)","3","Le chien et le chat.","1","1806-lechienetlechat","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_068"],
["1816-lhommedupedesesdéfauts","Fables (1816)","3","L’homme dupe de ses défauts.","2","1806-lhommedupedesesdéfauts","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_069"],
["1816-jupiteretlesanimaux","Fables (1816)","3","Jupiter et les animaux.","2","1806-jupiteretlesanimaux","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_070"],
["1816-latourterelleetlafauvette","Fables (1816)","3","La tourterelle et la fauvette.","1","1806-latourterelleetlafauvette","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_071"],
["1816-levoyageurmalheureux","Fables (1816)","3","Le voyageur malheureux.","3","1806-levoyageurmalheureux","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_072"],
["1816-lamortdurenard","Fables (1816)","3","La mort du renard.","1","1806-lamortdurenard","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_073"],
["1816-lhermiteetlejeunehomme","Fables (1816)","3","L’hermite et le jeune homme.","1","1806-lhermiteetlejeunehomme","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_074"],
["1816-lelionetleloup","Fables (1816)","3","Le lion et le loup.","1","1806-lelionetleloup","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_075"],
["1816-lebourdonetlhirondelle","Fables (1816)","3","Le bourdon et l’hirondelle.","1","1806-lebourdonetlhirondelle","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_076"],
["1816-leserpentetlesfourmis","Fables (1816)","3","Le serpent et les fourmis.","1","1806-leserpentetlesfourmis","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_077"],
["1816-levieillard","Fables (1816)","3","Le vieillard.","1","1806-levieillard","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_078"],
["1816-jupiterlaigleetleballon","Fables (1816)","3","Jupiter, l’aigle et le ballon.","1","1806-jupiterlaigleetleballon","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_079"],
["1816-lempereurdumogoletsonprécepteur","Fables (1816)","3","L’empereur du Mogol et son précepteur.","1","1806-lempereurdumogoletsonprécepteur","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_080"],
["1816-lechevaletleloup","Fables (1816)","3","Le cheval et le loup.","1","1806-lechevaletleloup","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_081"],
["1816-lesdeuxvoyageurs","Fables (1816)","3","Les deux voyageurs.","1","1806-lesdeuxvoyageurs","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_082"],
["1816-lepongooulhommedesboiseneurope","Fables (1816)","3","Le pongo, ou l’homme des bois en Europe.","2","1806-lepongooulhommedesboiseneurope","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_083"],
["1816-jupiteretlhommemarié","Fables (1816)","3","Jupiter et l’homme marié.","1","1806-jupiteretlhommemarié","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_084"],
["1816-loiseaudepassageetlespigeons","Fables (1816)","3","L’oiseau de passage et les pigeons.","1","1806-loiseaudepassageetlespigeons","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_085"],
["1816-lemaîtreetsonvalet","Fables (1816)","3","Le maître et son valet.","1","1806-lemaîtreetsonvalet","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_086"],
["1816-lescorbeauxetlesvautours","Fables (1816)","3","Les corbeaux et les vautours.","1","1806-lescorbeauxetlesvautours","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_087"],
["1816-lechevaletlâne","Fables (1816)","3","Le cheval et l’âne.","1","1806-lechevaletlâne","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_088"],
["1816-levieillardetlejeunemilitaire","Fables (1816)","3","Le vieillard et le jeune militaire.","1","1806-levieillardetlejeunemilitaire","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_089"],
["1816-lestroupeauxetleberger","Fables (1816)","3","Les troupeaux et le berger.","1","1806-lestroupeauxetleberger","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_090"],
["1816-lagénisseetsamère","Fables (1816)","3","La génisse et sa mère.","1","1806-lagénisseetsamère","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_091"],
["1816-lesdeuxpaysans","Fables (1816)","3","Les deux paysans.","1","1806-lesdeuxpaysans","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_092"],
["1816-lalouetteetsespetits","Fables (1816)","3","L’alouette et ses petits.","1","1806-lalouetteetsespetits","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_093"],
["1816-lejeunehommeetlevieillard","Fables (1816)","3","Le jeune homme et le vieillard.","1","1806-lejeunehommeetlevieillard","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_094"],
["1816-lerenardetledindon","Fables (1816)","3","Le renard et le dindon.","1","1806-lerenardetledindon","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_095"],
["1816-lesinconséquens","Fables (1816)","3","Les inconséquens.","1","1806-lesinconséquens","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_096"],
["1816-ledangerdelexemple","Fables (1816)","3","Le danger de l’exemple.","2","1806-ledangerdelexemple","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_097"],
["1816-letigreetlechat","Fables (1816)","3","Le tigre et le chat.","1","1806-letigreetlechat","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_098"],
["1816-lemisanthropeetsonami","Fables (1816)","3","Le misanthrope et son ami.","1","1806-lemisanthropeetsonami","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_099"],
["1816-laiglelamésangeetlespetitsoiseaux","Fables (1816)","3","L’aigle, la mésange et les petits oiseaux.","2","1806-laiglelamésangeetlespetitsoiseaux","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_100"],
["1816-lekhandebukarieetsonfils","Fables (1816)","3","Le khan de Bukarie et son fils.","2","1806-lekhandebukarieetsonfils","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_101"],
["1816-lepaonetlemerle","Fables (1816)","3","Le paon et le merle.","1","1806-lepaonetlemerle","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_102"],
["1816-lerenardchassédelacourdulion","Fables (1816)","3","Le renard chassé de la cour du lion.","1","1806-lerenardchassédelacourdulion","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_103"],
["1816-lecorbeauetlatourterelle","Fables (1816)","3","Le corbeau et la tourterelle.","1","1806-lecorbeauetlatourterelle","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_104"],
["1816-lesexagénaireetlejeunehomme","Fables (1816)","3","Le sexagénaire et le jeune homme.","1","1806-lesexagénaireetlejeunehomme","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_105"],
["1816-lerossignoletletourtereau","Fables (1816)","3","Le rossignol et le tourtereau.","1","1806-lerossignoletletourtereau","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_106"],
["1816-jupiteretlemalade","Fables (1816)","3","Jupiter et le malade.","2","1806-jupiteretlemalade","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_107"],
["1816-ledangerdelacuriosité","Fables (1816)","3","Le danger de la curiosité.","2","1806-ledangerdelacuriosité","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_108"],
["1816-laigleetsonfils","Fables (1816)","3","L’aigle et son fils.","1","1806-laigleetsonfils","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_109"],
["1816-lechienbarbetetsonpetit","Fables (1816)","3","Le chien barbet et son petit.","1","1806-lechienbarbetetsonpetit","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_110"],
["1816-lefinancieretlemendiant","Fables (1816)","3","Le financier et le mendiant.","1","1806-lefinancieretlemendiant","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_111"],
["1816-leloupetlerenard","Fables (1816)","3","Le loup et le renard.","2","1806-leloupetlerenard","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_112"],
["1816-lacolombeetlesoisons","Fables (1816)","3","La colombe et les oisons.","1","1806-lacolombeetlesoisons","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_113"],
["1816-lagneauetleloup","Fables (1816)","3","L’agneau et le loup.","1","1806-lagneauetleloup","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_114"],
["1816-lavieilleetsaservante","Fables (1816)","3","La vieille et sa servante.","1","1806-lavieilleetsaservante","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_115"],
["1816-lemoineauetlafourmi","Fables (1816)","3","Le moineau et la fourmi.","1","1806-lemoineauetlafourmi","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_116"],
["1816-17","Fables (1816)","3","Le croyant et lathée.","1","1806-17","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_117"],
["1816-loursetlesinge","Fables (1816)","3","L’ours et le singe.","1","1806-loursetlesinge","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_118"],
["1816-lapieetlacolombe","Fables (1816)","3","La pie et la colombe.","1","1806-lapieetlacolombe","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_119"],
["1816-letyranetlavillageoise","Fables (1816)","3","Le tyran et la villageoise.","1","1806-letyranetlavillageoise","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_120"],
["1816-lelionmourant","Fables (1816)","3","Le lion mourant.","1","1806-lelionmourant","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_121"],
["1816-lhommevertueuxetlhommevicieux","Fables (1816)","3","L’homme vertueux et l’homme vicieux.","1","1806-lhommevertueuxetlhommevicieux","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_122"],
["1816-laraignéelachauvesourisetlabeille","Fables (1816)","3","L’araignée, la chauve-souris et l’abeille.","1","1806-laraignéelachauvesourisetlabeille","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_123"],
["1816-lépagneuletlegrillon","Fables (1816)","3","L’épagneul et le grillon.","1","1806-lépagneuletlegrillon","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_124"],
["1816-lachèvreetlâne","Fables (1816)","3","La chèvre et l’âne.","1","1806-lachèvreetlâne","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_125"],
["1816-lesdeuxorgueilleuxetlevieillard","Fables (1816)","3","Les deux orgueilleux et le vieillard.","1","1806-lesdeuxorgueilleuxetlevieillard","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_126"],
["1816-leramieretlecorbeau","Fables (1816)","3","Le ramier et le corbeau.","1","1806-leramieretlecorbeau","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_127"],
["1816-18","Fables (1816)","3","Le bœuf et le cochon.","1","1806-18","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_128"],
["1816-lesdeuxtourtereaux","Fables (1816)","3","Les deux tourtereaux.","1","1806-lesdeuxtourtereaux","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_129"],
["1816-19","Fables (1816)","3","Le sacrifice inutile.","1","1806-19","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_130"],
["1816-lamèreetsajeunefille","Fables (1816)","3","La mère et sa jeune fille.","1","1806-lamèreetsajeunefille","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_131"],
["1816-lataupeetlelimaçon","Fables (1816)","3","La taupe et le limaçon.","1","1806-lataupeetlelimaçon","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_132"],
["1816-lebaudetetlechiendemétairie","Fables (1816)","3","Le baudet et le chien de métairie.","1","1806-lebaudetetlechiendemétairie","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_133"],
["1816-20","Fables (1816)","3","La tourterelle et le pinson.","1","1806-20","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_134"],
["1816-21","Fables (1816)","3","L’homme et le chameau.","1","1806-21","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_135"],
["1816-22","Fables (1816)","3","Les deux princes d’Asie.","1","1806-22","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_136"],
["1816-23","Fables (1816)","3","La linotte et la tourterelle.","1","1806-23","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_137"],
["1816-24","Fables (1816)","3","Le guerrier et l’orateur.","2","1806-24","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_138"],
["1816-25","Fables (1816)","3","Les deux frélons.","1","1806-25","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_139"],
["1816-26","Fables (1816)","3","Le maître d’école et son voisin.","1","1806-26","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_140"],
["1816-27","Fables (1816)","3","L’ormeau et le saule pleureur.","1","1806-27","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_141"],
["1816-28","Fables (1816)","3","Les deux amis de société, l’un en santé l’autre malade.","1","1806-28","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_142"],
["1816-29","Fables (1816)","3","Le vautour et les petits oiseaux.","1","1806-29","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_143"],
["1816-30","Fables (1816)","3","L’avare et l’usurier.","1","1806-30","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_144"],
["1816-31","Fables (1816)","3","La génisse et le renard.","1","1806-31","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_145"],
["1816-32","Fables (1816)","3","Le roi et le jardinier.","1","1806-32","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_146"],
["1816-33","Fables (1816)","3","La colombe et le moineau.","1","1806-33","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_147"],
["1816-34","Fables (1816)","3","Les deux Grecs.","1","1806-34","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_148"],
["1816-laigleetlechat","Fables (1816)","3","L’aigle et le chat.","1","1806-laigleetlechat","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_149"],
["1816-35","Fables (1816)","3","Le philosophe et l’homme du monde.","1","1806-35","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_150"],
["1816-36","Fables (1816)","3","La corneille et la mésange.","1","1806-36","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_151"],
["1816-lesdeuxvieillards","Fables (1816)","3","Les deux vieillards.","1","1806-lesdeuxvieillards","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_152"],
["1816-lavacheetlemulet","Fables (1816)","3","La vache et le mulet.","1","1806-lavacheetlemulet","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_153"],
["1816-37","Fables (1816)","3","L’hirondelle et la fauvette.","1","1806-37","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_154"],
["1816-lechevallâneetlavache","Fables (1816)","3","Le cheval, l’âne et la vache.","1","1806-lechevallâneetlavache","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_155"],
["1816-laigleetlhirondelle","Fables (1816)","3","L’aigle et l’hirondelle.","1","1806-laigleetlhirondelle","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_156"],
["1816-lerenardetlechien","Fables (1816)","3","Le renard et le chien.","1","1806-lerenardetlechien","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_157"],
["1816-lestourtereauxetlepinson","Fables (1816)","3","Les tourtereaux et le pinson.","1","1806-lestourtereauxetlepinson","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_158"],
["1816-lejugementduloup","Fables (1816)","3","Le jugement du loup.","1","1806-lejugementduloup","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_159"],
["1816-lacolombeetleramier","Fables (1816)","3","La colombe et le ramier.","1","1806-lacolombeetleramier","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_160"],
["1816-lelaboureuretsesbœufs","Fables (1816)","3","Le laboureur et ses bœufs.","2","1806-lelaboureuretsesbœufs","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_161"],
["1816-lemilanetlesmoineaux","Fables (1816)","3","Le milan et les moineaux.","1","1806-lemilanetlesmoineaux","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_162"],
["1816-leratlechatetlaraignée","Fables (1816)","3","Le rat, le chat et l’araignée.","1","1806-leratlechatetlaraignée","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_163"],
["1816-38","Fables (1816)","3","Le seigneur et le paysan.","1","1806-38","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_164"],
["1816-39","Fables (1816)","3","La poule et le chat.","1","1806-39","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_165"],
["1816-lericheetlepauvre","Fables (1816)","3","Le riche et le pauvre.","1","1806-lericheetlepauvre","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_166"],
["1816-lagneauetsamère","Fables (1816)","3","L’agneau et sa mère.","1","1806-lagneauetsamère","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_167"],
["1816-40","Fables (1816)","3","Mété ou le roi tartare.","3","1806-40","https://fr.wikisource.org/wiki/%C5%92uvres_(Ferrandi%C3%A8re)/Fables/Fable_168"],

       ]
    }
]


    // Chargement de la liste déroulante de choix de comparaison
    $("#choix").html("");
    var numChoix = 0;
    while(numChoix < data.length){
        console.log(data[numChoix])
        $("#choix").append('<option value="' + numChoix + '">' + data[numChoix].option + '</option>')
        numChoix ++;
    }

    $("#choix").val(0);

loadSankeyCompare();

$("#choix").on("change",loadSankeyCompare);

})