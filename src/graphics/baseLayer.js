import { resizeCanvasToWindow } from "../utils/canvasUtils.js";

export class BaseLayer {
  constructor(parentCtx) {
    this.parentCtx = parentCtx;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
  }

  resize() {
    resizeCanvasToWindow(this.canvas);
  }

  // Override this in children
  update() {}

  // Copy onto parent canvas
  render() {
    this.parentCtx.drawImage(this.canvas, 0, 0);
  }
}
