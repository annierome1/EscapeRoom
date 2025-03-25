export class LockPuzzle {
    constructor(correctOrder) {
      this.correctOrder = correctOrder; 
      this.playerOrder = [];
      this.keysCollected = new Set();
      this.keys = [];
    }
  
    collectKey(roomId) {
      if (!this.keysCollected.has(roomId)) {
        this.keysCollected.add(roomId);
        this.playerOrder.push(roomId);
      }
    }
  
    getCollectedKeyOrder() {
      return this.playerOrder;
    }
  
    getCollectedKeySet() {
      return Array.from(this.keysCollected);
    }
  
    isComplete(roomCount) {
      return this.keysCollected.size === roomCount;
    }
  
    isOrderCorrect() {
      return JSON.stringify(this.playerOrder) === JSON.stringify(this.correctOrder);
    }
  
    reset() {
      this.playerOrder = [];
      this.keysCollected.clear();
      this.keys = [];
    }
  } 

  export class PlayerInventory {
    constructor() {
      this.keys = [];
    }
  
    collectKey(key) {
      if (!this.keys.some(k => k.id === key.id)) {
        this.keys.push(key);
      }
    }
  
    getKeys() {
      return this.keys;
    }
  
    hasKey(id) {
      return this.keys.some(k => k.id === id);
    }
  
    reset() {
      this.keys = [];
    }
  }
  