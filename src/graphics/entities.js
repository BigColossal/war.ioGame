"use strict";

import { BaseLayer } from "./baseLayer.js";

export class EntitiesLayer extends BaseLayer {
  update() {
    let changed = false;
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(100, 100, 50, 50);
    return changed;
  }
}
