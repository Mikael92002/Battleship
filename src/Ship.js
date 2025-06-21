export class Ship{
    #length;
    #sunk
    #hits

    constructor(length){
        this.#length = length;
        this.#hits = 0;
        this.#sunk = false;
    }

    hit(){
        this.#hits++;
    }

    isSunk(){
        return this.#sunk;
    }

    getHits(){
        return this.#hits;
    }

    sinkShip(){
        this.#sunk = true;
    }
}