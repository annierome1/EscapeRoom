import { Game } from "./game.js";

let currentGame = null;

window.addEventListener("DOMContentLoaded", () => {
  // Hook restart button
  document.getElementById("btn-restart").addEventListener("click", () => {
    window.location.reload();
  });

  // Hook level select
  window.startLevel = function(level) {
    let numRooms = level === 1 ? 5 : level === 2 ? 10 : 20;

    document.getElementById("level-select").style.display = "none";
    document.getElementById("game-output").style.display = "block";
    document.getElementById("btn-restart").style.display = "inline-block";

    currentGame = new Game(numRooms);
    currentGame.start();
  };
});
