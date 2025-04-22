"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const setupEl = document.getElementById("setup");
const punchlineEl = document.getElementById("punchline");
const buttonSeguent = document.getElementById("seguent");
const valoracioButtons = document.querySelectorAll("#valoracio button");
const meteoEl = document.getElementById("meteo");
const selectCiutat = document.getElementById("ciutat");
let indexAcudit = 0;
const fontsDisponibles = ["joke", "chuck", "dad"];
const iconesTemps = {
    "Despejado": "../public/img/despejado.png",
    "Nuboso": "../public/img/nuboso.png",
    "Cubierto": "../public/img/cubierto.png",
    "Intervalos nubosos": "../public/img/intervalos_nuvosos.png",
    "Muy nuboso": "../public/img/muy_nuboso.png",
    "Poco nuboso": "../public/img/nublado.png",
    "Chubascos": "../public/img/chubascos.png",
    "Lluvia": "../public/img/lluvia.png",
    "Sol": "../public/img/sol.png",
    "Intervalos nubosos con lluvia": "../public/img/intervalos_nuvosos_lluvia.png",
    "Muy nuboso con lluvia escasa": "../public/img/lluvia_escasa.png",
    "Cubierto con lluvia": "../public/img/cubierto_lluvia.png"
};
const reportAcudits = [];
let acuditActual = "";
const mostrarError = (missatge) => {
    alert(`⚠️ Error: ${missatge}`);
};
const obtenirDades = (url, headers) => __awaiter(void 0, void 0, void 0, function* () {
    const resposta = yield fetch(url, { headers });
    if (!resposta.ok)
        throw new Error("Error a l'obtenir dades");
    return resposta.json();
});
const obtenirAcudit = (font) => __awaiter(void 0, void 0, void 0, function* () {
    switch (font) {
        case "joke":
            const dadesJoke = yield obtenirDades("https://official-joke-api.appspot.com/jokes/random");
            return { setup: dadesJoke.setup, punchline: dadesJoke.punchline };
        case "chuck":
            const dadesChuck = yield obtenirDades("https://api.chucknorris.io/jokes/random");
            return { setup: "Chuck Norris 🤠", punchline: dadesChuck.value };
        case "dad":
            const dadesDad = yield obtenirDades("https://icanhazdadjoke.com/", { Accept: "application/json" });
            return { setup: "Acudit de pare 👨", punchline: dadesDad.joke };
        default:
            throw new Error("Font d'acudits no reconeguda.");
    }
});
const carregarAcudit = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const font = fontsDisponibles[indexAcudit++ % fontsDisponibles.length];
        const acudit = yield obtenirAcudit(font);
        acuditActual = `${acudit.setup} ${acudit.punchline}`;
        setupEl.textContent = acudit.setup;
        punchlineEl.textContent = acudit.punchline;
    }
    catch (error) {
        const missatge = error.message || "S'ha produït un error desconegut.";
        setupEl.textContent = "No s'ha pogut carregar l'acudit.";
        punchlineEl.textContent = "";
        mostrarError(missatge);
    }
});
const carregarTemps = (ciutat) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dades = yield obtenirDades("https://www.el-tiempo.net/api/json/v2/home");
        const ciutatTroba = dades.ciudades.find((item) => item.name.toLowerCase() === ciutat.toLowerCase());
        if (ciutatTroba) {
            const descripcio = ciutatTroba.stateSky.description;
            const fitxerImatge = iconesTemps[descripcio];
            if (fitxerImatge) {
                meteoEl.innerHTML = `
          ☁️ Temps a <strong>${ciutatTroba.name}</strong>: ${descripcio}
          <img src="${fitxerImatge}" alt="${descripcio}" style="width: 32px; height: 32px; vertical-align: middle;">
        `;
            }
            else {
                meteoEl.innerHTML = `🌈 Temps a <strong>${ciutatTroba.name}</strong>: ${descripcio} (sense icona)`;
            }
        }
        else {
            meteoEl.textContent = `No s'ha trobat el temps per ${ciutat}`;
        }
    }
    catch (error) {
        meteoEl.textContent = "No s'ha pogut carregar la informació meteorològica.";
        console.error("Error temps:", error);
    }
});
const calcularMitjana = () => reportAcudits.length ? reportAcudits.reduce((acc, curr) => acc + curr.score, 0) / reportAcudits.length : 0;
const enregistrarValoracio = (score) => {
    const existent = reportAcudits.find(item => item.joke === acuditActual);
    const data = new Date().toISOString();
    if (existent) {
        existent.score = score;
        existent.date = data;
    }
    else {
        reportAcudits[reportAcudits.length] = { joke: acuditActual, score, date: data };
    }
    console.log("📊 Mitjana:", calcularMitjana());
    console.log("📋 Reports:", reportAcudits);
};
// Events
valoracioButtons.forEach(boto => {
    boto.addEventListener("click", () => enregistrarValoracio(Number(boto.dataset.score)));
});
buttonSeguent.addEventListener("click", carregarAcudit);
selectCiutat.addEventListener("change", () => carregarTemps(selectCiutat.value));
// Inicialització
carregarAcudit();
carregarTemps(selectCiutat.value);
