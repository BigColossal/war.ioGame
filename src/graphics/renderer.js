"use strict";
import {
  getCanvasContext,
  setupCanvasResizing,
  resizeCanvasToWindow,
  createBlankCanvas,
} from "../utils/canvasUtils.js";
import { EntitiesLayer } from "./entities.js";
import { EnvironmentLayer } from "./environment.js";
import { UILayer } from "./ui.js";
import { Camera } from "../camera.js";

export const GameRenderer = {
  // Initialize anything graphics-related
  init() {
    const { canvas, ctx } = getCanvasContext();
    this.canvas = canvas;
    this.ctx = ctx; // context
    this.dirty = true;

    this.EnvironmentLayer = new EnvironmentLayer(this.ctx);
    this.EntitiesLayer = new EntitiesLayer(this.ctx);
    this.UILayer = new UILayer(this.ctx);

    this.layers = [this.EnvironmentLayer, this.EntitiesLayer, this.UILayer]; // layers are in render order
    setupCanvasResizing(this);
    setupCanvasResizing(this.UILayer);

    this.blankImage = createBlankCanvas(this.canvas);
  },

  // Clear the canvas before each frame
  clear() {
    this.ctx.globalCompositeOperation = "copy";
    this.ctx.drawImage(this.blankImage, 0, 0);
    this.ctx.globalCompositeOperation = "source-over";
  },
  // resize canvas to accomodate for screen size changes
  resizeScreen() {
    resizeCanvasToWindow(this.canvas);
  },

  // Master render call — orchestrates everything in order
  renderFrame() {
    for (const layer of this.layers) {
      if (layer.update()) {
        this.dirty = true;
      }
    }
    if (Camera.moved) {
      this.dirty = true;
    }

    // 2. Composite layers onto main canvas (order matters)
    if (this.dirty) {
      this.clear();
      for (const layer of this.layers) {
        layer.render(); // draw layer.canvas → this.ctx
      }

      Camera.moved = false;
    }
    this.dirty = false;
  },
};
