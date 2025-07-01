export class View {
  playerOneGrid;
  playerTwoGrid;
  xButton;
  yButton;

  constructor() {
    this.playerOneGrid = document.querySelector("#player-1-grid");
    this.playerTwoGrid = document.querySelector("#player-2-grid");

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        let squareDiv = document.createElement("div");
        let otherSquareDiv = document.createElement("div");

        squareDiv.classList.add("grid-square");
        squareDiv.setAttribute("data-index", i * 10 + j);
        squareDiv.setAttribute("data-x", j);
        squareDiv.setAttribute("data-y", 9 - i);

        otherSquareDiv.classList.add("enemy-grid-square");
        otherSquareDiv.setAttribute("data-opp-x", j);
        otherSquareDiv.setAttribute("data-opp-y", 9 - i);

        this.playerOneGrid.append(squareDiv);
        this.playerTwoGrid.append(otherSquareDiv);
      }
    }

    this.xButton = document.querySelector(".x-button");
    this.yButton = document.querySelector(".y-button");

    this.xButton.addEventListener("click", () => {
      if (!this.xButton.classList.contains("active")) {
        this.xButton.classList.add("active");
        this.yButton.classList.remove("active");
      }
    });
    this.yButton.addEventListener("click", () => {
      if (!this.yButton.classList.contains("active")) {
        this.yButton.classList.add("active");
        this.xButton.classList.remove("active");
      }
    });
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
      if (Math.floor(index / 10) - shipLength < -1) {
        this.invalidYIndex(index);
      } else {
        this.validYIndex(index, shipLength);
      }
    }
  }

  resetSquareColor(squareClass) {
    let allSquares = document.querySelectorAll(squareClass);

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
      let element = document.querySelector(`div[data-index = "${Number(tempIndex)}"]`);
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

  //   highlightSquareTemp(coords, color){
  //     let gridSquare = document.querySelector(`.grid-square[data-x="${coords[0]}"][data-y="${coords[1]}"]`);
  //     gridSquare.style.borderColor = color;
  //     console.log(gridSquare);
  //   }
  highlightMultipleSquares(howMany, squareToHighlightFrom, orientation, color) {
    let index = squareToHighlightFrom.getAttribute("data-index");
    if (orientation === "x") {
      for (let i = 0; i < howMany; i++) {
        let gridSquare = document.querySelector(`.grid-square[data-index="${index}"]`);

        gridSquare.style.borderColor = color;

        index++;
      }
    } else if (orientation === "y") {
      for (let i = 0; i < howMany; i++) {
        let gridSquare = document.querySelector(`.grid-square[data-index="${index}"]`);
        gridSquare.style.borderColor = color;

        index -= 10;
      }
    }
  }

  placeShipClick(howMany, squareToHighlightFrom, orientation, color) {
    let index = squareToHighlightFrom.getAttribute("data-index");
    if (orientation === "x") {
      for (let i = 0; i < howMany; i++) {
        let gridSquare = document.querySelector(`.grid-square[data-index="${index}"]`);
        gridSquare.style.backgroundColor = color;
        gridSquare.setAttribute("data-placed", "true");
        index++;
      }
    } else if (orientation === "y") {
      for (let i = 0; i < howMany; i++) {
        let gridSquare = document.querySelector(`.grid-square[data-index="${index}"]`);
        gridSquare.setAttribute("data-placed", "true");
        gridSquare.style.backgroundColor = color;
        index -= 10;
      }
    }
  }
}
