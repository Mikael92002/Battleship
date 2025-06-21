import {Ship} from "./Ship.js";

export class Gameboard {
  #grid;

  constructor() {
    this.#grid = [];
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
    let index = coordinates;
  }

  gridCallBack(callback) {
    for (let i = 0; i < this.#grid.length; i++) {
      callback(this.#grid[i]);
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
}
