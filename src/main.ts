const setupEl = document.getElementById("setup") as HTMLParagraphElement
const punchlineEl = document.getElementById("punchline") as HTMLParagraphElement
const buttonSeguent = document.getElementById("seguent") as HTMLButtonElement
const valoracioButtons = document.querySelectorAll<HTMLButtonElement>("#valoracio button")
const meteoEl = document.getElementById("meteo") as HTMLParagraphElement
const selectCiutat = document.getElementById("ciutat") as HTMLSelectElement

let indexAcudit = 0
const fontsDisponibles = ["joke", "chuck", "dad"]

const iconesTemps: Record<string, string> = {
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
}

type Acudit = {
  id?: number
  type?: string
  setup: string
  punchline: string
}

type Report = {
  joke: string
  score: number
  date: string
}

const reportAcudits: Report[] = []
let acuditActual = ""

const mostrarError = (missatge: string): void => {
  alert(`⚠️ Error: ${missatge}`)
}

const obtenirDades = async (url: string, headers?: HeadersInit) => {
  const resposta = await fetch(url, { headers })
  if (!resposta.ok) throw new Error("Error a l'obtenir dades")
  return resposta.json()
}

const obtenirAcudit = async (font: string): Promise<Acudit> => {
  switch (font) {
    case "joke":
      const dadesJoke = await obtenirDades("https://official-joke-api.appspot.com/jokes/random")
      return { setup: dadesJoke.setup, punchline: dadesJoke.punchline }

    case "chuck":
      const dadesChuck = await obtenirDades("https://api.chucknorris.io/jokes/random")
      return { setup: "Chuck Norris 🤠", punchline: dadesChuck.value }

    case "dad":
      const dadesDad = await obtenirDades("https://icanhazdadjoke.com/", { Accept: "application/json" })
      return { setup: "Acudit de pare 👨", punchline: dadesDad.joke }

    default:
      throw new Error("Font d'acudits no reconeguda.")
  }
}

const carregarAcudit = async (): Promise<void> => {
  try {
    const font = fontsDisponibles[indexAcudit++ % fontsDisponibles.length]
    const acudit = await obtenirAcudit(font)

    acuditActual = `${acudit.setup} ${acudit.punchline}`
    setupEl.textContent = acudit.setup
    punchlineEl.textContent = acudit.punchline
  } catch (error) {
    const missatge = (error as Error).message || "S'ha produït un error desconegut."
    setupEl.textContent = "No s'ha pogut carregar l'acudit."
    punchlineEl.textContent = ""
    mostrarError(missatge)
  }
}

const carregarTemps = async (ciutat: string): Promise<void> => {
  try {
    const dades = await obtenirDades("https://www.el-tiempo.net/api/json/v2/home")
    const ciutatTroba = dades.ciudades.find((item: any) => item.name.toLowerCase() === ciutat.toLowerCase())

    if (ciutatTroba) {
      const descripcio = ciutatTroba.stateSky.description
      const fitxerImatge = iconesTemps[descripcio]

      if (fitxerImatge) {
        meteoEl.innerHTML = `
          ☁️ Temps a <strong>${ciutatTroba.name}</strong>: ${descripcio}
          <img src="${fitxerImatge}" alt="${descripcio}" style="width: 32px; height: 32px; vertical-align: middle;">
        `
      } else {
        meteoEl.innerHTML = `🌈 Temps a <strong>${ciutatTroba.name}</strong>: ${descripcio} (sense icona)`
      }
    } else {
      meteoEl.textContent = `No s'ha trobat el temps per ${ciutat}`
    }
  } catch (error) {
    meteoEl.textContent = "No s'ha pogut carregar la informació meteorològica."
    console.error("Error temps:", error)
  }
}

const calcularMitjana = (): number =>
  reportAcudits.length ? reportAcudits.reduce((acc, curr) => acc + curr.score, 0) / reportAcudits.length : 0

const enregistrarValoracio = (score: number): void => {
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
}

// Events
valoracioButtons.forEach(boto => {
  boto.addEventListener("click", () => enregistrarValoracio(Number(boto.dataset.score)))
})

buttonSeguent.addEventListener("click", carregarAcudit)

selectCiutat.addEventListener("change", () => carregarTemps(selectCiutat.value))

// Inicialització
carregarAcudit()
carregarTemps(selectCiutat.value)
