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
const reportAcudits = [];
let acuditActual = "";
const mostrarError = (missatge) => {
    alert(`⚠️ Error: ${missatge}`);
};
const carregarAcudit = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resposta = yield fetch("https://official-joke-api.appspot.com/jokes/random");
        if (!resposta.ok)
            throw new Error("No s'ha pogut obtenir l'acudit.");
        const dades = yield resposta.json();
        acuditActual = `${dades.setup} ${dades.punchline}`;
        setupEl.textContent = dades.setup;
        punchlineEl.textContent = dades.punchline;
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
        const resposta = yield fetch("https://www.el-tiempo.net/api/json/v2/home");
        const dades = yield resposta.json();
        const ciutatTroba = dades.ciudades.find((item) => item.name.toLowerCase() === ciutat.toLowerCase());
        if (ciutatTroba) {
            meteoEl.innerHTML = `☀️ Temps a <strong>${ciutatTroba.name}</strong>: ${ciutatTroba.stateSky.description}`;
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
selectCiutat.addEventListener("change", () => {
    carregarTemps(selectCiutat.value);
});
const calcularMitjana = () => {
    const total = reportAcudits.reduce((acc, curr) => acc + curr.score, 0);
    return total / reportAcudits.length || 0;
};
valoracioButtons.forEach(boto => {
    boto.addEventListener("click", () => {
        const score = Number(boto.dataset.score);
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
    });
});
buttonSeguent.addEventListener("click", () => {
    carregarAcudit();
});
carregarAcudit();
carregarTemps(selectCiutat.value);
