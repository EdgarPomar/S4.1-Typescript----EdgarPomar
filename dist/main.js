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
const reportAcudits = [];
let acuditActual = "";
const mostrarError = (missatge) => {
    alert(`⚠️ Error: ${missatge}`);
};
const carregarAcudit = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resposta = yield fetch("https://official-joke-api.appspot.com/jokes/random");
        if (!resposta.ok) {
            throw new Error("No s'ha pogut obtenir l'acudit. Torna-ho a intentar més tard.");
        }
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
        console.error("Error carregant acudit:", missatge);
    }
});
const calcularMitjana = () => {
    const totalPuntuacions = reportAcudits.reduce((acc, curr) => acc + curr.score, 0);
    return totalPuntuacions / reportAcudits.length || 0;
};
valoracioButtons.forEach((boto) => {
    boto.addEventListener("click", () => {
        const score = Number(boto.dataset.score);
        const dataISO = new Date().toISOString();
        const existent = reportAcudits.find(item => item.joke === acuditActual);
        if (existent) {
            existent.score = score;
            existent.date = dataISO;
        }
        else {
            reportAcudits.push({
                joke: acuditActual,
                score,
                date: dataISO
            });
        }
        console.log("📊 Mitjana actual:", calcularMitjana());
        console.log("📋 Report actualitzat:", reportAcudits);
    });
});
buttonSeguent.addEventListener("click", () => {
    carregarAcudit();
});
carregarAcudit();
