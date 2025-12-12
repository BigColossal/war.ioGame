import { GameRenderer } from "./renderer.js";
import { Camera } from "../camera.js";
import { MapSchema } from "../gameConfig.js";

export class BaseLayer {
  constructor(parentCtx, UI = false) {
    this.parentCtx = parentCtx;
    if (!UI) {
      this.canvas = new OffscreenCanvas(
        MapSchema.Dimensions.MapWidthPx,
        MapSchema.Dimensions.MapHeightPx
      );
    } else {
      this.canvas = new OffscreenCanvas(window.innerWidth, window.innerHeight);
    }
    this.ctx = this.canvas.getContext("2d");
  }

  // Override this in children
  update() {}

  // Copy onto parent canvas
  render() {
    const zoom = Camera.currentZoom;

    const srcWidth = GameRenderer.canvas.width / zoom;
    const srcHeight = GameRenderer.canvas.height / zoom;

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
