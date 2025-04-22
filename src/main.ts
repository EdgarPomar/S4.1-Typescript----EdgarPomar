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

const iconesTemps: { [clau: string]: string } = {
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
  // Afegir altres segons calgui...
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
      const descripcio = ciutatTroba.stateSky.description
      const fitxerImatge = iconesTemps[descripcio]

      if (fitxerImatge) {
        meteoEl.innerHTML = `
          ☁️ Temps a <strong>${ciutatTroba.name}</strong>: ${descripcio}
          <img src="/img/${fitxerImatge}" alt="${descripcio}" style="width: 32px; height: 32px; vertical-align: middle;">
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
