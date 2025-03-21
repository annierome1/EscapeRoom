import { CFG } from "./cfg.js"; // Ensure correct import
// ===============================
// Graph and Hamiltonian Path Setup
// ===============================
// The graph is constructed with a guaranteed Hamiltonian path (rooms 0 to n-1) and extra random edges,
// simulating the NP-hard characteristics as discussed in Sara (n.d.) and Mayer & Wünch (2017).
class Graph {
  constructor(numRooms) {
    this.numRooms = numRooms;
    this.rooms = {};   // Room details
    this.edges = {};   // Adjacency list for room connections
    this.solutionPath = []; // The guaranteed Hamiltonian (solution) path
    this.cfg = new CFG();
    this.generateRooms();
    this.generateSolutionPath();
    this.addRandomEdges();
  }
  generateRooms() {
    // Create room objects with CFG-generated descriptions.
    for (let i = 0; i < this.numRooms; i++) {
      this.rooms[i] = {
        id: i,
        description: this.cfg.generate()
      };
      this.edges[i] = [];
    }
  }
  generateSolutionPath() {
    // Create a linear Hamiltonian path from room 0 to room numRooms-1.
    for (let i = 0; i < this.numRooms; i++) {
      this.solutionPath.push(i);
      if (i < this.numRooms - 1) {
        this.edges[i].push(i + 1);
        this.edges[i + 1].push(i);
      }
    }
  }
  addRandomEdges() {
    // Add extra edges to increase the complexity of the puzzle.
    // This extra connectivity mirrors NP-hard problem characteristics.
    for (let i = 0; i < this.numRooms; i++) {
      for (let j = i + 2; j < this.numRooms; j++) {
        if (Math.random() < 0.3) { // 30% chance to add an extra connection
          if (!this.edges[i].includes(j)) {
            this.edges[i].push(j);
            this.edges[j].push(i);
          }
        }
      }
    }
  }
}
export { Graph };