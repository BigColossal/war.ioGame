"use strict";
import { BaseLayer } from "./baseLayer.js";

export class EnvironmentLayer extends BaseLayer {
  update() {
    let changed = false;
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    return changed;
  }
}
