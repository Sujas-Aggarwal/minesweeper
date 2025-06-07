// HTML LINKING
const canvas = document.querySelector("#game-canvas");
canvas.style.width = `${CANVAS_SIZE}px`;
canvas.style.height = `${CANVAS_SIZE}px`;

// GAME BOARD JS SETUP
let bombs = new Map();

// RANDOM BOMB GENERATION
// BOMB TO NO BOMB RATIO IS 1/5 (20% BOXES ARE BOMBS)
// SO LETS MAKE BOMBS USING PROBABILITY
function generateBombs() {
  bombs.clear();
  console.log("Generating Bombs");
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (customBombGenerator(i,j)) {
        console.log("Setting " , i,",",j," as Bomb");
        bombs.set(`${i},${j}`, true);
      }
      // ELSE NO BOMBS
    }
  }
}
generateBombs();

// GAME BOARD HTML SETUP
{
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < SIZE; i++) {
    // For Every Row, add a div
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.flex = "1";
    for (let j = 0; j < SIZE; j++) {
      // create a dabba for each row
      const dabba = document.createElement("div");
      dabba.className = `dabba ${
        (i + j) % 2 == 0 ? "alternate" : ""
      } dabba-(${i},${j})`;
      dabba.setAttribute("data-row", i);
      dabba.setAttribute("data-col", j);
      row.appendChild(dabba);
    }
    fragment.appendChild(row);
  }
  canvas.append(fragment);
}

const dabas = document.querySelectorAll(".dabba");
Array.from(dabas).map((dabba) => {
  // Implementing JS for all dabas
  dabba.onclick = () => {
    if (dabba.classList.contains("inactive")) return;
    if (dabba.classList.contains("flagged")) return;
    onDabbaLeftClick(dabba);
  };
  dabba.oncontextmenu = (e) => {
    e.preventDefault();
    if (dabba.classList.contains("inactive")) return;
    onDabbaRightClick(dabba);
  };
});

function dabbaValue(row, col) {
  let val = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (bombs.has(`${row + i},${col + j}`)) {
        val++;
        if (i == 0 && j == 0) {
          // THIS IS BOMB
          return -1;
        }
      }
    }
  }
  return val;
}

async function revealAllBombs() {
  for (let i of bombs) {
    const dabba = document.getElementsByClassName(`dabba-(${i[0]})`)[0];
    if (dabba.classList.contains("bombed")) continue;
    await new Promise((resolve) => setTimeout(resolve, 50));
    onDabbaLeftClick(dabba, (sound = false));
  }
}

// FUNCTIONS
async function gameOver() {
  PLAY_OVER();
  canvas.style.pointerEvents = "none";
  await revealAllBombs();
  await new Promise((resolve) => setTimeout(resolve, 2000));
  canvas.style.pointerEvents = "auto";
  const TEXT = document.createElement("h1");
  TEXT.innerText = "GAME OVER!";
  TEXT.style.fontFamily = "Minesweeper";
  TEXT.style.textAlign = "center";
  TEXT.style.color = "white";
  canvas.innerHTML = "";
  canvas.appendChild(TEXT);
  // Adding Retry Button
  const retryBtn = document.createElement("a");
  retryBtn.innerText = "Retry";
  retryBtn.onclick = () => {
    location.reload();
  };
  document.addEventListener("keydown", () => {
    location.reload();
  });
  retryBtn.style = `
    font-family: 'Minesweeper';
    font-size: 10px;
    cursor: pointer;
    background: none;
    outline: none;
    border: none;
    text-align: center;
    color:var(--text)`;
  canvas.append(retryBtn);
  const p = document.createElement("p");
  p.innerText = "[Press Any Key to Restart]";
  p.style = `
    font-family: 'Courier New', Courier, monospace;
    font-size: 12px;
    text-align: center;
    color:var(--text)`;
  canvas.append(p);
}

function onDabbaLeftClick(dabba, sound = true) {
  // I am loving how type unsafe everything is
  // We need to reveal the content of dabba
  if (!dabba) return;
  if (
    dabba.classList.contains("inactive") ||
    dabba.classList.contains("bombed")
  )
    return;
  dabba.className += " inactive";
  // retrieve data class and row
  const row = parseInt(dabba.getAttribute("data-row"));
  const col = parseInt(dabba.getAttribute("data-col"));
  // now we need to reveal the content inside it
  // 1 means we got nothing to lose baby
  // just calculate, how many bombs we got near it
  // we just need to check 8 boxes around it, easy!

  const val = dabbaValue(row, col);
  // IF BOMB
  if (val == -1) {
    const bomb = document.createElement("div");
    bomb.style.width = "50%";
    bomb.style.height = "50%";
    bomb.style.borderRadius = "100%";
    bomb.style.background = "var(--text)";
    dabba.innerHTML = "";
    dabba.appendChild(bomb);
    dabba.className += " bombed";
    gameOver();
    return;
  }
  // PLAY SOUND
  if (sound) {
    PLAY_POP();
  }
  if (val == 0) {
    // If Value is Zero, then reveal all the nearby squares
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        let newDabba = document.getElementsByClassName(
          `dabba-(${row + i},${col + j})`
        )[0];
        if (!newDabba) continue;
        onDabbaLeftClick(newDabba, (sound = false));
      }
    }
    return;
  }
  dabba.style.color = COLORS[val];
  dabba.innerText = val;
}

function onDabbaRightClick(dabba) {
  if (dabba.classList.contains("flagged")) {
    dabba.classList.remove("flagged");
    dabba.innerHTML = "";
  } else {
    dabba.className += " flagged";
    const flag = document.createElement("img");
    flag.src = FLAG_PATH;
    flag.width = CANVAS_SIZE / SIZE - 10;
    dabba.appendChild(flag);
  }
}
