import { CFG } from "./cfg.js"; // Ensure correct import
import { THEMES, artifactSymbolMap } from "./symbols.js";
// ===============================
// Graph and Hamiltonian Path Setup
// ===============================
// The graph is constructed with a guaranteed Hamiltonian path (rooms 0 to n-1) and extra random edges,
// simulating the NP-hard characteristics as discussed in Sara (n.d.) and Mayer & Wünch (2017).


export class Graph {
  constructor(numRooms, themeKey = "ruins") {
    this.numRooms = numRooms;
    this.theme = THEMES[themeKey];
    this.rooms = {};   // Room details
    this.edges = {};   // Adjacency list for room connections
    this.solutionPath = []; // The guaranteed Hamiltonian (solution) path
    this.cfg = new CFG(this.theme.cfgRules);
    this.generateRooms();
    this.generateSolutionPath();
    this.addRandomEdges();
  }

  generateRooms() {
    const usedWords = [...this.theme.artifactWords];
    for (let i = 0; i < this.numRooms; i++) {
      const word = usedWords[i % usedWords.length];
      const symbol = artifactSymbolMap[word] || "❓";
      const description = this.cfg.generate();

      this.rooms[i] = {
        id: i,
        description,
        key: {
          id: i,
          name: word.charAt(0).toUpperCase() + word.slice(1),
          symbol,
          color: this.randomColor(),
          collected: false
        }
      };
      this.edges[i] = [];
    }
  }

  generateSolutionPath() {
    for (let i = 0; i < this.numRooms; i++) {
      this.solutionPath.push(i);
      if (i < this.numRooms - 1) {
        this.edges[i].push(i + 1);
        this.edges[i + 1].push(i);
      }
    }
  }

  addRandomEdges() {
    for (let i = 0; i < this.numRooms; i++) {
      for (let j = i + 2; j < this.numRooms; j++) {
        const alreadyConnected = this.edges[i].includes(j);
        if (!alreadyConnected && Math.random() < 0.25) {
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