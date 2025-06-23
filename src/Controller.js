import {view} from "./view.js";

export class Controller{
    playerOne;
    playerTwo;
    view;

    constructor(playerOne, playerTwo, view){
        this.view = view;
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
    }

    
}