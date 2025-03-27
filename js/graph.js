import { COLLECTIBLES_POOL } from "./collectibles.js";
import { generateRoomDescription } from "./cfg.js";
// ===============================
// Graph and Hamiltonian Path Setup
// ===============================
// The graph is constructed with a guaranteed Hamiltonian path (rooms 0 to n-1) and extra random edges,
// simulating the NP-hard characteristics as discussed in Sara (n.d.) and Mayer & Wünch (2017).


export class Graph {
  constructor(numRooms) {
    this.numRooms = numRooms;
    this.rooms = {};   // Room details
    this.edges = {};   // Adjacency list for room connections
    this.solutionPath = []; // The guaranteed Hamiltonian (solution) path
    this.generateRooms();
    this.generateSolutionPath();
    this.addRandomEdges();
  }

  generateRooms() {
    const extendedPool = [...COLLECTIBLES_POOL];
    while (extendedPool.length < this.numRooms) {
      extendedPool.push(...COLLECTIBLES_POOL);
    }
    const shuffled = extendedPool.sort(() => Math.random() - 0.5);
    const assignedCollectibles = shuffled.slice(0, this.numRooms);

    for (let i = 0; i < this.numRooms; i++) {
      const collectible = assignedCollectibles[i];
      const uniqueKeyID = `${Date.now()}-${Math.random()}`; // Globally unique string ID
    
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
      this.edges[i] = [];
    }
  }

  generateSolutionPath() {
    // Create an array of room indices starting from 1 to numRooms - 1 (excluding 0)
    const remaining = Array.from({ length: this.numRooms - 1 }, (_, i) => i + 1);
  
    // Shuffle the remaining nodes
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
  
    // Prepend 0 to ensure the path starts at room 0 (possibly change to allow user to choose which room they start at)
    this.solutionPath = [0, ...remaining];
  
    // Create edges along the Hamiltonian path
    for (let i = 0; i < this.solutionPath.length - 1; i++) {
      const from = this.solutionPath[i];
      const to = this.solutionPath[i + 1];
      this.edges[from].push(to);
      this.edges[to].push(from);
    }
  }
  
  

  addRandomEdges() {
    for (let i = 0; i < this.numRooms; i++) {
      for (let j = i + 2; j < this.numRooms; j++) {
        const alreadyConnected = this.edges[i].includes(j);
        if (!alreadyConnected && Math.random() < 0.4) {
          this.edges[i].push(j);
          this.edges[j].push(i);
        }
      }
    }
  }

  randomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getHamiltonianPath() {
    return [...this.solutionPath];
  }
}
