import { Gameboard } from "./Gameboard.js";
import { Ship } from "./Ship.js";

export class Player {
  gameBoard;
  carrier;
  battleship;
  cruiser;
  submarine;
  destroyer;
  turn;
  shipsPlaced;

  constructor(carrierPOS, battleshipPOS, cruiserPOS, submarinePOS, destroyerPOS) {
    this.turn = false;
    this.gameBoard = new Gameboard();
    this.carrier = new Ship(5);
    this.battleship = new Ship(4);
    this.cruiser = new Ship(3);
    this.submarine = new Ship(3);
    this.destroyer = new Ship(2);

    // for now, place ships on random
    //  co-ords:
    this.shipsPlaced = false;
    this.gameBoard.placeShip(this.carrier,"x",[0,0]);
    this.gameBoard.placeShip(this.battleship,"x",[0,1]);
    this.gameBoard.placeShip(this.cruiser,"y",[9,0]);
    this.gameBoard.placeShip(this.submarine, "x", [0,2]);
    this.gameBoard.placeShip(this.destroyer, "x", [0,3]);
    this.shipsPlaced = true;
  }


}