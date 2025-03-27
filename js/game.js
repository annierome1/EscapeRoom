import { Graph } from "./graph.js";
import { PDA } from "./pda.js";
import { drawMap } from './ui.js';
import { PlayerInventory } from "./inventory.js";
import { generateRoomDescription } from "./cfg.js"
import { COLLECTIBLES_POOL } from "./collectibles.js"

// ========================
// Main Game Implementation
// ========================
// The Game class manages room navigation, enforces one-way movement (like a Hamiltonian path),
// and uses the PDA for state tracking. This approach aligns with insights from Zhang & Wang (2019)
// and Mayer & Wünch (2017) on puzzle generation and state management.


class Game {
  constructor(numRooms, onLevelComplete = null, hasNextLevel = null, inventroy = null) {
    this.graph = new Graph(numRooms);
    this.pda = new PDA();
    this.lastRoom = null;
    this.currentRoom = 0;
    this.visited = new Set();
    this.visited.add(this.currentRoom);
    this.gameOver = false;
    this.onLevelComplete = onLevelComplete;
    this.hasNextLevel = hasNextLevel;
    this.inventory = new PlayerInventory();
  

  const extendedPool = [...COLLECTIBLES_POOL];
    while (extendedPool.length < numRooms) {
      extendedPool.push(...COLLECTIBLES_POOL);
    }
    const shuffled = extendedPool.sort(() => Math.random() - 0.5);
    const assignedCollectibles = shuffled.slice(0, numRooms);
    const roomIDs = Object.keys(this.graph.rooms);
    roomIDs.forEach((roomID, index) => {
        const room = this.graph.rooms[roomID];
        const key = room.key;
        room.collectible = assignedCollectibles[index];
        room.description = generateRoomDescription(key);
});

    }      

    start() {
        let mapContainer = document.getElementById("game-map");
        if (!mapContainer) {
          mapContainer = document.createElement("div");
          mapContainer.id = "game-map";
          document.getElementById("game-output").appendChild(mapContainer);
        }
        mapContainer.style.display = "block";
        this.renderRoom();
        //draw graph upon level intialization
        drawMap(this);
      }
      

  levelEnd() {
    const outputDiv = document.getElementById("game-output");
    outputDiv.innerHTML = `<h2>Collectibles Found!</h2>`;

    const keys = this.inventory.getKeys().map(collectedKey => {
        const name = collectedKey?.name || "Unknown Key";
        const color = collectedKey?.color || "#666";
        const symbol = collectedKey?.symbol || "❓";
        return `<div class="key-item" style="background-color: ${color};">
                  ${symbol} ${name}
                </div>`;
      }).join("");
      

    outputDiv.innerHTML += `<div style="display: flex; flex-wrap: wrap; gap: 10px;">${keys}</div>`;
    outputDiv.innerHTML += `<p>You have successfully completed the Hamiltonian Path by visiting every room exactly once!</p>`;
 

  
  if (this.hasNextLevel && this.hasNextLevel()) {
    outputDiv.innerHTML += `
      <button id="btn-next-level" style="margin-top: 20px;">Next Level</button>
    `;
    const btn = document.getElementById("btn-next-level");
    btn.addEventListener("click", () => {
      if (this.onLevelComplete) {
        this.onLevelComplete(this.inventory); //Pass player inventory to next level
      }
    });
  } else {
    outputDiv.innerHTML += `<p style="margin-top: 20px;">🎉 You've completed all levels!</p>`;
  }
}



renderRoom() {
    const room = this.graph.rooms[this.currentRoom];
    const outputDiv = document.getElementById("game-output");
    outputDiv.innerHTML = `<p>${room.description}</p><div id="game-map" style="display: block;"></div>`;

    const key = room.key;
    outputDiv.innerHTML += `
      <p><strong>You found a collectible:</strong> <span style="color: gold;">${key.symbol} ${key.name}</span></p>
    `;

    this.inventory.collectKey(key);

    const existingMap = document.getElementById("game-map");
    if (!existingMap) {
      const mapDiv = document.createElement("div");
      mapDiv.id = "game-map";
      mapDiv.style.display = "block";
      outputDiv.appendChild(mapDiv);
    }

    let movesHtml = "<p>Available Exits:</p><ul>";
    let availableMoves = 0;
    for (const neighbor of this.graph.edges[this.currentRoom]) {
      if (this.visited.has(neighbor)) {
        movesHtml += `<li><button disabled>Room ${neighbor} (Visited)</button></li>`;
      } else {
        availableMoves++;
        movesHtml += `<li><button class="move-btn" data-room="${neighbor}">Go to Room ${neighbor}</button></li>`;
      }
    }
    movesHtml += "</ul>";
    outputDiv.innerHTML += movesHtml;

    outputDiv.innerHTML += `<p><em>PDA Stack:</em> [${this.pda.getStack().join(", ")}]</p>`;

    if (this.visited.size === this.graph.numRooms) {
      this.levelEnd();
      this.gameOver = true;
      return;
    }

    if (availableMoves === 0) {
      outputDiv.innerHTML += `<p style="color: tomato; font-weight: bold;">You are stuck! All doors are visited. You lost the game!</p>`;
      this.gameOver = true;
      return;
    }

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
    if (!this.graph.edges[this.currentRoom].includes(roomID) || this.visited.has(roomID)) {
      alert("Invalid move!");
      return;
    }
    this.pda.transition(`move-${this.currentRoom}->${roomID}`);
    this.lastRoom = this.currentRoom;
    this.currentRoom = roomID;
    this.visited.add(roomID);
    const key = this.graph.rooms[this.currentRoom].key;
    this.inventory.collectKey(key);
    this.renderRoom();
  }
}

export { Game };
