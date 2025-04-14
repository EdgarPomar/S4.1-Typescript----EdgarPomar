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
const carregarAcudit = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resposta = yield fetch("https://official-joke-api.appspot.com/jokes/random");
        const dades = yield resposta.json();
        console.log("Acudit rebut:", dades);
        setupEl.textContent = dades.setup;
        punchlineEl.textContent = dades.punchline;
    }
    catch (error) {
        setupEl.textContent = "No s'ha pogut carregar l'acudit.";
        punchlineEl.textContent = "";
        console.error("Error carregant acudit:", error);
    }
});
button.addEventListener("click", carregarAcudit);
// Carreguem un acudit en iniciar
carregarAcudit();
