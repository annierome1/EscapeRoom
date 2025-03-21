import { Game } from "./game.js";
// ====================
// Game Initialization 
// ====================
// The "Start Game" button creates a new game instance. The number of rooms can be adjusted
// to demonstrate how complexity scales exponentially (see Demaine et al., 2024).
// main.js

document.getElementById("btn-start").addEventListener("click", () => {
  const roomCountInput = document.getElementById("room-count");
  let numRooms = parseInt(roomCountInput.value, 10);
  const maxRooms = 25; // maximum allowed number of rooms

  // input is atleast 1
  if (isNaN(numRooms) || numRooms < 1) {
    alert("Please enter a valid number of rooms.");
    return;
  }
  //max limit
  if (numRooms > maxRooms) {
    alert("Maximum allowed number of rooms is " + maxRooms + ". Setting to maximum.");
    numRooms = maxRooms;
  }

  roomCountInput.style.display = "none";
  document.getElementById("btn-start").style.display = "none";
  document.getElementById("btn-restart").style.display = "inline-block";

  const game = new Game(numRooms);
  game.start();
});

//Restart Game
document.getElementById("btn-restart").addEventListener("click", () => {
  window.location.reload();

});

