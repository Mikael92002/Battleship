import { Gameboard } from "./Gameboard.js";

const mockCallback = jest.fn((x) => {
  return x;
});

test("should return proper grid numbers", () => {
  const gameBoard = new Gameboard();

  gameBoard.gridCallBack(mockCallback);

  expect(mockCallback.mock.results[8].value).toStrictEqual([0, 8, false]);
});

test("should return coordinates as occupied", () => {
  const gameBoard = new Gameboard();

  // Initially, coordinates are unoccupied:
  expect(gameBoard.OccupiedCoordinates([0, 0])).toBe(false);

  // y case:
  gameBoard.placeShip(4, "y", [0, 0]);

  // Check if coordinates are now occupied:
  expect(gameBoard.OccupiedCoordinates([0, 0])).toBe(true);
  expect(gameBoard.OccupiedCoordinates([0, 1])).toBe(true);
  expect(gameBoard.OccupiedCoordinates([0, 2])).toBe(true);
  expect(gameBoard.OccupiedCoordinates([0, 3])).toBe(true);

  // Other, random coordinates should not be occupied:
  expect(gameBoard.OccupiedCoordinates([1, 0])).toBe(false);

  // x case:
  gameBoard.placeShip(4, "x", [2, 2]);

  expect(gameBoard.OccupiedCoordinates([2, 2])).toBe(true);
  expect(gameBoard.OccupiedCoordinates([3, 2])).toBe(true);
  expect(gameBoard.OccupiedCoordinates([4, 2])).toBe(true);
  expect(gameBoard.OccupiedCoordinates([5, 2])).toBe(true);
});

test("should return correct coordinates", () => {
  const gameBoard = new Gameboard();
  let index = gameBoard.coordinatesToIndex([0, 9]);

  expect(gameBoard.getGrid()[index]).toStrictEqual([0, 9, false]);
});

test("attack hits ship", () => {
    
});
