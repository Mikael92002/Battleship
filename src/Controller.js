import { Player } from "./Player.js";
import { view } from "./view.js";
import { Ship } from "./Ship.js";

export class Controller {
  model;
  view;
  playerOneGrid;
  playerTwoGrid;
  helpText;
  currentPlayer;
  winCheck;

  constructor(model, view) {
    this.view = view;
    this.model = model;
    this.currentPlayer = null;
    this.winCheck = false;

    this.playerOneGrid = document.querySelector("#player-1-grid");
    this.playerTwoGrid = document.querySelector("#player-2-grid");
    this.helpText = document.querySelector("#help-text");

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
            event.target.style.backgroundColor = "#39FF14";
            this.winUpdate(this.model.playerOne);
          }
          if (attack === "miss!") {
            this.helpText.textContent = "You missed the opponent's ships!";
            event.target.style.backgroundColor = "#FF0000";
          }
          if (this.winCheck === false) {
            this.currentPlayer = this.model.playerTwo;
            //opponent does their move;
            // ...
            this.opponentAttackAlgorithm().then(() => {
              this.currentPlayer = this.model.playerOne;
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

  opponentAttackAlgorithm() {
    if (this.secondProtocol === true) {
      return this.continueSmartAttack(this.determineDirection(this.smartNode));
    } else if (this.shipFirstFound.length > 0) {
      return this.smartAttack();
    } else {
      return this.opponentRandomAttack();
    }
  }

  async opponentRandomAttack() {
    let attackPromise = new Promise((resolve) => {
      setTimeout(() => {
        // initially, randomly select square to find ship:
        let randIndex = this.getRandomIntInclusive(0, this.model.playerTwo.gameBoard.possibleOppAttacks.length - 1);

        let attackCoords = this.model.playerTwo.gameBoard.possibleOppAttacks[randIndex];
        this.model.playerTwo.gameBoard.possibleOppAttacks.splice(randIndex, 1);

        let attack = this.model.playerOne.gameBoard.receiveAttack(attackCoords);

        resolve([attack, attackCoords]);
      }, 1500);
    });

    const val = await attackPromise;

    if (val[0] === "hit!") {
      this.winUpdate(this.model.playerTwo);
      this.helpText.textContent = "The opponent hits!";
      this.changePlayerOneColor(val[1], "#39FF14");
      this.shipFirstFound = val[1];
      this.model.playerTwo.possibleAttacksQ = this.possibleAttacks(val[1]);
    } else {
      this.helpText.textContent = "The opponent misses!";
      this.changePlayerOneColor(val[1], "#FF0000");
    }
  }

  async smartAttack() {
    if (this.model.playerTwo.possibleAttacksQ.length > 0) {
      let attackPromise = new Promise((resolve) => {
        setTimeout(() => {
          let attackCoords = this.model.playerTwo.possibleAttacksQ.shift();
          let attack = this.model.playerOne.gameBoard.receiveAttack(attackCoords);
          console.log("Subsequent hit: " + attackCoords);
          console.log(this.model.playerTwo.possibleAttacksQ);

          resolve([attack, attackCoords]);
        }, 1500);
      });

      const val = await attackPromise;

      if (val[0] === "hit!") {
        this.changePlayerOneColor(val[1], "#39FF14");
        this.helpText.textContent = "The opponent hits!";
        this.changePlayerOneColor(val[1], "#39FF14");
        this.secondProtocol = true;
        this.smartNode = new Node(val[1]);
        this.smartNode.prevAttack = new Node(this.shipFirstFound);
      } else if (val[0] === "miss!") {
        this.changePlayerOneColor(val[1], "#FF0000");
      }
    } else {
      return;
    }
  }

  async continueSmartAttack(direction) {
    if (direction === "up") {
    }
    if (direction === "down") {
    }
    if (direction === "left") {
    }
    if (direction === "right") {
    }
  }

  determineDirection(node) {
    let xSum = this.smartNode.currAttack[0] - this.smartNode.prevAttack[1];
    let ySum = this.smartNode.currAttack[1] - this.smartNode.prevAttack[1];

    if (xSum > 0) {
      return "right";
    } else if (xSum < 0) {
      return "left";
    } else if (ySum > 0) {
      return "up";
    } else if (ySum < 0) {
      return "down";
    }
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

  outOfBoundsCheck(coords) {
    if (coords[0] < 0 || coords[0] > 9 || coords[1] > 9 || coords[1] < 0) return true;
    return false;
  }
}