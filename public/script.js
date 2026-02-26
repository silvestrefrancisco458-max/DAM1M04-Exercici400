const nomsImatges = {
  1: "uno.png",
  2: "dos.png",
  3: "tres.png",
  4: "cuatro.png",
  5: "cinco.png",
  6: "seis.png",
  7: "siete.png",
  8: "ocho.png"
};
const numFiles = 3
const numColumnes = 3
const midaCasella = 150;

let tauler = [];
let moviments = 0;

const estatResol = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
];

const taulerDiv = document.getElementById("tauler");
const movimentsSpan = document.getElementById("moviments");
const missatgeDiv = document.getElementById("missatge");
const resetBtn = document.getElementById("reset");

resetBtn.addEventListener("click", resetJoc);

function init() {
    taulerDiv.innerHTML = "";

    for (let fila = 0; fila < numFiles; fila++) {
        for (let col = 0; col < numColumnes; col++) {
            const casella = document.createElement("div");
            casella.classList.add("casella");
            casella.style.left = (col * midaCasella) + "px";
            casella.style.top = (fila * midaCasella) + "px";

            const fitxa = document.createElement("div");
            fitxa.classList.add("fitxa");
            fitxa.dataset.fila = fila;
            fitxa.dataset.col = col;
            fitxa.addEventListener("click", () => clicCasella(fila, col));

            casella.appendChild(fitxa);
            taulerDiv.appendChild(casella);
         }
    }

    resetJoc();
}

function resetJoc() {
  moviments = 0;
  movimentsSpan.textContent = moviments;
  missatgeDiv.textContent = "";

  const valors = [0,1,2,3,4,5,6,7,8];
  barrejaArray(valors);

  tauler = [];
  let index = 0;

  for (let fila = 0; fila < numFiles; fila++) {
    const filaArr = [];
    for (let col = 0; col < numColumnes; col++) {
      filaArr.push(valors[index]);
      index++;
    }
    tauler.push(filaArr);
  }

  actualitzaUI();
}

function barrejaArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function clicCasella(fila, col) {
  const { filaBuit, colBuit } = buscaBuit();

  const df = Math.abs(fila - filaBuit);
  const dc = Math.abs(col - colBuit);

  if (df + dc === 1) {
    [tauler[fila][col], tauler[filaBuit][colBuit]] =
      [tauler[filaBuit][colBuit], tauler[fila][col]];

    moviments++;
    movimentsSpan.textContent = moviments;

    actualitzaUI();

    if (estaResol()) {
      missatgeDiv.textContent = `Puzle resolt en ${moviments} moviments!`;
    }
  }
}

function buscaBuit() {
  for (let fila = 0; fila < numFiles; fila++) {
    for (let col = 0; col < numColumnes; col++) {
      if (tauler[fila][col] === 0) {
        return { filaBuit: fila, colBuit: col };
      }
    }
  }
}

function actualitzaUI() {
  const fitxes = document.querySelectorAll(".fitxa");

  fitxes.forEach(fitxa => {
    const fila = parseInt(fitxa.dataset.fila);
    const col = parseInt(fitxa.dataset.col);

    const valor = tauler[fila][col];

    if (valor === 0) {
      fitxa.classList.add("buit");
      fitxa.style.backgroundImage = "";
    } else {
      fitxa.classList.remove("buit");
      fitxa.style.backgroundImage = `url("img/${nomsImatges[valor]}")`;
    }

    fitxa.style.transform = `translate(${col * midaCasella}px, ${fila * midaCasella}px)`;
  });
}

function estaResol() {
  for (let fila = 0; fila < numFiles; fila++) {
    for (let col = 0; col < numColumnes; col++) {
      if (tauler[fila][col] !== estatResol[fila][col]) return false;
    }
  }
  return true;
}

init();
