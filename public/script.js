"use strict" // Activa el modo estricto de JavaScript
// El tamaño de las casillas
const midaCasella = 120
// El tablero es 3x3
const numFiles = 3
const numColumnes = 3

// guarda el estado actual del puzzle
let tauler = []
// es la solución correcta
const estatResolut = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 0]
];

// cuenta cuántos movimientos haces
let moviments = 0

// Configura variables CSS y obtiene el tablero del HTML. Crea las casillas y las fichas, y asigna eventos a los botones.
function init() {
  // variables CSS
  const root = document.documentElement
  root.style.setProperty("--mida", midaCasella + "px")
  root.style.setProperty("--files", numFiles)
  root.style.setProperty("--columnes", numColumnes)

  const refTauler = document.getElementById("tauler")

  // Crea las 9 casillas del tablero (el fondo donde van las piezas).
  for (let fila = 0; fila < numFiles; fila++) {
    for (let columna = 0; columna < numColumnes; columna++) {
      const refCasella = document.createElement("div")
      refCasella.classList.add("casella")
      refCasella.style.left = `${columna * midaCasella}px`
      refCasella.style.top = `${fila * midaCasella}px`
      refTauler.appendChild(refCasella)
    }
  }

  // Este for recorre los valores del 1 al 8, porque el puzzle tiene 8 piezas.
  for (let valor = 1; valor <= 8; valor++) {
    const refFitxa = document.createElement("div");
    refFitxa.classList.add("fitxa");
    refFitxa.dataset.valor = valor;

    // Aquí se calcula en qué fila y columna está esa ficha dentro de la imagen original.
    const fila = Math.floor((valor - 1) / 3);
    const col = (valor - 1) % 3;

    // Este bloque hace que cada ficha muestre solo una parte de la imagen grande.
    refFitxa.style.backgroundImage = "url('img/gokup.jpg')";
    refFitxa.style.backgroundSize = `${midaCasella * 3}px ${midaCasella * 3}px`;
    refFitxa.style.backgroundPosition = `-${col * midaCasella}px -${fila * midaCasella}px`;

    // Aquí se le dice a cada ficha que, cuando el usuario haga clic, se ejecute la función clicFitxa(valor).
    refFitxa.addEventListener("click", () => clicFitxa(valor));
    refTauler.appendChild(refFitxa);
  }


  // botó reset
  document.getElementById("btnReset").addEventListener("click", resetJoc)
  // botó ordenar
  document.getElementById("btnOrdenar").addEventListener("click", ordenarTot)
  // se ejecuta para que el juego arranque ya mezclado cuando se carga la página.
  resetJoc()
}

//crea un array con todos los valores del tablero: del 0 al 8.
function resetJoc() {
  // El 0 representa el hueco vacío.
  const valors = [0, 1, 2, 3, 4, 5, 6, 7, 8]
  barrejaArray(valors)

  // Aquí el código transforma la lista mezclada en una matriz de 3 filas y 3 columnas, que es la estructura real del tablero.
  tauler = []
  let index = 0
  for (let fila = 0; fila < numFiles; fila++) {
    const filaArr = []
    for (let columna = 0; columna < numColumnes; columna++) {
      filaArr.push(valors[index])
      index++
    }
    // Al final, tauler queda con forma de tablero, por ejemplo algo como
    tauler.push(filaArr)
  }

  // Una vez creado el nuevo tablero, se pone el contador de movimientos a cero
  moviments = 0
  // se actualiza el texto que muestra esos movimientos
  actualitzaMoviments()
  document.getElementById("missatge").textContent = ""
  actualitzaUI()
}

// Mezcla los números del puzzle al azar.
// Sirve para desordenar las piezas antes de empezar.
function barrejaArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}

// Busca dónde está el 0, que representa el espacio vacío.
// Devuelve su fila y columna.
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

// Empieza buscando la posición de la ficha pulsada y del hueco.
function clicFitxa(valorFitxa) {
  let posFitxa = null
  let posBuit = null

  // Recorre el tablero para encontrar ambas posiciones.
  for (let fila = 0; fila < numFiles; fila++) {
    for (let columna = 0; columna < numColumnes; columna++) {
      if (tauler[fila][columna] === valorFitxa) {
        posFitxa = { fila, columna }
      } else if (tauler[fila][columna] === 0) {
        posBuit = { fila, columna }
      }
    }
  }

  // Si no encuentra una de las dos, sale y no hace nada.
  if (!posFitxa || !posBuit) return

  // Calcula la distancia entre la ficha y el hueco.
  const df = posFitxa.fila - posBuit.fila
  const dc = posFitxa.columna - posBuit.columna
  const distancia = Math.abs(df) + Math.abs(dc)

  // Calcula la distancia entre la ficha y el hueco.
  if (distancia === 1) {
    // intercanvi a la matriu
    tauler[posBuit.fila][posBuit.columna] = valorFitxa
    tauler[posFitxa.fila][posFitxa.columna] = 0

    // Suma un movimiento, actualiza la pantalla y comprueba si ya ganaste.
    moviments++
    actualitzaMoviments()
    actualitzaUI()
    comprovaResolut()
  }
}

// """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
// Selecciona todas las fichas y mira qué número tiene cada una.
// hace mover los bloque.
function actualitzaUI() {
  const fitxes = document.querySelectorAll(".fitxa")
  fitxes.forEach((fitxa) => {
    const valor = parseInt(fitxa.dataset.valor)
    // Variables para guardar su posición dentro del tablero.
    let filaPos = 0
    let colPos = 0

    // Busca en la matriz tauler dónde está esa ficha.
    for (let fila = 0; fila < numFiles; fila++) {
      for (let columna = 0; columna < numColumnes; columna++) {
        if (tauler[fila][columna] === valor) {
          filaPos = fila
          colPos = columna
        }
      }
    }

    // Calcula su posición en píxeles y mueve la ficha visualmente.
    const x = colPos * midaCasella
    const y = filaPos * midaCasella
    // Eso cambia la posición de cada ficha en pantalla.
    fitxa.style.transform = `translate(${x}px, ${y}px)`
  })
}
// """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

// Cambia el texto para mostrar cuántos movimientos llevas.
function actualitzaMoviments() {
  document.getElementById("infoMoviments").textContent =
    "Moviments: " + moviments
}

// Compara el tablero actual con la solución correcta.
// Si algo no coincide, se para.
function comprovaResolut() {
  for (let fila = 0; fila < numFiles; fila++) {
    for (let columna = 0; columna < numColumnes; columna++) {
      if (tauler[fila][columna] !== estatResolut[fila][columna]) {
        return;
      }
    }
  }

  // Si todo coincide, muestra el mensaje de victoria.
  const missatge = document.getElementById("missatge");
  missatge.textContent = "Felicitats! Has completat el puzle en " + moviments + " moviments!";
  missatge.style.color = "var(--color-success)";
  missatge.style.fontSize = "18px";
}


/////////////// BOTON DE ORDENAR //////////////////
// Hace que al pulsar el botón se ejecute ordenarTot().
document.getElementById("btnOrdenar").addEventListener("click", ordenarTot)

// Coloca el tablero directamente en la posición 
// final correcta, actualiza la pantalla y muestra que has ganado.
function ordenarTot() {
  tauler = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
  ]

  actualitzaUI()
  comprovaResolut()
}