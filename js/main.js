import { Game } from "./game.js";

const LEVELS = {
  1: { rooms: 5, theme: "ruins"},
  2: { rooms: 10, theme: "sciFi"},
  3: { rooms: 20, theme: "forest"}
};

let currentGame = null;

function startLevel(levelNum) {
  const { rooms, theme } = LEVELS[levelNum];
  document.getElementById("level-select").style.display = "none";
  document.getElementById("btn-restart").style.display = "inline-block";

  const game = new Game(rooms, theme);
  game.start();
  currentGame = game;
}

document.getElementById("btn-level-1").addEventListener("click", () => startLevel(1));
document.getElementById("btn-level-2").addEventListener("click", () => startLevel(2));
document.getElementById("btn-level-3").addEventListener("click", () => startLevel(3));

document.getElementById("btn-restart").addEventListener("click", () => {
  location.reload();
});
