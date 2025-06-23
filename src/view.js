export class View {
  playerOneGrid;
  playerTwoGrid;

  constructor() {
    this.playerOneGrid = document.querySelector("#player-1-grid");
    this.playerTwoGrid = document.querySelector("#player-2-grid");

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        let squareDiv = document.createElement("div");
        let otherSquareDiv = document.createElement("div");

        squareDiv.classList.add("grid-square");
        squareDiv.setAttribute("data-index", i * 10 + j);
        squareDiv.setAttribute("data-x", i);
        squareDiv.setAttribute("data-y", j);

        otherSquareDiv.classList.add("enemy-grid-square");

        squareDiv.addEventListener("mouseleave", this.resetSquareColor);

        this.playerOneGrid.append(squareDiv);
        this.playerTwoGrid.append(otherSquareDiv);
      }
    }
  }

  highlightSquare(shipLength, squareToHighlightFrom, orientation) {
    let index = squareToHighlightFrom.getAttribute("data-index");

    if (orientation === "x") {
      if (shipLength + (index % 10) > 10) {
        this.invalidXIndex(index);
      } else {
        this.validXIndex(index, shipLength);
      }
    } else if (orientation === "y") {
      let tempIndex = index;
      if (Math.floor(index / 10) - shipLength < -1) {
        this.invalidYIndex(index);
      } else {
        this.validYIndex(index, shipLength);
      }
    }
  }

  resetSquareColor() {
    let allSquares = document.querySelectorAll(".grid-square");

    for (let square of allSquares) {
      square.style.borderColor = "#F27DFD";
    }
  }

  invalidXIndex(index) {
    for (let i = 0; i < index % 10; i++) {
      let element = document.querySelector(`div[data-index = "${index}"]`);
      element.style.borderColor = "#FF0000";
      index++;
    }
  }

  validXIndex(index, shipLength) {
    for (let i = 0; i < shipLength; i++) {
      let element = document.querySelector(`div[data-index = "${index}"]`);
      element.style.borderColor = "#39FF14";
      index++;
    }
  }

  invalidYIndex(index) {
    let tempIndex = index;
    for (let i = 0; i < index / 10; i++) {
      let element = document.querySelector(
        `div[data-index = "${Number(tempIndex)}"]`
      );
      element.style.borderColor = "#FF0000";
      tempIndex -= 10;
    }
  }

  validYIndex(index, shipLength) {
    let tempIndex = index;
    for (let i = 0; i < shipLength; i++) {
      let element = document.querySelector(`div[data-index = "${tempIndex}"]`);
      element.style.borderColor = "#39FF14";
      tempIndex -= 10;
    }
  }
}
