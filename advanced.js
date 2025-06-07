const mineGenerator = document.getElementById("mine-generator");
const mineSolver = document.getElementById("mine-solver");
const codeEditor = document.getElementById("code-editor-box");

let GENERATOR_CODE = ` 
    // return true if you need to place bomb there
    // else return false
    // row and col are 2 variables you have, (0 indexed)
    if (row==0 && col==0)
    {return false};
    return Math.random()<0.2 ?  true : false;
    `;

let SOLVER_CODE = "";
let customBombGenerator = new Function("row", "col", GENERATOR_CODE);


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
        // Here Solver Code Execution
    }
    else if (STATE==1){
        customBombGenerator = new Function("row", "col", GENERATOR_CODE);
        generateBombs();
    }
}