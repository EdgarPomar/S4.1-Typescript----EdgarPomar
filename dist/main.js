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
// 1. Referències als elements HTML amb tipus segurs
const setupEl = document.getElementById("setup");
const punchlineEl = document.getElementById("punchline");
const buttonSeguent = document.getElementById("seguent");
const valoracioButtons = document.querySelectorAll("#valoracio button");
// 3. Array global per desar les votacions
const reportAcudits = [];
// 4. Variable temporal per emmagatzemar l'acudit actual
let acuditActual = "";
// 5. Funció per carregar acudits (de forma tipada)
const carregarAcudit = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resposta = yield fetch("https://official-joke-api.appspot.com/jokes/random");
        const dades = yield resposta.json();
        // Guardem acudit per a la votació
        acuditActual = `${dades.setup} ${dades.punchline}`;
        // Mostrem a la pantalla
        setupEl.textContent = dades.setup;
        punchlineEl.textContent = dades.punchline;
    }
    catch (error) {
        setupEl.textContent = "No s'ha pogut carregar l'acudit.";
        punchlineEl.textContent = "";
        console.error("Error carregant acudit:", error.message);
    }
});
// 6. Funció per calcular la mitjana de les puntuacions
const calcularMitjana = () => {
    const totalPuntuacions = reportAcudits.reduce((acc, curr) => acc + curr.score, 0);
    return totalPuntuacions / reportAcudits.length || 0;
};
// 7. Afegim listeners als botons de valoració
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
        // Mostrem per consola la mitjana actualitzada
        console.log("📊 Mitjana actual:", calcularMitjana());
        console.log("📋 Report actualitzat:", reportAcudits);
    });
});
// 8. Botó per carregar un nou acudit
buttonSeguent.addEventListener("click", () => {
    carregarAcudit();
});
// 9. Carreguem el primer acudit quan es carrega la pàgina
carregarAcudit();
