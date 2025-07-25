import { Ship } from "./Ship.js";

export class Gameboard {
  #grid;
  #coordinatesHit;
  #shipArray;
  possibleOppAttacks;

  constructor() {
    this.#grid = [];
    this.#shipArray = [];
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
    this.#shipArray.push(ship);

    if (orientation === "x") {
      // check to see if index out of bounds:
      if (ship.getLength() + coordinates[0] > 10) {
        return "OOB";
      }
      // check to see if ship already present:
      let copyCoords = coordinates.slice();
      for (let i = ship.getLength(); i > 0; i--) {
        if (this.occupiedCoordinates(copyCoords)) return "occupied";
        copyCoords[0] += 1;
      }
      let coordArray = [];
      for (let i = ship.getLength(); i > 0; i--) {
        this.#grid[index][2] = ship;
        coordArray.push(index);
        index = index + 10;
      }
      return coordArray;
    } else if (orientation === "y") {
      if (ship.getLength() + coordinates[1] > 10) {
        return "OOB";
      }
      let copyCoords = coordinates.slice();
      for (let i = ship.getLength(); i > 0; i--) {
        if (this.occupiedCoordinates(copyCoords)) return "occupied";
        copyCoords[1] += 1;
      }
      let coordArray = [];
      for (let i = ship.getLength(); i > 0; i--) {
        this.#grid[index][2] = ship;
        coordArray.push(index);
        index++;
      }
      return coordArray;
    }
  }

  receiveAttack(coordinates) {
    let alreadyHit = this.includesCoordinates(coordinates);
    if (alreadyHit) return -1;

    let index = this.coordinatesToIndex(coordinates);
    if (this.#grid[index][2] instanceof Ship) {
      this.#grid[index][2].hit();
      this.#coordinatesHit.push(coordinates);
      return "hit!";
    } else {
      this.#coordinatesHit.push(coordinates);
      return "miss!";
    }
  }

  occupiedCoordinates(coordinates) {
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

  getShipAtCoords(coords) {
    const index = this.coordinatesToIndex(coords);
    return this.#grid[index][2];
  }

  includesCoordinates(coordinates) {
    for (let i = 0; i < this.#coordinatesHit.length; i++) {
      if (this.#coordinatesHit[i][0] == coordinates[0] && this.#coordinatesHit[i][1] == coordinates[1]) {
        return true;
      }
    }
    return false;
  }

  validateCoordinates(ship, coords, orientation) {
    if (orientation === "x") {
      // check to see if index out of bounds:
      if (ship.getLength() + coords[0] > 10) {
        return "OOB";
      }
      let copyCoords = coords.slice();
      for (let i = ship.getLength(); i > 0; i--) {
        if (this.occupiedCoordinates(copyCoords)) return "occupied";
        copyCoords[0] += 1;
      }
    } else if (orientation === "y") {
      if (ship.getLength() + coords[1] > 10) {
        return "OOB";
      }
      let copyCoords = coords.slice();
      for (let i = ship.getLength(); i > 0; i--) {
        if (this.occupiedCoordinates(copyCoords)) return "occupied";
        copyCoords[1] += 1;
      }
    }
    return "valid";
  }

  gridCallBack(callback) {
    for (let i = 0; i < this.#grid.length; i++) {
      callback(this.#grid[i]);
    }
  }

  gridToString() {
    for (let element of this.#grid) {
      console.log(element);
    }
  }

  allShipsSunk() {
    for (let ship of this.#shipArray) {
      if (!ship.isSunk()) {
        return false;
      }
    }
    return true;
  }

  remainingShips() {
    let count = 0;
    for (let ship of this.#shipArray) {
      if (!ship.isSunk()) {
        count++;
      }
    }
    return count;
  }
}
