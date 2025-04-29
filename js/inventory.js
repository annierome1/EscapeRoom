export class PlayerInventory {
  constructor(existingKeys = []) {
    this.keys = [...existingKeys]; 
  }
  //unique key
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
