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

    this.playerOneGrid.addEventListener("mouseover", (event) => {
      if (this.model.playerOne.shipArrSize() > 0) {
        if (event.target.classList.contains("grid-square")) {
          let activeButtonText = document.querySelector(".active").textContent.toLowerCase();
          let xCoord = Number(event.target.getAttribute("data-x"));
          let yCoord = Number(event.target.getAttribute("data-y"));
          let coordValidation = this.model.playerOne.gameBoard.validateCoordinates(this.model.playerOne.peekShip(), [xCoord, yCoord], activeButtonText);

          this.highlightCoordValidation(coordValidation, activeButtonText, event.target, [xCoord, yCoord]);
        }
      }
    });

    this.playerOneGrid.addEventListener("mouseout", this.view.resetSquareColor);

    this.playerOneGrid.addEventListener("click", (event) => {
      if (this.model.playerOne.shipArrSize() > 0) {
        if (event.target.classList.contains("grid-square")) {
          let activeButtonText = document.querySelector(".active").textContent.toLowerCase();

          let xCoord = Number(event.target.getAttribute("data-x"));
          let yCoord = Number(event.target.getAttribute("data-y"));

          let coordValidation = this.model.playerOne.gameBoard.validateCoordinates(this.model.playerOne.peekShip(), [xCoord, yCoord], activeButtonText);

          this.clickValidation(coordValidation, event.target, activeButtonText, [xCoord, yCoord]);
        }
      }
    });
  }

  highlightCoordValidation(validationMessage, activeButtonText, target, coords) {
    if (activeButtonText === "x") {
      if (validationMessage === "valid") {
        this.view.highlightMultipleSquares(this.model.playerOne.peekShip().getLength(), target, "x", "#39FF14");
      } else if (validationMessage === "OOB") {
        this.view.highlightMultipleSquares(10 - coords[0], target, "x", "#FF0000");
      } else if (validationMessage === "occupied") {
        this.view.highlightMultipleSquares(this.model.playerOne.peekShip().getLength(), target, "x", "#FF0000");
      }
    } else if (activeButtonText === "y") {
      if (validationMessage === "valid") {
        this.view.highlightMultipleSquares(this.model.playerOne.peekShip().getLength(), target, "y", "#39FF14");
      } else if (validationMessage === "OOB") {
        this.view.highlightMultipleSquares(10 - coords[1], target, "y", "#FF0000");
      } else if (validationMessage === "occupied") {
        this.view.highlightMultipleSquares(this.model.playerOne.peekShip().getLength(), target, "y", "#FF0000");
      }
    }
  }

  clickValidation(validationMessage, target, activeButtonText, coords) {
    if (validationMessage === "valid") {
      let poppedShip = this.model.playerOne.popShips();

      this.model.playerOne.gameBoard.placeShip(poppedShip, activeButtonText, coords);
      this.view.placeShipClick(poppedShip.getLength(), target, activeButtonText, "#e900ff");
      this.view.resetSquareColor();
    }
  }


  indexToCoords(index) {
    let x = index / 10;
    let y = index % 10;
    return [x, y];
  }
}
