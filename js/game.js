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
  constructor(numRooms, onLevelComplete = null, hasNextLevel = null, playerInventory = null) {
    this.graph = new Graph(numRooms);
    this.pda = new PDA();
    this.lastRoom = null;
    this.currentRoom = 0;
    this.visited = new Set();
    this.visited.add(this.currentRoom);
    this.gameOver = false;
    this.onLevelComplete = onLevelComplete;
    this.hasNextLevel = hasNextLevel;
    this.playerInventory =  playerInventory || new PlayerInventory();
    this.currentAttemptInventory = new PlayerInventory();
  

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
        const inventoryPanel = document.getElementById("player-inventory");
        if (inventoryPanel) inventoryPanel.style.display = "block";

        this.renderInventory();
        this.renderRoom();
        //draw graph upon level intialization
        drawMap(this);
      }

    renderInventory() {
        const container = document.getElementById("player-inventory");
        
        const inventoryDiv = document.getElementById("inventory-list");
        if (!container || !inventoryDiv) return;
      
        const permanentKeys = this.playerInventory.getKeys();
        const attemptKeys = this.currentAttemptInventory.getKeys();
      
        let html = "";
      
        // Always show completed inventory
        html += "<h4>Your Inventory (Completed Levels)</h4>";
        html += permanentKeys.length > 0
          ? `<div style="display: flex; flex-wrap: wrap; gap: 10px;">
               ${permanentKeys.map(this.renderKey).join("")}
             </div>`
          : "<p>No collectibles yet.</p>";
      
        // Always show current level inventory
        html += "<h4>Collectibles Found This Level</h4>";
        html += attemptKeys.length > 0
          ? `<div style="display: flex; flex-wrap: wrap; gap: 10px;">
               ${attemptKeys.map(this.renderKey).join("")}
             </div>`
          : "<p>None yet.</p>";
      
        inventoryDiv.innerHTML = html;
      }
      
      
      
      
      renderKey(key) {
        const name = key?.name || "Unknown";
        const color = key?.color || "#666";
        const symbol = key?.symbol || "❓";
        return `<div class="key-item" style="background-color: ${color}; display: inline-block; padding: 5px 10px; margin: 4px; border-radius: 5px;">
          ${symbol} ${name}
        </div>`;
      }


      levelEnd() {
        const outputDiv = document.getElementById("game-output");
        outputDiv.innerHTML = `<h2>🎯 Collectibles Found This Level</h2>`;

        const attemptKeys = this.currentAttemptInventory.getKeys();

        this.renderInventory({ showPermanent: true });
        // Hide the player inventory UI (bottom panel)
        const inventoryPanel = document.getElementById("player-inventory");
        if (inventoryPanel) inventoryPanel.style.display = "none";



        // Transfer to permanent inventory ONLY if level completed
        attemptKeys.forEach(key => this.playerInventory.collectKey(key));

        outputDiv.innerHTML += `
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${attemptKeys.map(this.renderKey).join("")}
            </div>
            <p>You have successfully completed the Hamiltonian Path by visiting every room exactly once!</p>
        `;

        if (this.hasNextLevel && this.hasNextLevel()) {
            outputDiv.innerHTML += `<button id="btn-next-level" style="margin-top: 20px;">Next Level</button>`;
            const btn = document.getElementById("btn-next-level");
            btn.addEventListener("click", () => {
            if (this.onLevelComplete) {
                this.onLevelComplete();
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
    this.currentAttemptInventory.collectKey(key);
    outputDiv.innerHTML += `
      <p><strong>You found a collectible:</strong> <span style="color: gold;">${key.symbol} ${key.name}</span></p>
    `;

    
    this.renderInventory();
    const inventoryPanel = document.getElementById("player-inventory");
    if (inventoryPanel) inventoryPanel.style.display = "block";
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
    this.currentAttemptInventory.collectKey(key);
    this.renderRoom();
  }
}

export { Game };
