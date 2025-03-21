import { Graph } from "./graph.js";
import { PDA } from "./pda.js";
import { drawMap } from "./ui.js";
// ========================
// Main Game Implementation
// ========================
// The Game class manages room navigation, enforces one-way movement (like a Hamiltonian path),
// and uses the PDA for state tracking. This approach aligns with insights from Zhang & Wang (2019)
// and Mayer & Wünch (2017) on puzzle generation and state management.

class Game {
    constructor(numRooms) {
      this.graph = new Graph(numRooms);
      this.pda = new PDA();
      this.currentRoom = 0; // Start at room 0.
      this.visited = new Set();
      this.visited.add(this.currentRoom);
      this.gameOver = false;
    }
    start() {
      const mapContainer = document.getElementById("game-map");
      mapContainer.style.display = "block";
      this.renderRoom();
    }
    renderRoom() {
      const room = this.graph.rooms[this.currentRoom];
      const outputDiv = document.getElementById("game-output");
      outputDiv.innerHTML = `<p>${room.description}</p>
      <div id = "game-map" style = "display: block;"></div>`;

      const existingMap = document.getElementById("game-map");
      if(!existingMap){
        const mapDiv = document.createElement("div");
        mapDiv.id = "game-map";
        mapDiv.style.display = "block";
        outputDiv.appendChild(mapDiv);
      }
      
      // Build list of available moves.
      let movesHtml = "<p>Available Exits:</p><ul>";
      let availableMoves = 0;
      for (const neighbor of this.graph.edges[this.currentRoom]) {
        if (this.visited.has(neighbor)) {
          // The door to this room is locked.
          movesHtml += `<li><button disabled>Room ${neighbor} (Locked)</button></li>`;
        } else {
          availableMoves++;
          movesHtml += `<li><button class="move-btn" data-room="${neighbor}">Go to Room ${neighbor}</button></li>`;
        }
      }
      movesHtml += "</ul>";
      outputDiv.innerHTML += movesHtml;
      
      // Show PDA stack for educational purposes.
      outputDiv.innerHTML += `<p><em>PDA Stack:</em> [${this.pda.getStack().join(", ")}]</p>`;

      // Check for win or loss conditions.
      if (this.visited.size === this.graph.numRooms) {
        outputDiv.innerHTML += `<p style="color: lightgreen; font-weight: bold;">Congratulations! You have visited all the rooms and escaped!</p>`;
        this.gameOver = true;
        return;
      } else if (availableMoves === 0) {
        outputDiv.innerHTML += `<p style="color: tomato; font-weight: bold;">You are stuck! All doors are locked. You lost the game!</p>`;
        this.gameOver = true;
        return;
      }
      
      // Attach event listeners for available moves.
      document.querySelectorAll(".move-btn").forEach(button => {
        button.addEventListener("click", (e) => {
          const nextRoom = parseInt(e.target.getAttribute("data-room"));
          this.moveToRoom(nextRoom);
          drawMap(this);
        }); 
      });
      
    }
    moveToRoom(roomID) {
      if (this.gameOver) return;
      // Validate move: door must exist and lead to an unvisited room.
      if (!this.graph.edges[this.currentRoom].includes(roomID) || this.visited.has(roomID)) {
        alert("Invalid move!");
        return;
      }
      // Update PDA to record the move.
      this.pda.transition(`move-${this.currentRoom}->${roomID}`);
      this.currentRoom = roomID;
      this.visited.add(roomID);
      // If all rooms are visited, notify win.
      if (this.visited.size === this.graph.numRooms) {
        alert("Congratulations! You have navigated through all the rooms!");
      }
      this.renderRoom();
    }
  }
export { Game };