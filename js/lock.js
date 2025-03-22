export class LockPuzzle {
    constructor(correctOrder) {
      this.correctOrder = correctOrder; 
      this.playerOrder = [];
      this.keysCollected = new Set();
    }
  
    collectKey(roomId) {
      if (!this.keysCollected.has(roomId)) {
        this.keysCollected.add(roomId);
        this.playerOrder.push(roomId);
      }
    }
  
    isComplete(roomCount) {
      return this.playerOrder.length === roomCount;
    }
  
    isOrderCorrect() {
      return JSON.stringify(this.playerOrder) === JSON.stringify(this.correctOrder);
    }
  
    reset() {
      this.playerOrder = [];
      this.keysCollected.clear();
    }
  } 

