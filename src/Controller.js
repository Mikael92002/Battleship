import { Player } from "./Player.js";
import { view } from "./view.js";

export class Controller {
  model;
  view;

  constructor(model, view) {
    this.view = view;
    this.model = model;

    
  }
}
