import { resizeCanvasToWindow } from "../utils/canvasUtils.js";
import { Camera } from "../camera.js";
import { MapSchema } from "../gameConfig.js";

export class BaseLayer {
  constructor(parentCtx, UI = false) {
    this.parentCtx = parentCtx;
    this.canvas = document.createElement("canvas");
    if (!UI) {
      this.canvas.width = MapSchema.Dimensions.MapWidthPx;
      this.canvas.height = MapSchema.Dimensions.MapHeightPx;
    }
    this.ctx = this.canvas.getContext("2d");
  }

  // Override this in children
  update() {}

  // Copy onto parent canvas
  render() {
    const zoom = Camera.currentZoom;

    const srcWidth = window.innerWidth / zoom;
    const srcHeight = window.innerHeight / zoom;

    this.parentCtx.drawImage(
      this.canvas,
      Camera.x,
      Camera.y,
      srcWidth,
      srcHeight,
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );
  }
}
