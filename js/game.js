//game.js
import { Graph } from "./graph.js";
import { PDA } from "./pda.js";
import { drawMap } from './ui.js';
import { PlayerInventory } from "./inventory.js";
import { generateRoomDescription } from "./cfg.js"
import { LEVEL_COLLECTIBLES } from "./collectibles.js"
import { LEVEL_THEMES } from "./levelThemes.js";

// ========================
// Main Game Implementation
// ========================
// The Game class manages room navigation, enforces one-way movement (like a Hamiltonian path),
// and uses the PDA for state tracking. This approach aligns with insights from Zhang & Wang (2019)
// and Mayer & Wünch (2017) on puzzle generation and state management.


class Game {
    constructor(numRooms, levelNum, onLevelComplete = null, hasNextLevel = null, playerInventory = null) {
      this.numRooms = numRooms;
      this.levelNum = levelNum;  
      this.onLevelComplete = onLevelComplete;
      this.hasNextLevel = hasNextLevel;
      this.graph = new Graph(this.numRooms, this.levelNum);
      this.pda = new PDA();
      this.lastRoom = null;
      this.currentRoom = 0;
      this.visited = new Set([this.currentRoom]);
      this.gameOver = false;
      //// Generate descriptions for each room based on collectibles
      const roomIDs = Object.keys(this.graph.rooms);
        roomIDs.forEach((roomID) => {
        const room = this.graph.rooms[roomID];
        const key = room.key;
        room.description = generateRoomDescription(key, this.levelNum);
        });
      this.playerInventory = playerInventory || new PlayerInventory();
      this.currentAttemptInventory = new PlayerInventory();
      
    }
  
    start() {
      if (![1, 2, 3].includes(this.levelNum)) {
        console.error(`Invalid levelNum '${this.levelNum}'. Must be 1, 2, or 3.`);
        return;
      }
      let mapContainer = document.getElementById("game-map");
        if (!mapContainer) {
            mapContainer = document.createElement("div");
            mapContainer.id = "game-map";
            document.getElementById("game-output").appendChild(mapContainer);
        }
        mapContainer.style.display = "block";

        const inventoryPanel = document.getElementById("player-inventory");
        if (inventoryPanel) inventoryPanel.style.display = "block";

        const restartControls = document.getElementById("controls");
        if (restartControls) restartControls.style.display = "block";

        const restartLevelBtn = document.getElementById("btn-restart-level");
        if (restartLevelBtn) restartLevelBtn.style.display = "inline-block";

        const restartGameBtn = document.getElementById("btn-restart-game");
        if (restartGameBtn) restartGameBtn.style.display = "inline-block";

      this.renderInventory();
      this.renderRoom();
        //Intialize map at the start of each level
      drawMap(this);
    }
  
