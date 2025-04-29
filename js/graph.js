// ===============================
// Graph and Hamiltonian Path Setup
// ===============================
// The graph is constructed with a guaranteed Hamiltonian path (rooms 0 to n-1) and extra random edges,
// simulating the NP-hard characteristics as discussed in Sara (n.d.) and Mayer & Wünch (2017).

import { LEVEL_COLLECTIBLES } from "./collectibles.js";
import { ROOM_CFG } from "./cfg.js";



export class Graph {
  constructor(numRooms, levelNum) {
    this.numRooms = numRooms;
    this.levelNum = levelNum;
    this.rooms = {};
    this.edges = {};
    this.solutionPath = []; //guranteed Hamiltonian (solution) path

    this.generateRooms();
    this.generateSolutionPath();
    this.addRandomEdges();
  }

  generateRooms() {
    // Assigns a collectible to each room using CFG-generated options 
    const baseCollectibles = LEVEL_COLLECTIBLES[this.levelNum];
    if (!baseCollectibles || baseCollectibles.length === 0) {
      console.error(`No collectibles found for level ${levelNum}!`);
      return;
    }
    const extendedPool = [...baseCollectibles];
    while (extendedPool.length < this.numRooms && baseCollectibles.length > 0) {
      extendedPool.push(...baseCollectibles);
    }
    // Shuffle and assign collectibles randomly
    const shuffled = extendedPool.sort(() => Math.random() - 0.7);
    const assignedCollectibles = shuffled.slice(0, this.numRooms);
    
  
    for (let i = 0; i < this.numRooms; i++) {
      this.edges[i] = []; // adjacency list initialization

      const collectible = assignedCollectibles[i];
      const uniqueKeyID = `${Date.now()}-${Math.random()}`;

      // Store room details including its collectible key
      this.rooms[i] = {
        id: i,
        key: {
          id: uniqueKeyID,
          name: collectible.name,
          symbol: collectible.symbol,
          color: this.randomColor(),
          collected: false
        }
      };
    }
  }

  generateSolutionPath() {
    // // Create a Hamiltonian path
    const remaining = Array.from({ length: this.numRooms - 1 }, (_, i) => i + 1);
    // Shuffle remaining rooms
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    this.solutionPath = [0, ...remaining];

    //Connect each consecutive pair in the path to form a chain
    for (let i = 0; i < this.solutionPath.length - 1; i++) {
      const from = this.solutionPath[i];
      const to = this.solutionPath[i + 1];
      this.edges[from].push(to);
      this.edges[to].push(from);
    }
  }

  addRandomEdges() {
    // Add random edges for complexity
    for (let i = 0; i < this.numRooms; i++) {
      for (let j = i + 2; j < this.numRooms; j++) {
        const alreadyConnected = this.edges[i].includes(j);
        if (!alreadyConnected && Math.random() < 0.3) { //30% chance of random edge generated
          this.edges[i].push(j);
          this.edges[j].push(i);  // Add undirected edge with 30% chance
        }
      }
    }
  }

  randomColor() {
    const letters = '0123456789ABCDEF';
    return '#' + Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join('');
  }

  getHamiltonianPath() {
    return [...this.solutionPath];
  }
}
