// Global Data
const termSA = 41;
const termSAInDays = termSA * 7;
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
const today = new Date().toISOString().split("T")[0];
// End Global Data

// Base data
let lastMenstrualDate = document.querySelector(
  "input[name='lastMenstrualDate']"
);
lastMenstrualDate.setAttribute("max", today);
let pregnancyStartDate = document.querySelector(
  "input[name='pregnancyStartDate']"
);
pregnancyStartDate.setAttribute("max", today);
let termDate = document.querySelector("input[name='termDate']");
let termValue = document.querySelector("input[name='currentTerm']");
termValue.setAttribute("max", today);
const pregnancyAge = document.querySelector("#pregnancyAge");
let generalCalendar = document.querySelector("#generalCalendar");
let vacationType = document.querySelector("#vacationType");
let result_vacaionType = document.querySelector("#result_vacaionType");
let specificDateField = document.querySelector(
  "input[name='specificDateField']"
);
let result_specificDate = document.querySelector("#result_specificDate");
let personnalCalendar = document.querySelector("#personnalCalendar");
let memo = document.querySelector("#memo");
// End Base data

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

function calcTermDate(lastMenstrualDate, termSA, isNine = false) {
  // Convertir la date en objet Date
  if (!isNine) {
    isNine = 0;
  }
  let lastMenstrualDateObj = new Date(lastMenstrualDate);
  let termDateObj = new Date(lastMenstrualDateObj);
  termDateObj.setDate(lastMenstrualDateObj.getDate() + termSA * 7 + isNine);
  return formatDate(termDateObj);
}

// Fonction pour formater la date au format 'YYYY-MM-DD'
function formatDate(date) {
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function longFormatDate(date) {
  return new Date(date).toLocaleDateString("fr-FR", options);
}

function showImportantDate(
  termDate,
  pregnancyStartDate,
  lastMenstrualDate,
  termValue
) {
  let age = calcPregnancyAge(lastMenstrualDate);
  termValue.value = age.weeks + " SA " + age.remainingDays + " J ";
}

function calcPregnancyAge(lastMenstrualDate, specificDate = false) {
  let lastMenstrualDateObj = new Date(lastMenstrualDate);
  let currentDate = new Date();
  if (specificDate !== false) {
    currentDate = new Date(specificDate);
  }

  // Calculer la différence entre les deux dates en millisecondes
  let timeDiff = currentDate - lastMenstrualDateObj;

  // Convertir la différence en jours
  let daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  // Calculer le nombre de semaines
  let weeks = Math.floor(daysDiff / 7);

  // Calculer le reste en jours
  let remainingDays = daysDiff % 7;

  return { weeks, remainingDays };
}

function printCalendar(e) {
  e.preventDefault();
  if (lastMenstrualDate.value == "") {
    alert("*Renseignez au moins une date que vous connaissez");
    return;
  }
  print();
}

function calcCurrentTrim(pregnancyAgeWeeks) {
  if (pregnancyAgeWeeks >= 0 && pregnancyAgeWeeks <= 12) {
    return 1;
  } else if (pregnancyAgeWeeks > 12 && pregnancyAgeWeeks <= 24) {
    return 2;
  } else {
    return 3;
  }
}

// Attacher la fonction calculateDates à l'événement de changement de lastMenstrualDate
lastMenstrualDate.addEventListener("change", function (event) {
  let result = calculateDatesByLastMenstrualDate(lastMenstrualDate);
  pregnancyStartDate.value = result.pregnancyStartDate;
  termDate.value = result.termDate;
  showImportantDate(
    termDate.value,
    pregnancyStartDate.value,
    lastMenstrualDate.value,
    termValue
  );
});

pregnancyStartDate.addEventListener("change", function (event) {
  let result = calculateDatesByPregnancyStartDate(pregnancyStartDate);
  lastMenstrualDate.value = result.lastMenstrualDate;
  termDate.value = result.termDate;
  showImportantDate(
    termDate.value,
    pregnancyStartDate.value,
    lastMenstrualDate.value,
    termValue
  );
});

termDate.addEventListener("change", function (event) {
  let result = calculateDatesByTermDate(termDate);
  lastMenstrualDate.value = result.lastMenstrualDate;
  pregnancyStartDate.value = result.pregnancyStartDate;
  showImportantDate(
    termDate.value,
    pregnancyStartDate.value,
    lastMenstrualDate.value,
    termValue
  );
});

specificDateField.addEventListener("change", function (event) {
  if (lastMenstrualDate.value == "") {
    result_specificDate.textContent = "";
    alert("*Renseignez au moins une date que vous connaissez");
    return;
  }
  let result_specific = calcPregnancyAge(
    lastMenstrualDate.value,
    specificDateField.value
  );
  result_specificDate.textContent =
    "Terme pour " +
    longFormatDate(specificDateField.value) +
    " : " +
    result_specific.weeks +
    " SA " +
    result_specific.remainingDays +
    " J ";
});