    renderInventory() {
        const container = document.getElementById("player-inventory");
        
        const inventoryDiv = document.getElementById("inventory-list");
        if (!container || !inventoryDiv) return;
      
        const permanentKeys = this.playerInventory.getKeys() || [];
        const attemptKeys = this.currentAttemptInventory.getKeys() || [];
      
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
      // HTML representation of a key
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
      
        // Merge current level keys into permanent inventory
        const attemptKeys = this.currentAttemptInventory.getKeys();
        attemptKeys.forEach(key => this.playerInventory.collectKey(key));
      
        // Re-render inventory
        this.renderInventory();
        const inventoryPanel = document.getElementById("player-inventory");
        if (inventoryPanel) inventoryPanel.style.display = "none";
      
        // Show current level's collected keys
        outputDiv.innerHTML += `
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${attemptKeys.map(this.renderKey).join("")}
          </div>
          <p>You have successfully completed the path!</p>
        `;
      
        // Show map of the path taken
        const levelMap = document.createElement("div");
        levelMap.id = "level-map";
        levelMap.style.marginTop = "20px";
        outputDiv.appendChild(levelMap);
        drawMap(this, "level-map");
      
        if (this.hasNextLevel && this.hasNextLevel()) {
          outputDiv.innerHTML += `<button id="btn-next-level" style="margin-top: 20px;">Next Level</button>`;
          const btn = document.getElementById("btn-next-level");
          btn.addEventListener("click", () => {
            if (this.onLevelComplete) {
              this.onLevelComplete(this.playerInventory);
            }
          });
        } else {
          const finalKeys = this.playerInventory.getKeys();
          const finalCollectiblesHtml = finalKeys.length > 0
            ? `<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
                 ${finalKeys.map(k => this.renderKey(k)).join("")}
               </div>`
            : "<p>No collectibles gathered overall.</p>";
      
          outputDiv.innerHTML += `
            <h3 style="margin-top: 20px;">All Collectibles You've Gathered</h3>
            ${finalCollectiblesHtml}
            <p style="margin-top: 20px;">You've completed all levels!</p>
          `;
        }
      }
      
      
      
      
      renderRoom() {
        // Get the main output container.
        const outputDiv = document.getElementById("game-output");
      
        // Create or retrieve the room description container and insert it at the top.
        let roomDescDiv = document.getElementById("room-description");
        if (!roomDescDiv) {
          roomDescDiv = document.createElement("div");
          roomDescDiv.id = "room-description";
          // Insert roomDescDiv as the first child of outputDiv.
          outputDiv.insertBefore(roomDescDiv, outputDiv.firstChild);
        } else {
          // If it exists, move it to the top.
          outputDiv.insertBefore(roomDescDiv, outputDiv.firstChild);
        }
      
        // Create or retrieve the collectible info container.
        let collectibleDiv = document.getElementById("collectible-info");
        if (!collectibleDiv) {
          collectibleDiv = document.createElement("div");
          collectibleDiv.id = "collectible-info";
          outputDiv.appendChild(collectibleDiv);
        }
      
        // Create or retrieve the exits container.
        let exitsDiv = document.getElementById("exits");
        if (!exitsDiv) {
          exitsDiv = document.createElement("div");
          exitsDiv.id = "exits";
          outputDiv.appendChild(exitsDiv);
        }
      
        // Create or retrieve the PDA stack container.
        let pdaDiv = document.getElementById("pda-stack");
        if (!pdaDiv) {
          pdaDiv = document.createElement("div");
          pdaDiv.id = "pda-stack";
          outputDiv.appendChild(pdaDiv);
        }
      
        // Get current room.
        const room = this.graph.rooms[this.currentRoom];
      
        // Update room description.
        roomDescDiv.innerHTML = `<p>${room.description || ""}</p>`;
      
        // Collect the room's key (collectible).
        const key = room.key;
        this.currentAttemptInventory.collectKey(key);
        collectibleDiv.innerHTML = `
          <p><strong>You found a collectible:</strong>
            <span style="color: gold;">${key.symbol} ${key.name}</span>
          </p>`;
      
        // Re-render inventory.
        this.renderInventory();
      
        // Build available exits HTML.
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
        exitsDiv.innerHTML = movesHtml;
      
        // Update PDA stack info.
        pdaDiv.innerHTML = `<p><em>PDA Stack:</em> [${this.pda.getStack().join(", ")}]</p>`;
      
        // Check for game end conditions.
        if (this.visited.size === this.graph.numRooms) {
          this.levelEnd();
          this.gameOver = true;
          return;
        }
        if (availableMoves === 0) {
          exitsDiv.innerHTML += `<p style="color: tomato; font-weight: bold;">
            You are stuck! All doors are visited. You lost the game!</p>`;
          this.gameOver = true;
          return;
        }
      
        // Wire up the exit buttons.
        document.querySelectorAll(".move-btn").forEach(button => {
          button.addEventListener("click", (e) => {
            const nextRoom = parseInt(e.target.getAttribute("data-room"));
            this.moveToRoom(nextRoom);
            // Redraw the map after moving.
            drawMap(this);
          });
        });
      }
      
      
      
  
    moveToRoom(roomID) {
        // Handles room transitions and state updates
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