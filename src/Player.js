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
  turn;
//   shipsPlaced;

  constructor(
    carrierPOS,
    battleshipPOS,
    cruiserPOS,
    submarinePOS,
    destroyerPOS
  ) {
    this.turn = false;
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

    // for now, place ships on random
    //  co-ords:
    // this.shipsPlaced = false;
  }

  popShips() {
    if (this.#shipQ.length > 0) {
      return this.#shipQ.shift();
    }
  }

  peekShip(){
    if(this.#shipQ.length > 0){
        return this.#shipQ[0];
    }
  }

  shipArrSize(){
    return this.#shipQ.length;
  }
}
