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
      if (this.model.playerOne.shipArrSize() > 0) {
        if (x.target.classList.contains("grid-square")) {

          let activeButtonText = document.querySelector(".active").textContent.toLowerCase();
          let xCoord = Number(x.target.getAttribute("data-x"));
          let yCoord = Number(x.target.getAttribute("data-y"));
          let coordValidation = this.model.playerOne.gameBoard.validateCoordinates(this.model.playerOne.peekShip(), [xCoord, yCoord], activeButtonText);

          if (activeButtonText === "x") {
            if (coordValidation === "valid") {
              this.view.highlightMultipleSquares(this.model.playerOne.peekShip().getLength(), x.target, "x", "#39FF14");
            } else if (coordValidation === "OOB") {
              this.view.highlightMultipleSquares(10 - xCoord, x.target, "x", "#FF0000");
            } else if (coordValidation === "occupied") {
              this.view.highlightMultipleSquares(this.model.playerOne.peekShip().getLength(), x.target, "x", "#FF0000");
            }
          } else if (activeButtonText === "y") {
            if (coordValidation === "valid") {
              this.view.highlightMultipleSquares(this.model.playerOne.peekShip().getLength(), x.target, "y", "#39FF14");
            } else if (coordValidation === "OOB") {
              this.view.highlightMultipleSquares(10 - yCoord, x.target, "y", "#FF0000");
            } else if (coordValidation === "occupied") {
              this.view.highlightMultipleSquares(this.model.playerOne.peekShip().getLength(), x.target, "y", "#FF0000");
            }
          }

        }
      }
    });

    this.playerOneGrid.addEventListener("mouseout", this.view.resetSquareColor);

    this.playerOneGrid.addEventListener("click", (x) => {
      if (this.model.playerOne.shipArrSize() > 0) {
        if (x.target.classList.contains("grid-square")) {
          let activeButtonText = document.querySelector(".active").textContent.toLowerCase();

          let xCoord = Number(x.target.getAttribute("data-x"));
          let yCoord = Number(x.target.getAttribute("data-y"));

          let coordValidation = this.model.playerOne.gameBoard.validateCoordinates(this.model.playerOne.peekShip(), [xCoord, yCoord], activeButtonText);

          if (coordValidation === "valid") {
            if (this.model.playerOne.shipArrSize() > 0) {
              let poppedShip = this.model.playerOne.popShips();

              this.model.playerOne.gameBoard.placeShip(poppedShip, activeButtonText, [xCoord, yCoord]);
              this.view.placeShipClick(poppedShip.getLength(), x.target, activeButtonText);
            }
          }
        }
      }
    });
  }

  occupiedCoordinatesLoop(target) {}

  highlightCoordValidation(validationMessage, activeButtonText, target){
    if(activeButtonText === "x"){
        if (validationMessage === "valid") {
            this.view.highlightMultipleSquares(this.model.playerOne.peekShip().getLength(), target, "x", "#39FF14");
          } else if (validationMessage === "OOB") {
            this.view.highlightMultipleSquares(10 - xCoord, target, "x", "#FF0000");
          } else if (validationMessage === "occupied") {
            this.view.highlightMultipleSquares(this.model.playerOne.peekShip().getLength(), target, "x", "#FF0000");
          }
    }
    else if (activeButtonText === "y"){
        if (validationMessage === "valid") {
            this.view.highlightMultipleSquares(this.model.playerOne.peekShip().getLength(), target, "y", "#39FF14");
          } else if (validationMessage === "OOB") {
            this.view.highlightMultipleSquares(10 - yCoord, target, "y", "#FF0000");
          } else if (validationMessage === "occupied") {
            this.view.highlightMultipleSquares(this.model.playerOne.peekShip().getLength(), target, "y", "#FF0000");
          }
    }
  }

  indexToCoords(index) {
    let x = index / 10;
    let y = index % 10;
    return [x, y];
  }
}
