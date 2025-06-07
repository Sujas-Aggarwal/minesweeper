const mineGenerator = document.getElementById("mine-generator");
const mineSolver = document.getElementById("mine-solver");
const codeEditor = document.getElementById("code-editor-box");
const advBtn = document.getElementById("advanced-mode");
const advDiv = document.getElementById("code-editor");
advBtn.onclick = () =>{
    advDiv.classList.toggle("hidden");
}
let GENERATOR_CODE = ` 
    // return true if you need to place bomb there
    // else return false
    // row and col are 2 variables you have, (0 indexed)
    if (row==0 && col==0)
    {return false};
    return Math.random()<0.2 ?  true : false;
    `;
let SOLVER_CODE = `
    // just return a ${SIZE}X${SIZE} Matrix with true or false
    // Here true represents we need to dig there and false means no digging i.e there is bomb
    let matrix = [];
    for (let i =0; i< ${SIZE} ; i++){
        let newArr = Array(${SIZE}).fill(false);
        matrix.push(newArr);
    }
    matrix[0][2] = true;
    return matrix;
`;
codeEditor.innerText = SOLVER_CODE;
let customBombGenerator = new Function("row", "col", GENERATOR_CODE);
let customSolver = new Function(SOLVER_CODE);


let STATE = 0;

mineGenerator.onclick = () => {
  handleStateChange(1);
};
mineSolver.onclick = () => {
  handleStateChange(0);
};

function handleStateChange(state) {
  STATE = state;
  switch (STATE) {
    case 0:
      codeEditor.innerText = SOLVER_CODE;
      mineSolver.style.zIndex = 5;
      mineGenerator.style.zIndex = 2;
      break;
    case 1:
      codeEditor.innerText = GENERATOR_CODE;
      mineGenerator.style.zIndex = 5;
      mineSolver.style.zIndex = 2;
      break;
  }
}

codeEditor.addEventListener("input", (e) => {
  const newVal = codeEditor.innerText;
  switch (STATE) {
    case 0:
      SOLVER_CODE = newVal;
      break;
    case 1:
      GENERATOR_CODE = newVal;
      break;
  }
});

const executeButton  = document.getElementById("execute-button");
executeButton.onclick = () =>{
    if (STATE == 0){
        customSolver = new Function(SOLVER_CODE);
        solve();
    }
    else if (STATE==1){
        customBombGenerator = new Function("row", "col", GENERATOR_CODE);
        generateBombs();
    }
}

async function solve(){
    let matrix = customSolver();
    for (let i = 0;i < SIZE; i++){
        for (let j = 0; j< SIZE; j++){ 
            // very very easy peasy
            // if true then just click on it!
            if (matrix[i][j]==true){
                const dabba = document.getElementsByClassName(`dabba-(${i},${j})`)[0];
                if (!dabba) return;
                onDabbaLeftClick(dabba);
                await new Promise((resolve)=>setTimeout(resolve,100));
            }
        }
    }
}