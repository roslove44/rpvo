// Global Data
const termSA = 41;
const termSAInDays = termSA * 7;
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
document.getElementById("currentDate").textContent =
  new Date().toLocaleDateString();
// End Global Data

// Base data
let Calendar = document.querySelectorAll("[data-preg-calc]");
let vacancesChildren = document.querySelector("#childrenNumber");
let vacancesTwins = document.querySelector("#twins");
let vacancesTriplets = document.querySelector("#triplets");
let maternityVacationField = document.querySelector("#maternityVacationField");
let prenatalVacationField = document.querySelector("#prenatalVacationField");
let lastMenstrualDate = document.querySelector(
  "input[name='lastMenstrualDate']"
);
let pregnancyStartDate = document.querySelector(
  "input[name='pregnancyStartDate']"
);
let termDate = document.querySelector("input[name='termDate']");
let currentDateTerm = document.querySelector("input[name='currentTerm']");
let generalCalendar = document.querySelector("#generalCalendar");
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

function showImportantDate(termDate, pregnancyStartDate, lastMenstrualDate) {
  let age = calcPregnancyAge(lastMenstrualDate);
  currentDateTerm.value = age.weeks + " SA " + age.remainingDays + " J ";
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

function showGeneralCalendar(termDate, pregnancyStartDate, lastMenstrualDate) {
  Calendar.forEach((element) => {
    const value = element
      .getAttribute("data-preg-calc")
      .replaceAll("{", "")
      .replaceAll("}", "")
      .trim()
      .split(",");
    if (value.length === 2) {
      const state = value[1].trim().toLowerCase();
      if (state === "before") {
        element.querySelector("td:nth-child(2)").textContent =
          "Avant le " +
          longFormatDate(calcTermDate(lastMenstrualDate, value[0]));
      } else if (state === "after") {
        element.querySelector("td:nth-child(2)").textContent =
          "À partir du " +
          longFormatDate(calcTermDate(lastMenstrualDate, value[0]));
      } else {
        element.querySelector("td:nth-child(2)").innerHTML =
          "Entre le " +
          longFormatDate(calcTermDate(lastMenstrualDate, value[0])) +
          " et le " +
          longFormatDate(calcTermDate(lastMenstrualDate, value[1]));
      }
    }
  });
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

function calcVacationDates(
  lastMenstrualDate,
  vacancesChildren,
  vacancesTriplets,
  vacancesTwins,
  maternityVacationField,
  prenatalVacationField
) {
  if (
    vacancesChildren.value <= 1 &&
    !vacancesTwins.checked &&
    !vacancesTriplets.checked
  ) {
    maternityVacationField.textContent =
      longFormatDate(calcTermDate(lastMenstrualDate.value, 41, -42)) +
      " au " +
      longFormatDate(calcTermDate(lastMenstrualDate.value, 41, 70)) +
      " (jour de reprise) ";
    prenatalVacationField.textContent =
      longFormatDate(calcTermDate(lastMenstrualDate.value, 41, -42)) +
      " au " +
      longFormatDate(calcTermDate(lastMenstrualDate.value, 41, 0));
  }

  if (
    vacancesChildren.value >= 2 &&
    !vacancesTwins.checked &&
    !vacancesTriplets.checked
  ) {
    maternityVacationField.textContent =
      longFormatDate(calcTermDate(lastMenstrualDate.value, 41, -56)) +
      " au " +
      longFormatDate(calcTermDate(lastMenstrualDate.value, 41, 126)) +
      " (jour de reprise) ";
    prenatalVacationField.textContent =
      longFormatDate(calcTermDate(lastMenstrualDate.value, 41, -56)) +
      " au " +
      longFormatDate(calcTermDate(lastMenstrualDate.value, 41, 0));
  }

  if (vacancesTwins.checked) {
    maternityVacationField.textContent =
      longFormatDate(calcTermDate(lastMenstrualDate.value, 41, -84)) +
      " au " +
      longFormatDate(calcTermDate(lastMenstrualDate.value, 41, 154)) +
      " (jour de reprise) ";
    prenatalVacationField.textContent =
      longFormatDate(calcTermDate(lastMenstrualDate.value, 41, -84)) +
      " au " +
      longFormatDate(calcTermDate(lastMenstrualDate.value, 41, 0));
  }

  if (vacancesTriplets.checked) {
    maternityVacationField.textContent =
      longFormatDate(calcTermDate(lastMenstrualDate.value, 41, -168)) +
      " au " +
      longFormatDate(calcTermDate(lastMenstrualDate.value, 41, 154)) +
      " (jour de reprise) ";
    prenatalVacationField.textContent =
      longFormatDate(calcTermDate(lastMenstrualDate.value, 41, -168)) +
      " au " +
      longFormatDate(calcTermDate(lastMenstrualDate.value, 41, 0));
  }
}

function isValidDateFormat(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (dateString.match(regex) === null) {
    return false; // Le format n'est pas valide
  }

  // Essayer de construire un objet Date à partir de la chaîne
  const date = new Date(dateString);
  const timestamp = date.getTime();

  if (typeof timestamp !== "number" || Number.isNaN(timestamp)) {
    return false; // La chaîne n'est pas une date valide
  }

  return date.toISOString().startsWith(dateString);
}

// Attacher la fonction calculateDates à l'événement de changement de lastMenstrualDate
lastMenstrualDate.addEventListener("change", function (event) {
  let result = calculateDatesByLastMenstrualDate(lastMenstrualDate);
  pregnancyStartDate.value = result.pregnancyStartDate;
  termDate.value = result.termDate;
  showImportantDate(
    termDate.value,
    pregnancyStartDate.value,
    lastMenstrualDate.value
  );
  showGeneralCalendar(
    termDate.value,
    pregnancyStartDate.value,
    lastMenstrualDate.value
  );
  calcVacationDates(
    lastMenstrualDate,
    vacancesChildren,
    vacancesTriplets,
    vacancesTwins,
    maternityVacationField,
    prenatalVacationField
  );
  if (isValidDateFormat(pregnancyStartDate.value)) {
    let pregnancyAgeCalc = calcPregnancyAge(pregnancyStartDate.value);
    let pregnancyAgeWeeks =
      pregnancyAgeCalc.weeks + pregnancyAgeCalc.remainingDays / 7;

    let trim = calcCurrentTrim(pregnancyAgeWeeks);
    let researchTrim = ".trim-" + trim;
    let infoForTrim = document.querySelectorAll(researchTrim);

    let restTrim = [1, 2, 3];
    restTrim = restTrim.filter((valeur) => valeur !== trim);
    let researchFormRestTrim =
      ".trim-" + restTrim[0] + ", " + ".trim-" + restTrim[1];
    let infoForRestTrim = document.querySelectorAll(researchFormRestTrim);

    infoForTrim.forEach((element) => {
      element
        .querySelector("td:nth-child(1) span")
        .classList.add("fw-bold", "important-line");
      element
        .querySelector("td:nth-child(2)")
        .classList.add("fw-bold", "important-line");
    });
    infoForRestTrim.forEach((element) => {
      element
        .querySelector("td:nth-child(1) span")
        .classList.remove("fw-bold", "important-line");
      element
        .querySelector("td:nth-child(2)")
        .classList.remove("fw-bold", "important-line");
    });
  } else {
    let infoForAllTrim = document.querySelectorAll("trim-1, trim-2, trim-3");
    infoForAllTrim.forEach((element) => {
      element
        .querySelector("td:nth-child(1) span")
        .classList.remove("fw-bold", "important-line");
      element
        .querySelector("td:nth-child(2)")
        .classList.remove("fw-bold", "important-line");
    });
  }
});

pregnancyStartDate.addEventListener("change", function (event) {
  let result = calculateDatesByPregnancyStartDate(pregnancyStartDate);
  lastMenstrualDate.value = result.lastMenstrualDate;
  termDate.value = result.termDate;
  showImportantDate(
    termDate.value,
    pregnancyStartDate.value,
    lastMenstrualDate.value
  );
  showGeneralCalendar(
    termDate.value,
    pregnancyStartDate.value,
    lastMenstrualDate.value
  );
  calcVacationDates(
    lastMenstrualDate,
    vacancesChildren,
    vacancesTriplets,
    vacancesTwins,
    maternityVacationField,
    prenatalVacationField
  );
});

personnalCalendar.addEventListener("click", function (event) {
  event.preventDefault();
  if (termDate.value == "") {
    alert("*Renseignez au moins une date que vous connaissez");
    return;
  } else {
    let pregnancyAgeCalc = calcPregnancyAge(pregnancyStartDate.value);
    let pregnancyAgeWeeks =
      pregnancyAgeCalc.weeks + pregnancyAgeCalc.remainingDays / 7;
    let trim = calcCurrentTrim(pregnancyAgeWeeks);
    let urlPDF = "/assets/docs/M%C3%A9mo%20Trimestre-" + trim + ".pdf";
    window.open(urlPDF, "_blank");
  }
});

vacancesChildren.addEventListener("click", function (event) {
  if (lastMenstrualDate.value == "") {
    result_vacaionType.textContent = "";
    alert("*Renseignez au moins une date que vous connaissez");
    return;
  }
  calcVacationDates(
    lastMenstrualDate,
    vacancesChildren,
    vacancesTriplets,
    vacancesTwins,
    maternityVacationField,
    prenatalVacationField
  );
});

vacancesTriplets.addEventListener("click", function (event) {
  if (lastMenstrualDate.value == "") {
    result_vacaionType.textContent = "";
    alert("*Renseignez au moins une date que vous connaissez");
    return;
  }
  if (vacancesTriplets.checked) {
    vacancesTwins.checked = false;
  }
  calcVacationDates(
    lastMenstrualDate,
    vacancesChildren,
    vacancesTriplets,
    vacancesTwins,
    maternityVacationField,
    prenatalVacationField
  );
});

vacancesTwins.addEventListener("click", function (event) {
  if (lastMenstrualDate.value == "") {
    result_vacaionType.textContent = "";
    alert("*Renseignez au moins une date que vous connaissez");
    return;
  }
  if (vacancesTwins.checked) {
    vacancesTriplets.checked = false;
  }
  calcVacationDates(
    lastMenstrualDate,
    vacancesChildren,
    vacancesTriplets,
    vacancesTwins,
    maternityVacationField,
    prenatalVacationField
  );
});

// Sauvegarde
// let vacationType = document.querySelector("#vacationType");
// let result_vacaionType = document.querySelector("#result_vacaionType");
// let specificDateField = document.querySelector(
//   "input[name='specificDateField']"
// );
// let result_specificDate = document.querySelector("#result_specificDate");
// let personnalCalendar = document.querySelector("#personnalCalendar");
// vacationType.addEventListener("change", function (event) {
//   if (lastMenstrualDate.value == "") {
//     result_vacaionType.textContent = "";
//     alert("*Renseignez au moins une date que vous connaissez");
//     return;
//   }
//   let vacationTypeValue = vacationType.value;
//   if (vacationTypeValue == "G1") {
//     result_vacaionType.textContent =
//       longFormatDate(calcTermDate(lastMenstrualDate.value, 41, -42)) +
//       " au " +
//       longFormatDate(calcTermDate(lastMenstrualDate.value, 41, 70)) +
//       " (jour de reprise) ";
//   }
//   if (vacationTypeValue == "G1E") {
//     result_vacaionType.textContent =
//       longFormatDate(calcTermDate(lastMenstrualDate.value, 41, -56)) +
//       " au " +
//       longFormatDate(calcTermDate(lastMenstrualDate.value, 41, 126)) +
//       " (jour de reprise) ";
//   }
//   if (vacationTypeValue == "G2") {
//     result_vacaionType.textContent =
//       longFormatDate(calcTermDate(lastMenstrualDate.value, 41, -84)) +
//       " au " +
//       longFormatDate(calcTermDate(lastMenstrualDate.value, 41, 154)) +
//       " (jour de reprise) ";
//   }
//   if (vacationTypeValue == "G3") {
//     result_vacaionType.textContent =
//       longFormatDate(calcTermDate(lastMenstrualDate.value, 41, -168)) +
//       " au " +
//       longFormatDate(calcTermDate(lastMenstrualDate.value, 41, 154)) +
//       " (jour de reprise) ";
//   }

//   if (vacationTypeValue == "T21COMBI") {
//     result_vacaionType.textContent =
//       longFormatDate(calcTermDate(lastMenstrualDate.value, 0, 11 * 7)) +
//       " au " +
//       longFormatDate(calcTermDate(lastMenstrualDate.value, 0, 14 * 7 - 1));
//   }
//   if (vacationTypeValue == "T212TRI") {
//     result_vacaionType.textContent =
//       longFormatDate(calcTermDate(lastMenstrualDate.value, 0, 14 * 7)) +
//       " au " +
//       longFormatDate(calcTermDate(lastMenstrualDate.value, 0, 18 * 7 - 1));
//   }
//   if (vacationTypeValue == "IVGMed") {
//     result_vacaionType.textContent =
//       longFormatDate(calcTermDate(lastMenstrualDate.value, 0, 4 * 7)) +
//       " au " +
//       longFormatDate(calcTermDate(lastMenstrualDate.value, 0, 9 * 7));
//   }
//   if (vacationTypeValue == "IVGChir") {
//     result_vacaionType.textContent = result_vacaionType.textContent =
//       longFormatDate(calcTermDate(lastMenstrualDate.value, 0, 4 * 7)) +
//       " au " +
//       longFormatDate(calcTermDate(lastMenstrualDate.value, 0, 16 * 7));
//   }
// });
// specificDateField.addEventListener("change", function (event) {
//   if (lastMenstrualDate.value == "") {
//     result_specificDate.textContent = "";
//     alert("*Renseignez au moins une date que vous connaissez");
//     return;
//   }
//   let result_specific = calcPregnancyAge(
//     lastMenstrualDate.value,
//     specificDateField.value
//   );
//   result_specificDate.textContent =
//     "Terme pour " +
//     longFormatDate(specificDateField.value) +
//     " : " +
//     result_specific.weeks +
//     " SA " +
//     result_specific.remainingDays +
//     " J ";
// });
