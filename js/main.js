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

function startLevel(levelNum) {
  currentLevel = levelNum;
  const { rooms } = LEVELS[levelNum];

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
  playerInventory = updatedInventory; // Carry over inventory
  if (hasNextLevel()) {
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
    startLevel(1);
  });

  document.getElementById("btn-restart-level").addEventListener("click", () => {
    restartLevel();
  });

  document.getElementById("btn-restart-game").addEventListener("click", () => {
    restartGame();
  });
};
