export class AIState {
  prevCoords;
  direction;
  initShipPosArr;
  validMovesGrid;
  playerOne;
  playerTwo;
  directionFlipped;

  static validationStatus = Object.freeze({
    VALID: "VALID",
    HIT: "HIT",
    HIT_WITH_SHIP: "HIT_WITH_SHIP",
    OOB: "OOB",
  });

  // To implement the class in Controller, observe changes on the following markers:

  // randomAttack only when this.initShipPosArr.length <= 0
  // seekDirectionAttack only when this.Q.length > 0
  // continueSmartAttack only when this.direction !== null

  constructor(playerOne, playerTwo) {
    this.initShipPosArr = [];
    this.direction = null;
    this.validMovesGrid = [];
    this.playerTwo = playerTwo;
    this.playerOne = playerOne;
    this.prevCoords = null;
    this.directionFlipped = false;

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        this.validMovesGrid.push([i, j]);
      }
    }
  }

  async getNextAttack() {
    if (this.direction !== null) return this.continueSmartAttack();
    else if (this.initShipPosArr.length > 0) return this.seekDirectionAttack();
    else return this.randomAttack();
  }

  async randomAttack() {
    let randIndex = this.getRandomIntInclusive(0, this.validMovesGrid.length - 1);

    let attackCoords = this.validMovesGrid[randIndex];
    this.validMovesGrid.splice(randIndex, 1);

    let attackPromise = new Promise((resolve) => {
      setTimeout(() => {
        let attack = this.playerOne.gameBoard.receiveAttack(attackCoords);

        resolve([attack, attackCoords]);
      }, 1500);
    });

    const resArray = await attackPromise;

    if (resArray[0] === "hit!") {
      const ship = this.playerOne.gameBoard.getShipAtCoords(resArray[1]);
      if (!this.containsShip(ship)) {
        resArray[1].push(ship);
        this.initShipPosArr.push(resArray[1]);
      }
      //assign as previous coords:
      this.prevCoords = resArray[1];
    }

    return resArray;
  }

  async seekDirectionAttack() {
    this.setPrevToInitShipPos();

    let Q = this.possibleAttacks(this.prevCoords);
    if (Q.length <= 0) {
      return this.randomAttack();
    }
    let attackCoords = Q.shift();

    let attackPromise = new Promise((resolve) => {
      setTimeout(() => {
        let attack = this.playerOne.gameBoard.receiveAttack(attackCoords);
        this.removeFromValidMovesGrid(attackCoords);

        resolve([attack, attackCoords]);
      }, 1500);
    });

    const resArray = await attackPromise;

    if (resArray[0] === "hit!") {
      this.direction = this.findDirection(resArray[1]);
      this.prevCoords = resArray[1];
      const ship = this.playerOne.gameBoard.getShipAtCoords(resArray[1]);
      if (!this.containsShip(ship)) {
        resArray[1].push(ship);
        this.initShipPosArr.push(resArray[1]);
      }
      if (ship.isSunk()) {
        this.removeShipFromArr(ship);
      }
    }

    return resArray;
  }

  async continueSmartAttack() {

    // coord validation should be the first thing done:
    let attackCoords = this.nextAttack();
    const coordValidation = this.coordValidation(attackCoords);

    if (coordValidation !== AIState.validationStatus.VALID) {
      if (coordValidation === AIState.validationStatus.OOB || coordValidation === AIState.validationStatus.HIT) {
        if (this.directionFlipped) {
          this.directionFlipped = false;
          this.direction = null;
          return this.seekDirectionAttack();
        } else {
          this.flipDirection();
          return this.continueSmartAttack();
        }
      }
      if (coordValidation === AIState.validationStatus.HIT_WITH_SHIP) {
        this.prevCoords = attackCoords;
        return this.continueSmartAttack();
      }
    }

    let attackPromise = new Promise((resolve) => {
      setTimeout(() => {
        let attack = this.playerOne.gameBoard.receiveAttack(attackCoords);
        this.removeFromValidMovesGrid(attackCoords);
        resolve([attack, attackCoords]);
      }, 1500);
    });

    const resArray = await attackPromise;

    if (resArray[0] === "hit!") {
      const ship = this.playerOne.gameBoard.getShipAtCoords(resArray[1]);
      if (!this.containsShip(ship)) {
        resArray[1].push(ship);
        this.initShipPosArr.push(resArray[1]);
      }
      if (ship.isSunk()) {
        this.removeShipFromArr(ship);
        this.direction = null;
        this.directionFlipped = false;
        this.prevCoords = attackCoords;
      }
      this.prevCoords = resArray[1];
    } else if (resArray[0] === "miss!") {
      if (!this.directionFlipped) {
        this.flipDirection();
      } else if (this.directionFlipped) {
        this.directionFlipped = false;
        this.direction = null;
      }
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

    this.shuffleArray(possibleMoves);

    for (let move of possibleMoves) {
      let newCoords = [coords[0] + move[0], coords[1] + move[1]];

      let coordValidation = this.coordValidation(newCoords);

      if (coordValidation === AIState.validationStatus.VALID) {
        q.push(newCoords);
      }
    }
    return q;
  }

  shuffleArray(arr) {
    for (let i = 0; i < arr.length; i++) {
      let rand = this.getRandomIntInclusive(i, arr.length - 1);
      let temp = arr[i];
      arr[i] = arr[rand];
      arr[rand] = temp;
    }
  }

  coordValidation(coords) {
    let outOfBounds = this.outOfBoundsCheck(coords);
    if (outOfBounds) {
      return AIState.validationStatus.OOB;
    }
    let alreadyHit = this.playerOne.gameBoard.includesCoordinates(coords);
    if (alreadyHit) {
      if (this.playerOne.gameBoard.getShipAtCoords(coords) !== null) {
        return AIState.validationStatus.HIT_WITH_SHIP;
      } else {
        return AIState.validationStatus.HIT;
      }
    }
    return AIState.validationStatus.VALID;
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
    this.directionFlipped = true;
    this.setPrevToInitShipPos();
  }

  setPrevToInitShipPos() {
    this.prevCoords = [this.initShipPosArr[0][0], this.initShipPosArr[0][1]];
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

  removeFromValidMovesGrid(coords) {
    for (let i = 0; i < this.validMovesGrid.length; i++) {
      if (coords[0] === this.validMovesGrid[i][0] && coords[1] === this.validMovesGrid[i][1]) {
        this.validMovesGrid.splice(i, 1);
        return;
      }
    }
  }

  containsShip(ship) {
    for (let arrShip of this.initShipPosArr) {
      if (arrShip[2] === ship) return true;
    }
    return false;
  }

  outOfBoundsCheck(coords) {
    if (coords[0] < 0 || coords[0] > 9 || coords[1] > 9 || coords[1] < 0) return true;
    return false;
  }

  removeShipFromArr(ship) {
    for (let i = 0; i < this.initShipPosArr.length; i++) {
      if (this.initShipPosArr[i][2] === ship) {
        const shipRemoved = this.initShipPosArr.splice(i, 1);
        return shipRemoved;
      }
    }
  }
}