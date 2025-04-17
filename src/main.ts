const setupEl = document.getElementById("setup") as HTMLParagraphElement
const punchlineEl = document.getElementById("punchline") as HTMLParagraphElement
const buttonSeguent = document.getElementById("seguent") as HTMLButtonElement
const valoracioButtons = document.querySelectorAll<HTMLButtonElement>("#valoracio button")

type Acudit = {
  id: number
  type: string
  setup: string
  punchline: string
}

type Report = {
  joke: string
  score: number
  date: string
}

const reportAcudits: Report[] = []
let acuditActual: string = ""

const carregarAcudit = async (): Promise<void> => {
  try {
    const resposta = await fetch("https://official-joke-api.appspot.com/jokes/random")
    const dades: Acudit = await resposta.json()
    acuditActual = `${dades.setup} ${dades.punchline}`
    setupEl.textContent = dades.setup
    punchlineEl.textContent = dades.punchline

  } catch (error) {
    setupEl.textContent = "No s'ha pogut carregar l'acudit."
    punchlineEl.textContent = ""
    console.error("Error carregant acudit:", (error as Error).message)
  }
}

const calcularMitjana = (): number => {
  const totalPuntuacions = reportAcudits.reduce((acc, curr) => acc + curr.score, 0)
  return totalPuntuacions / reportAcudits.length || 0
}

valoracioButtons.forEach((boto: HTMLButtonElement) => {
  boto.addEventListener("click", () => {
    const score: number = Number(boto.dataset.score)
    const dataISO: string = new Date().toISOString()
    const existent: Report | undefined = reportAcudits.find(item => item.joke === acuditActual)

    if (existent) {
      existent.score = score
      existent.date = dataISO
    } else {
      reportAcudits.push({
        joke: acuditActual,
        score,
        date: dataISO
      })
    }
    console.log("📊 Mitjana actual:", calcularMitjana())
    console.log("📋 Report actualitzat:", reportAcudits)
  })
})

buttonSeguent.addEventListener("click", () => {
  carregarAcudit()
})

carregarAcudit()
