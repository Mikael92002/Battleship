import { Player } from "./Player";

export class Model {
  playerOne;
  playerTwo;
  currentPlayer;

  constructor() {
    this.playerOne = new Player();
    this.playerTwo = new Player();
  }

  swapTurn() {
    this.currentPlayer =
      this.currentPlayer === this.playerOne ? this.playerTwo : this.playerOne;
  }
}
