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
      //   if (x.target.classList.contains("grid-square")) {
      //     if (this.model.playerOne.shipArrSize() > 0) {
      //       this.view.highlightSquare(
      //         this.model.playerOne.peekShip().getLength(),
      //         x.target,
      //         "x"
      //       );
      //     }
      //   }
      this.highlightingSquares(x.target, "x");
    });

    this.playerOneGrid.addEventListener("mouseout", this.view.resetSquareColor);

    this.playerOneGrid.addEventListener("click", (x) => {
      this.highlightingSquares(x.target, "x");
    });

    // this.playerOneGrid.addEventListener("click", (x)=>{
    //
    // })
  }

  highlightingSquares(target, orientation) {
    if (target.classList.contains("grid-square")) {
      if (this.model.playerOne.shipArrSize() > 0) {
        this.view.highlightSquare(
          this.model.playerOne.peekShip().getLength(),
          target,
          orientation
        );
      }
    }
  }
}
