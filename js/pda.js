// =======================
// Pushdown Automata (PDA)
// =======================
// Inspired by Garfinkel (2020) on using PDA for managing state transitions in games.
export class PDA {
    constructor() {
      this.state = "start";
      this.stack = [];
    }
  
    push(symbol) {
      this.stack.push(symbol);
    }
  
    pop() {
      return this.stack.pop();
    }
  
    transition(input) {
      this.push(input);
      this.state = "processing";
    }
  
    getStack() {
      return this.stack.slice(); // Return a copy for display
    }
  }
  