import { Player } from "./Player.js";
import { view } from "./view.js";

export class Controller {
  model;
  view;
  playerOneGrid;

  constructor(model, view) {
    this.view = view;
    this.model = model;

    this.playerOneGrid = document.querySelector("#player-1-grid");

    this.playerOneGrid.addEventListener("mouseover", (x) => {
      if (x.target.classList.contains("grid-square")) {
        this.highlightingSquares(x.target, "x");
      }
    });

    this.playerOneGrid.addEventListener("mouseout", this.view.resetSquareColor);

    this.playerOneGrid.addEventListener("click", (x) => {
      if (x.target.classList.contains("grid-square")) {
        // this.highlightingSquares(x.target, "x");
        let coordArray = this.clickedSquare(x.target, "x");
        x.target.setAttribute("data-placed", true);
        this.view.resetSquareColor();
      }
    });

    // this.playerOneGrid.addEventListener("click", (x)=>{
    //
    // })
  }

  highlightingSquares(target, orientation) {
    if (this.model.playerOne.shipArrSize() > 0) {
      this.view.highlightSquare(
        this.model.playerOne.peekShip().getLength(),
        target,
        orientation
      );
    }
  }

  clickedSquare(target, orientation) {
    if (this.model.playerOne.shipArrSize() > 0) {
      let ship = this.model.playerOne.popShips();

      let returnVal = this.model.playerOne.gameBoard.placeShip(ship, "x", [
        Number(target.getAttribute("data-x")),
        Number(target.getAttribute("data-y")),
      ]);

      this.model.playerOne.gameBoard.gridToString();

      this.highlightingSquares(target, orientation);
      if (Array.isArray(returnVal)) {
        let coordArray = [];
        for (let i = 0; i < returnVal.length; i++) {
          coordArray.push(this.indexToCoords(returnVal[i]));
        }
        return coordArray;
      }
    }
  }

  occupiedCoordinatesLoop(target) {}

  indexToCoords(index) {
    let x = index / 10;
    let y = index % 10;
    return [x, y];
  }
}
