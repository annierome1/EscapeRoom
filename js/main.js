import { Game } from "./game.js";
import { PlayerInventory } from "./inventory.js";

let currentLevel = 1;
let currentGame = null;
let playerInventory = null;

const LEVELS = {
  1: { rooms: 5 },
  2: { rooms: 10 },
  3: { rooms: 20 }
};

function startLevel(levelNum) {
  currentLevel = levelNum;
  const { rooms } = LEVELS[levelNum];

  const levelSelect = document.getElementById("level-select");
  if (levelSelect) levelSelect.style.display = "none";

  document.getElementById("btn-restart-level").style.display = "inline-block";
  document.getElementById("btn-restart-game").style.display = "inline-block";

  const hasNextLevel = () => LEVELS[currentLevel + 1] !== undefined;


  if (!playerInventory) {
    playerInventory = new PlayerInventory();
    console.log("[INIT] Created new playerInventory");
  } else {
    console.log("[LOAD] Reusing existing playerInventory");
  }

  console.log("[START LEVEL]", levelNum, "Current Inventory:", playerInventory.getKeys());
  

  const game = new Game(rooms, onLevelComplete, hasNextLevel, playerInventory);
  game.start();
  currentGame = game;
}

function onLevelComplete(playerInventory) {
  startLevel(currentLevel + 1);
}


function restartLevel() {
  startLevel(currentLevel);
}

function restartGame() {
  playerInventory = null; // Reset inventory for new game
  startLevel(1);
}


window.onload = () => {
  // Start Game button
  document.getElementById("btn-start-game").addEventListener("click", () => {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    startLevel(1);
  });

  document.getElementById("btn-restart-level").addEventListener("click", () => {
    restartLevel();
  });

  document.getElementById("btn-restart-game").addEventListener("click", () => {
    restartGame();
  });
};


