//main.js
import { Game } from "./game.js";
import { setupHomepage } from './home.js';
import { PlayerInventory } from "./inventory.js";

let currentLevel = 1;
let currentGame = null;
let playerInventory = null;

const LEVELS = {
  1: { rooms: 5 },
  2: { rooms: 10 },
  3: { rooms: 20 }
};

const hasNextLevel = () => LEVELS[currentLevel + 1] !== undefined;
//helper function to make sure map container exisits
function ensureGameMapExists() {
  let mapDiv = document.getElementById("game-map");
  if (!mapDiv) {
    console.warn("#game-map not found. Creating a new container.");
    const gameOutput = document.getElementById("game-output");
    mapDiv = document.createElement("div");
    mapDiv.id = "game-map";
    gameOutput.appendChild(mapDiv);
  }
  return mapDiv;
}

//helper function to update background image based on level
function updateBackgroundImage(levelNum) {
  const mapDiv = ensureGameMapExists();
  const bgUrl = `./images/level${levelNum}.jpeg`;
  console.log(`[LEVEL ${levelNum}] Setting background to:`, bgUrl);
  mapDiv.style.backgroundImage = `url('${bgUrl}')`;
  mapDiv.style.backgroundSize = "cover";
  mapDiv.style.backgroundPosition = "center";
  mapDiv.style.backgroundRepeat = "no-repeat";
}

function startLevel(levelNum) {
  currentLevel = levelNum;
  const { rooms } = LEVELS[levelNum];

  // update the background image for this level.
  updateBackgroundImage(levelNum);

  if (!playerInventory) {
    console.log("[INIT] Creating new playerInventory");
    playerInventory = new PlayerInventory();
  } else {
    console.log("[LOAD] Reusing existing playerInventory");
  }

  console.log(`[START LEVEL] ${levelNum} with ${rooms} rooms. Inventory:`, playerInventory.getKeys());
  const game = new Game(rooms, levelNum, onLevelComplete, hasNextLevel, playerInventory);
  game.start();
  currentGame = game;
}

function onLevelComplete(updatedInventory) {
  playerInventory = updatedInventory;
  if (hasNextLevel()) {
    // remove previous level summary
    const outputDiv = document.getElementById("game-output");
    outputDiv.innerHTML = "";

    startLevel(currentLevel + 1);
  } else {
    console.log("🎉 All levels complete!");
  }
}


function restartLevel() {
  startLevel(currentLevel);
}

function restartGame() {
  playerInventory = null;
  startLevel(1);
}

window.onload = () => {
  setupHomepage(() => {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    requestAnimationFrame(() => {
      startLevel(1); 
    });
  });

  document.getElementById("btn-restart-level").addEventListener("click", () => {
    restartLevel();
  });

  document.getElementById("btn-restart-game").addEventListener("click", () => {
    restartGame();
  });
};
