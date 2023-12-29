// Global Data
const termSA = 41;
const termSAInDays = termSA * 7;
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

// Base data
let lastMenstrualDate = document.querySelector(
  "input[name='lastMenstrualDate']"
);
let pregnancyStartDate = document.querySelector(
  "input[name='pregnancyStartDate']"
);
let termDate = document.querySelector("input[name='termDate']");
const pregnancyAge = document.querySelector("#pregnancyAge");

function calculateDatesByLastMenstrualDate(lastMenstrualDate) {
  // Convertir la date en objet Date
  let lastMenstrualDateObj = new Date(lastMenstrualDate.value);
  if (!isNaN(lastMenstrualDateObj.getTime())) {
    // Calculer pregnancyStartDate en ajoutant 14 jours à lastMenstrualDate
    let pregnancyStartDateObj = new Date(lastMenstrualDateObj);
    pregnancyStartDateObj.setDate(lastMenstrualDateObj.getDate() + 14);
    let pregnancyStartDate = formatDate(pregnancyStartDateObj);

    // Calculer termDate en ajoutant 280 jours soit 40SA à lastMenstrualDate
    let termDateObj = new Date(lastMenstrualDateObj);
    termDateObj.setDate(lastMenstrualDateObj.getDate() + termSAInDays);
    let termDate = formatDate(termDateObj);

    return { pregnancyStartDate, termDate };
  }
}

function calculateDatesByPregnancyStartDate(pregnancyStartDate) {
  // Convertir la date en objet Date
  let pregnancyStartDateObj = new Date(pregnancyStartDate.value);
  if (!isNaN(pregnancyStartDateObj.getTime())) {
    // Calculer pregnancyStartDate en ajoutant 14 jours à lastMenstrualDate
    let lastMenstrualDateObj = new Date(pregnancyStartDateObj);
    lastMenstrualDateObj.setDate(pregnancyStartDateObj.getDate() - 14);
    let lastMenstrualDate = formatDate(lastMenstrualDateObj);

    // Calculer termDate en ajoutant 280 jours soit 40SA à lastMenstrualDate
    let termDateObj = new Date(lastMenstrualDateObj);
    termDateObj.setDate(lastMenstrualDateObj.getDate() + termSAInDays);
    let termDate = formatDate(termDateObj);

    return { lastMenstrualDate, termDate };
  }
}

function calculateDatesByTermDate(termDate) {
  // Convertir la date en objet Date
  let termDateDateObj = new Date(termDate.value);
  if (!isNaN(termDateDateObj.getTime())) {
    // Calculer termDate en ajoutant 280 jours soit 40SA à lastMenstrualDate
    let lastMenstrualDateObj = new Date(termDateDateObj);
    lastMenstrualDateObj.setDate(termDateDateObj.getDate() - termSAInDays);
    let lastMenstrualDate = formatDate(lastMenstrualDateObj);

    // Calculer pregnancyStartDate en ajoutant 14 jours à lastMenstrualDate
    let pregnancyStartDateObj = new Date(lastMenstrualDateObj);
    pregnancyStartDateObj.setDate(lastMenstrualDateObj.getDate() + 14);
    let pregnancyStartDate = formatDate(pregnancyStartDateObj);

    return { lastMenstrualDate, pregnancyStartDate };
  }
}
// Fonction pour formater la date au format 'YYYY-MM-DD'
function formatDate(date) {
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Attacher la fonction calculateDates à l'événement de changement de lastMenstrualDate
lastMenstrualDate.addEventListener("change", function (event) {
  let result = calculateDatesByLastMenstrualDate(lastMenstrualDate);
  pregnancyStartDate.value = result.pregnancyStartDate;
  termDate.value = result.termDate;
  showResult(termDate.value, pregnancyStartDate.value, lastMenstrualDate.value);
});

pregnancyStartDate.addEventListener("change", function (event) {
  let result = calculateDatesByPregnancyStartDate(pregnancyStartDate);
  lastMenstrualDate.value = result.lastMenstrualDate;
  termDate.value = result.termDate;
  showResult(termDate.value, pregnancyStartDate.value, lastMenstrualDate.value);
});

termDate.addEventListener("change", function (event) {
  let result = calculateDatesByTermDate(termDate);
  lastMenstrualDate.value = result.lastMenstrualDate;
  pregnancyStartDate.value = result.pregnancyStartDate;
  showResult(termDate.value, pregnancyStartDate.value, lastMenstrualDate.value);
});

function showResult(termDate, pregnancyStartDate, lastMenstrualDate) {
  pregnancyAge.querySelector("ul > li:nth-child(4)").textContent =
    "Date de terme (41 SA) : " +
    new Date(termDate).toLocaleDateString("fr-FR", options);
  pregnancyAge.querySelector("ul > li:nth-child(3)").textContent =
    "Date de début de grossesse : " +
    new Date(pregnancyStartDate).toLocaleDateString("fr-FR", options);
  pregnancyAge.querySelector("ul > li:nth-child(2)").textContent =
    "Date des dernières règles : " +
    new Date(lastMenstrualDate).toLocaleDateString("fr-FR", options);

  let age = calcPregnancyAge(lastMenstrualDate);
  pregnancyAge.querySelector("ul > li:nth-child(1)").textContent =
    "Terme ce jour : " + age.weeks + " SA " + age.remainingDays + " J ";
}

function calcPregnancyAge(lastMenstrualDate) {
  let lastMenstrualDateObj = new Date(lastMenstrualDate);
  let currentDate = new Date();
  // Calculer la différence entre les deux dates en millisecondes
  let timeDiff = currentDate - lastMenstrualDateObj;

  // Convertir la différence en jours
  let daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  console.log(daysDiff);

  // Calculer le nombre de semaines
  let weeks = Math.floor(daysDiff / 7);

  // Calculer le reste en jours
  let remainingDays = daysDiff % 7;

  return { weeks, remainingDays };
}
