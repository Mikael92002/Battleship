import { Ship } from "./Ship.js";

export class Gameboard {
  #grid;
  #coordinatesHit;

  constructor() {
    this.#grid = [];
    this.#coordinatesHit = [];

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        this.#grid.push([i, j, null]);
      }
    }
  }

  getGrid() {
    return this.#grid;
  }

  placeShip(ship, orientation, coordinates) {
    //convert coordinates to index:
    let index = this.coordinatesToIndex(coordinates);

    if (orientation === "x") {
      for (let i = ship.getLength(); i > 0; i--) {
        this.#grid[index][2] = ship;
        index = index + 10;
      }
    } else if (orientation === "y") {
      for (let i = ship.getLength(); i > 0; i--) {
        this.#grid[index][2] = ship;
        index++;
      }
    }
  }

  receiveAttack(coordinates) {
    let alreadyHit = this.includesCoordinates(coordinates);
    if (alreadyHit) return -1;

    let index = this.coordinatesToIndex(coordinates);
    if (this.#grid[index][2] instanceof Ship) {
      this.#grid[index][2].hit();
      this.#grid[index][2] = null;
      this.#coordinatesHit.push(coordinates);
    } else {
      this.#coordinatesHit.push(coordinates);
    }
  }

  OccupiedCoordinates(coordinates) {
    // convert coordinates to index:
    let index = this.coordinatesToIndex(coordinates);
    if (this.#grid[index][2] instanceof Ship) return true;
    else return false;
  }

  coordinatesToIndex(coordinates) {
    if (coordinates[0] === 0) {
      return coordinates[1];
    } else {
      return coordinates[0] * 10 + coordinates[1];
    }
  }

  includesCoordinates(coordinates) {
    for (let i = 0; i < this.#coordinatesHit.length; i++) {
      if (
        this.#coordinatesHit[i][0] == coordinates[0] &&
        this.#coordinatesHit[i][1] == coordinates[1]
      ) {
        return true;
      }
    }
    return false;
  }

  gridCallBack(callback) {
    for (let i = 0; i < this.#grid.length; i++) {
      callback(this.#grid[i]);
    }
  }
}
