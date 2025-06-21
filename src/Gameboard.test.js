import { Gameboard } from "./Gameboard.js";
import { Ship } from "./Ship.js";

const mockCallback = jest.fn((x) => {
  return x;
});

test("should return proper grid numbers", () => {
  const gameBoard = new Gameboard();

  gameBoard.gridCallBack(mockCallback);

  expect(mockCallback.mock.results[8].value).toStrictEqual([0, 8, null]);
});

test("should return coordinates as occupied", () => {
  const gameBoard = new Gameboard();

  // Initially, coordinates are unoccupied:
  expect(gameBoard.occupiedCoordinates([0, 0])).toBe(false);

  // y case:
  let ship = new Ship(4);
  gameBoard.placeShip(ship, "y", [0, 0]);

  // Check if coordinates are now occupied:
  expect(gameBoard.occupiedCoordinates([0, 0])).toBe(true);
  expect(gameBoard.occupiedCoordinates([0, 1])).toBe(true);
  expect(gameBoard.occupiedCoordinates([0, 2])).toBe(true);
  expect(gameBoard.occupiedCoordinates([0, 3])).toBe(true);

  // Other, random coordinates should not be occupied:
  expect(gameBoard.occupiedCoordinates([1, 0])).toBe(false);

  // x case:
  gameBoard.placeShip(ship, "x", [2, 2]);

  expect(gameBoard.occupiedCoordinates([2, 2])).toBe(true);
  expect(gameBoard.occupiedCoordinates([3, 2])).toBe(true);
  expect(gameBoard.occupiedCoordinates([4, 2])).toBe(true);
  expect(gameBoard.occupiedCoordinates([5, 2])).toBe(true);
});

test("should return correct coordinates", () => {
  const gameBoard = new Gameboard();
  let index = gameBoard.coordinatesToIndex([0, 9]);

  expect(gameBoard.getGrid()[index]).toStrictEqual([0, 9, null]);
});

test("attack hits ship", () => {
  const gameBoard = new Gameboard();

  let ship = new Ship(4);
  gameBoard.placeShip(ship, "x", [0, 0]);
  let hit = gameBoard.receiveAttack([0, 0]);

  expect(hit).toBe("hit!");
  expect(gameBoard.occupiedCoordinates([0, 0])).toBe(false);
});

test("attack misses ship", ()=>{
    const gameBoard = new Gameboard();
    
    let ship = new Ship(4);
    gameBoard.placeShip(ship, "x", [0,0]);
    let miss = gameBoard.receiveAttack([0,1]);

    expect(miss).toBe("miss!");
    expect(gameBoard.occupiedCoordinates([0,0])).toBe(true);
})

test("cannot hit same place twice", () => {
  const gameBoard = new Gameboard();

  let ship = new Ship(4);
  gameBoard.placeShip(ship, "x", [0, 0]);
  gameBoard.receiveAttack([0, 0]);
  expect(gameBoard.receiveAttack([0, 0])).toBe(-1);
});