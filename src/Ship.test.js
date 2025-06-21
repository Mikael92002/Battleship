import { Ship } from "./Ship.js";

test("should return correct hit count", () => {
  const ship = new Ship(4);

  ship.hit();
  expect(ship.getHits()).toBe(1);

  ship.hit();
  ship.hit();
  ship.hit();
  expect(ship.getHits()).toBe(4);
});

test("should sink ship", ()=>{
    
})