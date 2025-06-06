// HTML LINKING
const canvas = document.querySelector("#game-canvas");
canvas.style.width = `${CANVAS_SIZE}px`;
canvas.style.height = `${CANVAS_SIZE}px`;

// GAME BOARD JS SETUP
let bombs = new Map();
bombs.set("1,2", true);

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
      dabba.className = `dabba ${(i + j) % 2 == 0 ? "alternate" : ""}`;
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

// FUNCTIONS
async function gameOver() {
    PLAY_OVER();
    canvas.style.pointerEvents = "none";
    await new Promise((resolve)=>setTimeout(resolve,4000));
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
    retryBtn.onclick = () =>{
        location.reload();
    }
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
}   

function onDabbaLeftClick(dabba) {
  // I am loving how type unsafe everything is
  // We need to reveal the content of dabba
  dabba.className += " inactive";
  // retrieve data class and row
  const row = parseInt(dabba.getAttribute("data-row"));
  const col = parseInt(dabba.getAttribute("data-col"));
  // now we need to reveal the content inside it
  // 1 means we got nothing to lose baby
  // just calculate, how many bombs we got near it
  // we just need to check 8 boxes around it, easy!
  let val = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (bombs.has(`${row + i},${col + j}`)) {
        val++;
        if (i == 0 && j == 0) {
          val = -1;
          break;
        }
      }
    }
  }
  // IF BOMB
  if (val==-1){
    const bomb = document.createElement("div");
    bomb.style.width = "50%";
    bomb.style.height = "50%";
    bomb.style.borderRadius = "100%";
    bomb.style.background = "var(--text)";
    dabba.appendChild(bomb);
    dabba.className+=" bombed";
    gameOver();
    return;
  }
  // PLAY SOUND
  PLAY_POP();
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
    flag.width = CANVAS_SIZE/SIZE - 10;
    console.log(flag)
    dabba.appendChild(flag);
  }
}
