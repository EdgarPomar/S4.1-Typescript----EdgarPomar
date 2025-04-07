const setupEl = document.getElementById("setup") as HTMLParagraphElement
const punchlineEl = document.getElementById("punchline") as HTMLParagraphElement
const button = document.getElementById("seguent") as HTMLButtonElement

type Acudit = {
  id: number
  type: string
  setup: string
  punchline: string
}

const carregarAcudit = async (): Promise<void> => {
  try {
    const resposta = await fetch("https://official-joke-api.appspot.com/jokes/random")
    const dades: Acudit = await resposta.json()
    console.log("Acudit rebut:", dades)

    setupEl.textContent = dades.setup
    punchlineEl.textContent = dades.punchline
  } catch (error) {
    setupEl.textContent = "No s'ha pogut carregar l'acudit."
    punchlineEl.textContent = ""
    console.error("Error carregant acudit:", error)
  }
}

button.addEventListener("click", carregarAcudit)

// Carreguem un acudit en iniciar
carregarAcudit()
