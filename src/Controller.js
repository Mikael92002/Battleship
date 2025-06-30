import { AIState } from "./AIState.js";

export class Controller {
  model;
  view;
  playerOneGrid;
  playerTwoGrid;
  helpText;
  currentPlayer;
  winCheck;
  aiState;
  playerOneShipCount;
  playerTwoShipCount;
  orientationDiv;

  constructor(model, view) {
    this.view = view;
    this.model = model;
    this.currentPlayer = null;
    this.winCheck = false;
    this.aiState = new AIState(this.model.playerOne, this.model.playerTwo);

    this.playerOneGrid = document.querySelector("#player-1-grid");
    this.playerTwoGrid = document.querySelector("#player-2-grid");
    this.playerOneShipCount = document.querySelector("#player-1-ship-count");
    this.playerTwoShipCount = document.querySelector("#player-2-ship-count");
    this.helpText = document.querySelector("#help-text");
    this.orientationDiv = document.querySelector("#orientation");

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
      if (this.model.playerOne.shipArrSize() === 0 && this.model.playerTwo.shipArrSize() > 0) {
        this.orientationDiv.classList.add("start");
        this.helpText.textContent = "Waiting for Opponent to place ships...";
        let startGame = this.placePlayerTwoShips();
        startGame.then((val) => {
          this.helpText.textContent = "Opponent ships placed! Your move...";
          this.currentPlayer = this.model.playerOne;
        });
      }
    });

    this.playerTwoGrid.addEventListener("click", (event) => {
      if (this.currentPlayer === this.model.playerOne && this.model.playerTwo.shipArrSize() <= 0 && this.winCheck === false) {
        if (event.target.classList.contains("enemy-grid-square")) {
          let xCoord = Number(event.target.getAttribute("data-opp-x"));
          let yCoord = Number(event.target.getAttribute("data-opp-y"));
          let attack = this.model.playerTwo.gameBoard.receiveAttack([xCoord, yCoord]);
          if (attack === -1) return;

          if (attack === "hit!") {
            this.helpText.textContent = "You hit the opponent's ship!";
            this.playerTwoShipCount.textContent = "Ship Count: " + this.model.playerTwo.gameBoard.remainingShips();
            event.target.style.backgroundColor = "#39FF14";
            this.winUpdate(this.model.playerOne);
          }
          if (attack === "miss!") {
            this.helpText.textContent = "You missed the opponent's ships!";
            event.target.style.backgroundColor = "#FF0000";
          }
          if (this.winCheck === false) {
            this.currentPlayer = this.model.playerTwo;

            this.aiState.getNextAttack().then((returnArr) => {
              this.currentPlayer = this.model.playerOne;
              this.updatePlayerOneUIUponAttack(returnArr);
            });
          }
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

  updatePlayerOneUIUponAttack(returnArr) {
    const attack = returnArr[0];
    const attackCoords = returnArr[1];

    switch (attack) {
      case "hit!": {
        this.helpText.textContent = "The opponent hits!";
        this.playerOneShipCount.textContent = "Ship Count: " + this.model.playerOne.gameBoard.remainingShips();
        this.winUpdate(this.model.playerTwo);
        this.changePlayerOneColor(attackCoords, "#39FF14");
        break;
      }
      case "miss!": {
        this.helpText.textContent = "The opponent misses!";
        this.changePlayerOneColor(attackCoords, "#FF0000");
        break;
      }
    }
  }

  indexToCoords(index) {
    let x = index / 10;
    let y = index % 10;
    return [x, y];
  }

  placePlayerTwoShips() {
    return new Promise((resolve) => {
      setTimeout(() => {
        while (this.model.playerTwo.shipArrSize() > 0) {
          let currShip = this.model.playerTwo.popShips();
          let randomX = this.getRandomIntInclusive(0, 9);
          let randomY = this.getRandomIntInclusive(0, 9);
          let orient = this.randOrient();
          let coordValidation = this.model.playerTwo.gameBoard.validateCoordinates(currShip, [randomX, randomY], orient);
          while (coordValidation === "OOB" || coordValidation === "occupied") {
            randomX = this.getRandomIntInclusive(0, 9);
            randomY = this.getRandomIntInclusive(0, 9);
            orient = this.randOrient();
            coordValidation = this.model.playerTwo.gameBoard.validateCoordinates(currShip, [randomX, randomY], orient);
          }
          this.model.playerTwo.gameBoard.placeShip(currShip, orient, [randomX, randomY]);
        }
        resolve("success");
      }, 2000);
    });
  }

  randOrient() {
    let num = Math.random();
    if (num < 0.495) {
      return "x";
    } else return "y";
  }

  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  changePlayerOneColor(coords, color) {
    let squareDiv = document.querySelector(`.grid-square[data-x = "${coords[0]}"][data-y = "${coords[1]}"]`);
    squareDiv.style.backgroundColor = color;
  }

  winUpdate(player) {
    if (player === this.model.playerOne) {
      if (this.model.playerTwo.gameBoard.allShipsSunk()) {
        this.helpText.textContent = "YOU WIN!!!";
        this.winCheck = true;
      }
    } else if (player === this.model.playerTwo) {
      if (this.model.playerOne.gameBoard.allShipsSunk()) {
        this.helpText.textContent = "THE OPPONENT WON!!!";
        this.winCheck = true;
      }
    }
  }
}
