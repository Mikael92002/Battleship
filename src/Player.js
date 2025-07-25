import { Gameboard } from "./Gameboard.js";
import { Ship } from "./Ship.js";

export class Player {
  gameBoard;
  carrier;
  battleship;
  cruiser;
  submarine;
  destroyer;
  #shipQ;
  possibleAttacksQ;

  constructor(
    carrierPOS,
    battleshipPOS,
    cruiserPOS,
    submarinePOS,
    destroyerPOS
  ) {
    this.gameBoard = new Gameboard();
    this.carrier = new Ship(5);
    this.battleship = new Ship(4);
    this.cruiser = new Ship(3);
    this.submarine = new Ship(3);
    this.destroyer = new Ship(2);

    this.#shipQ = [];
    this.#shipQ.push(
      this.carrier,
      this.battleship,
      this.cruiser,
      this.submarine,
      this.destroyer
    );
  }

  popShips() {
    if (this.#shipQ.length > 0) {
      return this.#shipQ.shift();
    }
    return null;
  }

  peekShip(){
    if(this.#shipQ.length > 0){
        return this.#shipQ[0];
    }
    return null;
  }

  shipArrSize(){
    return this.#shipQ.length;
  }
}
