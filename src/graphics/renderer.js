"use strict";
import {
  getCanvasContext,
  setupCanvasResizing,
  resizeCanvasToWindow,
} from "../utils/canvasUtils.js";
import { EntitiesLayer } from "./entities.js";
import { EnvironmentLayer } from "./environment.js";
import { UILayer } from "./ui.js";

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
    setupCanvasResizing([...this.layers, this]);
  },

  // Clear the canvas before each frame
  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  },
  // resize canvas to accomodate for screen size changes
  resize() {
    resizeCanvasToWindow(this.canvas);
  },

  // Master render call — orchestrates everything in order
  renderFrame() {
    this.clear();
    for (const layer of this.layers) {
      if (layer.update()) {
        this.dirty = true;
      }
    }

    // 2. Composite layers onto main canvas (order matters)
    if (this.dirty) {
      for (const layer of this.layers) {
        layer.render(); // draw layer.canvas → this.ctx
      }
    }
    this.dirty = false;
  },
};
