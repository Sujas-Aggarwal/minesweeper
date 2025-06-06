// GLOBAL VARIABLES
let CANVAS_SIZE = 450; // in Pixels
const SIZE = 14; // Number of rows and cols
const COLORS = [
  "green",
  "red",
  "blue",
  "purple",
  "pink",
  "orange",
  "darkblue",
  "darkgreen",
];

// PATHS
const FLAG_PATH = "/assets/flag.svg";
const BOMB_PATH = "/assets/bomb.svg";
const POP_PATH = "/assets/pop.wav";
const OVER_PATH = "/assets/over.wav";

// SOUNDS
const SOUND_POP = new Audio(POP_PATH);
function PLAY_POP() {
  SOUND_POP.currentTime = 0;
  SOUND_POP.play();
}
const SOUND_OVER = new Audio(OVER_PATH);
function PLAY_OVER(){
    SOUND_OVER.currentTime = 0;
    SOUND_OVER.play();
}

// re-render for small screen sizes
if (window.innerWidth < 600) {
  CANVAS_SIZE = 300;
}