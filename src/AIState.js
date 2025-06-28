export class AIState {
  prevCoords;
  direction;
  initShipPos;
  validMovesGrid;
  playerOne;
  playerTwo;
  Q;

  // To implement the class in Controller, observe changes on the following markers:

  // randomAttack only when this.Q.length <= 0
  // seekDirectionAttack only when this.Q.length > 0
  // continueSmartAttack only when this.direction !== null

  constructor(playerOne, playerTwo) {
    this.initShipPos = null;
    this.direction = null;
    this.validMovesGrid = [];
    this.playerTwo = playerTwo;
    this.playerOne = playerOne;
    this.Q = [];
    this.prevCoords = null;

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        this.validMovesGrid.push([i, j]);
      }
    }
  }

  async getNextAttack() {
    if (this.direction !== null) return this.continueSmartAttack();
    else if (this.Q.length > 0) return this.seekDirectionAttack();
    else return this.randomAttack();
  }

  async randomAttack() {
    let attackPromise = new Promise((resolve) => {
      setTimeout(() => {
        let randIndex = this.getRandomIntInclusive(0, this.validMovesGrid.length - 1);

        let attackCoords = this.playerTwo.gameBoard.validMovesGrid.splice(randIndex, 1);
        let attack = this.playerOne.gameBoard.receiveAttack(attackCoords);

        resolve([attack, attackCoords]);
      }, 1500);
    });

    const resArray = await attackPromise;

    //if "hit!"
    // call winCheck, update helpText, changePlayerOneColor
    if (resArray[0] === "hit!") {
      this.initShipPos = resArray[1];
      //generate future moves Q:
      this.Q = this.possibleAttacks(resArray[1]);
    } else if (resArray[0] === "miss!") {
      //... do in controller with returned resArray
    }
    return resArray;
  }

  async seekDirectionAttack() {
    // remove this length check, use in controller class:
    // if (this.Q.length > 0) {
    const remainingShipsInit = this.playerOne.gameBoard.remainingShips();
    let attackPromise = new Promise((resolve) => {
      setTimeout(() => {
        let attackCoords = this.Q.shift();
        let attack = this.playerOne.receiveAttack(attackCoords);

        resolve([attack, attackCoords]);
      }, 1500);
    });

    const resArray = await attackPromise;

    if (resArray[0] === "hit!" && remainingShipsInit === this.playerOne.remainingShips()) {
      this.prevCoords = this.initShipPos;
      this.direction = this.findDirection(resArray[1]);
      this.prevCoords = resArray[1];
    } else {
      this.Q = [];
      this.initShipPos = null;
      this.prevCoords = null;
    }

    return resArray;

    // Do in controller:
    // else {
    //   return this.randomAttack();
    // }
  }

  async continueSmartAttack() {
    const remainingShipsInit = this.playerOne.gameBoard.remainingShips();
    // coord validation should be the first thing done:
    let attackCoords = this.nextAttack();
    const coordValidation = this.coordValidation(attackCoords);
    if (!coordValidation) {
      this.flipDirection(this.direction);
      attackCoords = this.nextAttack();
    }

    let attackPromise = new Promise((resolve) => {
      setTimeout(() => {
        let attack = this.playerOne.receiveAttack(attackCoords);
        resolve([attack, attackCoords]);
      }, 1500);
    });

    const resArray = await attackPromise;

    if (remainingShipsInit !== this.playerOne.remainingShips()) {
      this.direction = null;
      this.Q = [];
      this.initShipPos = null;
      this.prevCoords = null;
    }

    return resArray;
  }

  possibleAttacks(coords) {
    let q = [];
    let possibleMoves = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];

    for (let move of possibleMoves) {
      let newCoords = [coords[0] + move[0], coords[1] + move[1]];

      let coordValidation = this.coordValidation(newCoords);

      if (coordValidation) {
        q.push(newCoords);
      }
    }
    return q;
  }

  coordValidation(coords) {
    let alreadyHit = this.playerOne.gameBoard.includesCoordinates(coords);
    let outOfBounds = this.outOfBoundsCheck(coords);

    return !alreadyHit && !outOfBounds;
  }

  findDirection(currCoords) {
    let xSum = currCoords[0] - this.prevCoords[0];
    let ySum = currCoords[1] - this.prevCoords[1];

    if (xSum > 0) {
      // right:
      return 0;
    } else if (xSum < 0) {
      // left:
      return 1;
    } else if (ySum > 0) {
      // up
      return 2;
    } else if (ySum < 0) {
      // down
      return 3;
    }

    //   2
    // 1   0
    //   3
  }

  flipDirection() {
    if (this.direction === 0) {
      this.direction = 1;
    } else if (this.direction === 1) {
      this.direction = 0;
    } else if (this.direction === 2) {
      this.direction = 3;
    } else if (this.direction === 3) {
      this.direction = 2;
    }
    this.prevCoords = this.initShipPos;
  }

  nextAttack() {
    switch (this.direction) {
      case 0:
        return [this.prevCoords[0] + 1, this.prevCoords[1]];
      case 1:
        return [this.prevCoords[0] - 1, this.prevCoords[1]];
      case 2:
        return [this.prevCoords[0], this.prevCoords[1] + 1];
      case 3:
        return [this.prevCoords[0], this.prevCoords[1] - 1];
    }
  }

  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  outOfBoundsCheck(coords) {
    if (coords[0] < 0 || coords[0] > 9 || coords[1] > 9 || coords[1] < 0) return true;
    return false;
  }
}
