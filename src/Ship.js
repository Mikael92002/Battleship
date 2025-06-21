export class Ship {
  #length;
  #sunk;
  #hits;

  constructor(length) {
    this.#length = length;
    this.#hits = 0;
    this.#sunk = false;
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

  sinkShip() {
    this.#sunk = true;
  }

  getLength() {
    return this.#length;
  }
}
