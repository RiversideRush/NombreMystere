var Hall_of_Fame = new Array();
var pseudo = "";
var rank = 0;

/**
 * Affiche/cache le tableau HOF en enclenchant le bouton RANKING
 */
function ranking() {
  rank++;
  if (rank % 2 != 0) {
    showDisplay(TableHOF);
  } else {
    hideDisplay(TableHOF);
  }
}

/**
 * Démarre une partie du pendu lorsque le bouton START est enclenché
 */
function go() {
  hideDisplay(boutons);
  showDisplay(champNumero);
  score = 0;//reset
  rank = 0;//reset
  alertBlank(resultat);
  alertBlank(HOFouRate);
  hideDisplay(TableHOF);
  timeStart = timeNow();
  timerAffichage();
  $(inputNumero).attr("placeholder", "Entrez un numéro");
  numOrdi = Math.floor(Math.random() * 10) + 1;
  //console.log(numOrdi);
  var promptNumero = document.getElementById("inputNumero");
  promptNumero.onchange = function (event) {
    numUtilisateur = parseInt(this.value);
    this.value = "";
    testNombre(numUtilisateur, numOrdi);
    if (numUtilisateur == numOrdi) {
      var timeEnd = timeNow();
      time = (timeEnd - timeStart) / 1000.0;
      hideDisplay(champNumero);
      HOFsupInf10();
    }
  };
}

/**
 * Cache la DIV contenant une image, un input, un tableau ou un bouton
 * @param {*} infoADonner
 */
function hideDisplay(infoADonner) {
  $(infoADonner).css("display", "none");
}

/**
 * Affiche la DIV contenant une image, un input, un tableau ou un bouton
 * @param {*} infoADonner
 */
function showDisplay(infoADonner) {
  $(infoADonner).css("display", "block");
}

/**
 *Cache un message texte
 * @param {*} infoADonner
 */
function alertBlank(infoADonner) {
  $(infoADonner).text("");
}

/**
 * Démarrage du timer
 * @returns
 */
function timeNow() {
  return new Date();
}

/**
 * Affiche le timer
 */
function timerAffichage() {
  interval = setInterval(function () {
    let dateAffichage = new Date();
    timerElement = $("#timer");
    timerElement.text(
      Number.parseFloat(
        (dateAffichage.getTime() - timeStart.getTime()) / 1000
      ).toFixed(3) + "s"
    );
  }, 50); //mise à jour toutes les 50 millisecondes
}

/**
 * Test les différents cas lorsque l'utilisateur entre un numéro dans l'input
 * @param {} numUtilisateur
 * @param {*} numOrdi
 */
function testNombre(numUtilisateur, numOrdi) {
  if (isNaN(parseInt(numUtilisateur))) {
    $("#inputNumero").attr("placeholder", "Seulement un NUMERO !");
    score++;
  } else if (numUtilisateur < 1 || numUtilisateur > 10) {
    $("#inputNumero").attr("placeholder", "Entre 1 et 10 !");
    score++;
  } else if (numUtilisateur > numOrdi) {
    $("#inputNumero").attr("placeholder", "Trop grand !");
    score++;
  } else if (numUtilisateur < numOrdi) {
    $("#inputNumero").attr("placeholder", "Trop petit !");
    score++;
  } else {
    //(numUtilisateur == numOrdi)
    score++;
  }
}

/**
 * Condition pour l'enregistrement de nouveaux joueurs en fonction de la taille du tableau HOF
 */
function HOFsupInf10() {
  if (Hall_of_Fame.length < 10) {//taille max d'affichage du classement
    alertResultat(score, time);
    alertHOF();
    remplirTableau(Hall_of_Fame, score, time);
  } else {
    if (
      score < Hall_of_Fame[Hall_of_Fame.length - 1].score ||
      (score == Hall_of_Fame[Hall_of_Fame.length - 1].score &&
        time <= Hall_of_Fame[Hall_of_Fame.length - 1].time)
    ) {
      alertResultat(score, time);
      alertHOF();
      remplirTableau(Hall_of_Fame, score, time);
    } else {
      alertResultat(score, time);
      alertRate();
      showDisplay(boutons);
    }
  }
}

/**
 * Annonce que le joueur a gagné la partie et affiche le nombre d'essai(s) ainsi que son temps
 * @param {*} score
 * @param {*} time
 */
function alertResultat(score, time) {
  if (score == 1) {
    $(resultat)
      .text(
        "Bravo ! Vous avez réussi en " +
          score +
          " tentative pour " +
          time +
          " secondes."
      )
      .css("fontSize", "30px");
  } else {
    $(resultat)
      .text(
        "Bravo ! Vous avez réussi en " +
          score +
          " tentatives pour " +
          time +
          " secondes."
      )
      .css("fontSize", "30px");
  }
}

/**
 * Annonce que le joueur peut rejoindre le HOF
 */
function alertHOF() {
  $(HOFouRate).text("WELCOME TO THE HALL OF FAME !").css("fontSize", "50px");
}

/**
 * Remplissage du tableau HOF avec le pseudo, le score et le temps mis au joueur pour gagner
 * @param {*} Hall_of_Fame
 * @param {*} score
 * @param {*} time
 */
function remplirTableau(Hall_of_Fame, score, time) {
  Hall_of_Fame[Hall_of_Fame.length] = new result(score, time);
  if (Hall_of_Fame.length > 1) {
    Hall_of_Fame.sort(function (a, b) {
      return a.score - b.score || a.time - b.time;//tri du tableau par rapport aux nombres d'erreur réalisées. Si ces derniers sont égaux, tri par rapport au temps
    });
  }
  if (Hall_of_Fame.length > 3) {
    Hall_of_Fame.pop();
  }
  showDisplay(champPseudo);
  var promptPseudo = document.getElementById("inputPseudo");
  promptPseudo.onchange = function (event) {
    pseudo = this.value;
    this.value = "";
    for (var pos = 0; pos < Hall_of_Fame.length; pos++) {
      if (score == Hall_of_Fame[pos].score && time == Hall_of_Fame[pos].time) {
        Hall_of_Fame[pos].pseudo = pseudo;
        break;
      }
    }
    for (var pos = 0; pos < Hall_of_Fame.length; pos++) {
      $("#pseudo" + pos).text(Hall_of_Fame[pos].pseudo);
      $("#nombre" + pos).text(Hall_of_Fame[pos].score);
      $("#time" + pos).text(Hall_of_Fame[pos].time);
    }
    showDisplay(boutons);
    alertBlank(resultat);
    alertBlank(HOFouRate);
    hideDisplay(champPseudo); //cache l'input pour entrer le pseudo
  };
}

/**
 * Ajoute au sein du tableau HOF une nouvelle ligne comprenant le score et le temps du nouveau joueur seulement
 * @param {*} score
 * @param {*} time
 */
function result(score, time) {
  this.score = score;
  this.time = time;
}

/**
 * Annonce que le joueur ne peut pas rejoindre le HOF
 */
function alertRate() {
  $(HOFouRate)
    .text("Mais vous ne pouvez pas entrer au sein du Hall of Fame. TRY AGAIN !")
    .css("fontSize", "30px");
}
