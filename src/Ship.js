export class Ship {
  #length;
  #sunk;
  #hits;

  constructor(length) {
    this.#length = length;
    this.#hits = 0;
  }

  hit() {
    if (this.#hits < this.#length) {
      this.#hits++;
    }
  }

  isSunk() {
    return this.#hits === this.#length;
  }

  getHits() {
    return this.#hits;
  }

  getLength() {
    return this.#length;
  }
}
