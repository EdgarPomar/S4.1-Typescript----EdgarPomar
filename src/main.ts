const setupEl = document.getElementById("setup") as HTMLParagraphElement
const punchlineEl = document.getElementById("punchline") as HTMLParagraphElement
const buttonSeguent = document.getElementById("seguent") as HTMLButtonElement
const valoracioButtons = document.querySelectorAll<HTMLButtonElement>("#valoracio button")
const meteoEl = document.getElementById("meteo") as HTMLParagraphElement
const selectCiutat = document.getElementById("ciutat") as HTMLSelectElement

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

const mostrarError = (missatge: string): void => {
  alert(`⚠️ Error: ${missatge}`)
}

const carregarAcudit = async (): Promise<void> => {
  try {
    const resposta = await fetch("https://official-joke-api.appspot.com/jokes/random")

    if (!resposta.ok) throw new Error("No s'ha pogut obtenir l'acudit.")

    const dades: Acudit = await resposta.json()
    acuditActual = `${dades.setup} ${dades.punchline}`
    setupEl.textContent = dades.setup
    punchlineEl.textContent = dades.punchline
  } catch (error) {
    const missatge = (error as Error).message || "S'ha produït un error desconegut."
    setupEl.textContent = "No s'ha pogut carregar l'acudit."
    punchlineEl.textContent = ""
    mostrarError(missatge)
  }
}

const carregarTemps = async (ciutat: string): Promise<void> => {
  try {
    const resposta = await fetch("https://www.el-tiempo.net/api/json/v2/home")
    const dades = await resposta.json()
    const ciutatTroba = dades.ciudades.find((item: any) => item.name.toLowerCase() === ciutat.toLowerCase())

    if (ciutatTroba) {
      meteoEl.innerHTML = `☀️ Temps a <strong>${ciutatTroba.name}</strong>: ${ciutatTroba.stateSky.description}`
    } else {
      meteoEl.textContent = `No s'ha trobat el temps per ${ciutat}`
    }
  } catch (error) {
    meteoEl.textContent = "No s'ha pogut carregar la informació meteorològica."
    console.error("Error temps:", error)
  }
}

selectCiutat.addEventListener("change", () => {
  carregarTemps(selectCiutat.value)
})

const calcularMitjana = (): number => {
  const total = reportAcudits.reduce((acc, curr) => acc + curr.score, 0)
  return total / reportAcudits.length || 0
}

valoracioButtons.forEach(boto => {
  boto.addEventListener("click", () => {
    const score = Number(boto.dataset.score)
    const existent = reportAcudits.find(item => item.joke === acuditActual)
    const data = new Date().toISOString()

    if (existent) {
      existent.score = score
      existent.date = data
    } else {
      reportAcudits[reportAcudits.length] = { joke: acuditActual, score, date: data }
    }

    console.log("📊 Mitjana:", calcularMitjana())
    console.log("📋 Reports:", reportAcudits)
  })
})

buttonSeguent.addEventListener("click", () => {
  carregarAcudit()
})

carregarAcudit()
carregarTemps(selectCiutat.value)
