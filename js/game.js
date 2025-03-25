import { Graph } from "./graph.js";
import { PDA } from "./pda.js";
import { drawMap } from "./ui.js";
import { LockPuzzle, PlayerInventory } from "./lock.js";

// ========================
// Main Game Implementation
// ========================
// The Game class manages room navigation, enforces one-way movement (like a Hamiltonian path),
// and uses the PDA for state tracking. This approach aligns with insights from Zhang & Wang (2019)
// and Mayer & Wünch (2017) on puzzle generation and state management.


class Game {
  constructor(numRooms, themeKey) {
    this.graph = new Graph(numRooms, themeKey);
    this.pda = new PDA();
    this.lastRoom = null;
    this.currentRoom = 0;
    this.visited = new Set();
    this.visited.add(this.currentRoom);
    this.gameOver = false;
    this.lockPuzzle = new LockPuzzle(this.graph.getHamiltonianPath());
    this.lockPuzzle.collectKey(this.currentRoom);
    this.inventory = new PlayerInventory();
  }

  start() {
    const mapContainer = document.getElementById("game-map");
    mapContainer.style.display = "block";
    this.renderRoom();
  }

  renderVault() {
    const outputDiv = document.getElementById("game-output");
    outputDiv.innerHTML = `<h2>🔐 Vault Summary</h2>`;

    const keys = Array.from(this.lockPuzzle.keysCollected).map(keyID => {
      const key = this.graph.rooms[keyID]?.key;
      const name = key?.name || `Key ${keyID}`;
      const color = key?.color || "#666";
      const symbol = key?.symbol || "❓";   q
    }).join("");

    outputDiv.innerHTML += `
      <div style="display: flex; flex-wrap: wrap; gap: 10px;">${keys}</div>
    `;

    const correct = this.lockPuzzle.isOrderCorrect();
    outputDiv.innerHTML += correct
      ? `<p style="color: lightgreen; font-weight: bold;">Vault unlocked! You correctly followed the Hamiltonian path!</p>`
      : `<p style="color: tomato; font-weight: bold;">Vault rejected the keys. The order was incorrect.</p>`;

    const totalPaths = this.factorial(this.graph.numRooms);
    outputDiv.innerHTML += `
      <p><strong>Did you know?</strong> There were <span style="color: gold;">${totalPaths.toLocaleString()}</span> possible paths through this graph.</p>
      <p>You found one valid Hamiltonian path.</p>
    `;
  }

  factorial(n) {
    return n <= 1 ? 1 : n * this.factorial(n - 1);
  }

  renderRoom() {
    const room = this.graph.rooms[this.currentRoom];
    const outputDiv = document.getElementById("game-output");
    outputDiv.innerHTML = `<p>${room.description}</p><div id = "game-map" style = "display: block;"></div>`;

    if (!this.lockPuzzle.keysCollected.has(this.currentRoom)) {
      outputDiv.innerHTML += `
        <p><strong>You found a key:</strong> <span style="color: gold;">${room.key.symbol} ${room.key.name}</span></p>
      `;
    } else {
      outputDiv.innerHTML += `<p><em>You already collected the key from this room.</em></p>`;
    }

    const keyListDiv = document.getElementById("key-list");
    if (keyListDiv) {
    const keys = Array.from(this.lockPuzzle.keysCollected);
    keyListDiv.innerHTML = keys.length > 0
        ? keys.map(keyID => {
            const keyData = this.graph.rooms[keyID].key;
            return `<div class="key-item" style="background-color: ${keyData.color};">
                    ${keyData.symbol} ${keyData.name}
                    </div>`;
        }).join("")
        : "<p>No keys collected yet.</p>";
    }


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
        movesHtml += `<li><button disabled>Room ${neighbor} (Locked)</button></li>`;
      } else {
        availableMoves++;
        movesHtml += `<li><button class="move-btn" data-room="${neighbor}">Go to Room ${neighbor}</button></li>`;
      }
    }
    movesHtml += "</ul>";
    outputDiv.innerHTML += movesHtml;

    outputDiv.innerHTML += `<p><em>PDA Stack:</em> [${this.pda.getStack().join(", ")}]</p>`;

    if (this.visited.size === this.graph.numRooms) {
      this.renderVault();
      this.gameOver = true;
      return;
    }

    if (availableMoves === 0) {
      outputDiv.innerHTML += `<p style="color: tomato; font-weight: bold;">You are stuck! All doors are locked. You lost the game!</p>`;
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
    this.lockPuzzle.collectKey(roomID);
    this.inventory.collectKey(key);
    this.renderRoom();
  }
}

export { Game };
