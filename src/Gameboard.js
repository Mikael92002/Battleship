export class Gameboard{
    #grid

    constructor(){
        for(let i = 0;i<10;i++){
            for(let j = 0;j<10;j++){
                this.#grid.push([i,j]);
            }
        }
    }

    getGrid(){
        return this.#grid;
    }

    placeShip(shipLength, orientation){
        
    }
}