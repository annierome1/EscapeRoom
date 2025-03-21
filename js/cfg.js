 // ================================
// Context-Free Grammar (CFG) Engine
// ================================
// This CFG dynamically generates room descriptions.
// See Fitch & Friederici (2012) and ShaggyDev (2022) for details on generative grammars.

//Add riddles for player to solve based on on CFG rules

export class CFG {
    constructor() {
      this.rules = {
        "S": ["You are in a {adjective} {place}."],
        "adjective": ["dimly lit", "mysterious", "ancient", "spacious"],
        "place": ["chamber", "corridor", "laboratory", "hall"]
      };
    }
  
    generate(symbol = "S") {
      if (!this.rules[symbol]) {
        return symbol;
      }
      let production = this.randomChoice(this.rules[symbol]);
      return production.replace(/{(.*?)}/g, (match, nonterm) => this.generate(nonterm));
    }
  
    randomChoice(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }
  }
  