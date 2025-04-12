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
const button = document.getElementById("seguent");
const valoracioBtns = document.querySelectorAll('[data-score]');
const reportAcudits = [];
let acuditActual = null;
let puntuacioActual = null;
const carregarAcudit = () => __awaiter(void 0, void 0, void 0, function* () {
    if (acuditActual) {
        const existent = reportAcudits.find(a => a.id === acuditActual.id);
        if (existent) {
            if (puntuacioActual !== null)
                existent.score = puntuacioActual;
        }
        else {
            reportAcudits.push({
                id: acuditActual.id,
                joke: `${acuditActual.setup} ${acuditActual.punchline}`,
                score: puntuacioActual,
                date: new Date().toISOString()
            });
        }
        console.log("reportAcudits:", reportAcudits);
    }
    try {
        const resposta = yield fetch("https://official-joke-api.appspot.com/jokes/random");
        const dades = yield resposta.json();
        console.log("Acudit rebut:", dades);
        acuditActual = dades;
        puntuacioActual = null;
        setupEl.textContent = dades.setup;
        punchlineEl.textContent = dades.punchline;
        valoracioBtns.forEach(btn => btn.classList.remove("selected"));
    }
    catch (error) {
        setupEl.textContent = "No s'ha pogut carregar l'acudit.";
        punchlineEl.textContent = "";
        console.error("Error carregant acudit:", error);
    }
});
valoracioBtns.forEach(button => {
    button.addEventListener("click", () => {
        puntuacioActual = Number(button.dataset.score);
        valoracioBtns.forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
    });
});
button.addEventListener("click", carregarAcudit);
// Carrega el primer acudit
carregarAcudit();
