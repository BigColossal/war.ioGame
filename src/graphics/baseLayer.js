import { resizeCanvasToWindow } from "../utils/canvasUtils.js";
import { Camera } from "../camera.js";
import { MapSchema } from "../gameConfig.js";

export class BaseLayer {
  constructor(parentCtx) {
    this.parentCtx = parentCtx;
    this.canvas = document.createElement("canvas");
    this.canvas.width = MapSchema.Dimensions.MapWidthPx;
    this.canvas.height = MapSchema.Dimensions.MapHeightPx;
    this.ctx = this.canvas.getContext("2d");
  }

  // Override this in children
  update() {}

  // Copy onto parent canvas
  render() {
    this.parentCtx.drawImage(
      this.canvas,
      Camera.x,
      Camera.y,
      window.innerWidth,
      window.innerHeight,
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );
  }
}
