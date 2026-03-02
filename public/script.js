"use strict"

const midaCasella = 120
const numFiles = 3
const numColumnes = 3

// 0 = buit, 1..8 = peces
let tauler = []
const estatResolut = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 0]
]

let moviments = 0

function init() {
  // variables CSS
  const root = document.documentElement
  root.style.setProperty("--mida", midaCasella + "px")
  root.style.setProperty("--files", numFiles)
  root.style.setProperty("--columnes", numColumnes)

  const refTauler = document.getElementById("tauler")

  // crear caselles base (grid visual)
  for (let fila = 0; fila < numFiles; fila++) {
    for (let columna = 0; columna < numColumnes; columna++) {
      const refCasella = document.createElement("div")
      refCasella.classList.add("casella")
      refCasella.style.left = `${columna * midaCasella}px`
      refCasella.style.top = `${fila * midaCasella}px`
      refTauler.appendChild(refCasella)
    }
  }

  // crear fitxes (1..8) com a divs independents
  for (let valor = 1; valor <= 8; valor++) {
    const refFitxa = document.createElement("div")
    refFitxa.classList.add("fitxa")
    refFitxa.dataset.valor = valor
    refFitxa.textContent = valor   // ← AQUÍ aparece el número
    refFitxa.addEventListener("click", () => clicFitxa(valor))
    refTauler.appendChild(refFitxa)
  }

  // botó reset
  document.getElementById("btnReset").addEventListener("click", resetJoc)

  resetJoc()
}

function resetJoc() {
  // crear array amb valors 0..8 i barrejar
  const valors = [0, 1, 2, 3, 4, 5, 6, 7, 8]
  barrejaArray(valors)

  // omplir matriu 3x3
  tauler = []
  let index = 0
  for (let fila = 0; fila < numFiles; fila++) {
    const filaArr = []
    for (let columna = 0; columna < numColumnes; columna++) {
      filaArr.push(valors[index])
      index++
    }
    tauler.push(filaArr)
  }

  moviments = 0
  actualitzaMoviments()
  document.getElementById("missatge").textContent = ""
  actualitzaUI()
}

// Fisher-Yates
function barrejaArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}

function buscaBuit() {
  for (let fila = 0; fila < numFiles; fila++) {
    for (let columna = 0; columna < numColumnes; columna++) {
      if (tauler[fila][columna] === 0) {
        return { fila, columna }
      }
    }
  }
  return null
}

function clicFitxa(valorFitxa) {
  // buscar posició de la fitxa clicada i del buit
  let posFitxa = null
  let posBuit = null

  for (let fila = 0; fila < numFiles; fila++) {
    for (let columna = 0; columna < numColumnes; columna++) {
      if (tauler[fila][columna] === valorFitxa) {
        posFitxa = { fila, columna }
      } else if (tauler[fila][columna] === 0) {
        posBuit = { fila, columna }
      }
    }
  }

  if (!posFitxa || !posBuit) return

  const df = posFitxa.fila - posBuit.fila
  const dc = posFitxa.columna - posBuit.columna
  const distancia = Math.abs(df) + Math.abs(dc)

  // només si és adjacent
  if (distancia === 1) {
    // intercanvi a la matriu
    tauler[posBuit.fila][posBuit.columna] = valorFitxa
    tauler[posFitxa.fila][posFitxa.columna] = 0

    moviments++
    actualitzaMoviments()
    actualitzaUI()
    comprovaResolut()
  }
}

function actualitzaUI() {
  // moure cada fitxa segons la seva posició a la matriu
  const fitxes = document.querySelectorAll(".fitxa")
  fitxes.forEach((fitxa) => {
    const valor = parseInt(fitxa.dataset.valor)
    let filaPos = 0
    let colPos = 0

    for (let fila = 0; fila < numFiles; fila++) {
      for (let columna = 0; columna < numColumnes; columna++) {
        if (tauler[fila][columna] === valor) {
          filaPos = fila
          colPos = columna
        }
      }
    }

    const x = colPos * midaCasella
    const y = filaPos * midaCasella
    fitxa.style.transform = `translate(${x}px, ${y}px)`
  })
}

function actualitzaMoviments() {
  document.getElementById("infoMoviments").textContent =
    "Moviments: " + moviments
}

function comprovaResolut() {
  for (let fila = 0; fila < numFiles; fila++) {
    for (let columna = 0; columna < numColumnes; columna++) {
      if (tauler[fila][columna] !== estatResolut[fila][columna]) {
        return
      }
    }
  }
  document.getElementById("missatge").textContent =
    "Puzle resolt en " + moviments + " moviments!"
}