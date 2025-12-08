"use strict";
import { getCanvasContext } from "./utils/canvasUtils.js";
import { EntitiesLayer } from "./entities.js";
import { EnvironmentLayer } from "./environment.js";
import { UILayer } from "./ui.js";

export const GameRenderer = {
  // Initialize anything graphics-related (optional)
  init() {
    const { canvas, ctx } = getCanvasContext();
    this.canvas = canvas;
    this.ctx = ctx;

    this.EnvironmentLayer = new EnvironmentLayer(this.ctx);
    this.EntitiesLayer = new EntitiesLayer(this.ctx);
    this.UILayer = new UILayer(this.ctx);
  },

  // Clear the canvas before each frame
  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  },

  // Draw the environment (map, fog, backdrop)
  renderEnvironment() {
    drawEnvironment(this.ctx);
  },

  // Draw all entities (player, enemies, projectiles)
  renderEntities() {
    drawEntities(this.ctx);
  },

  // Draw UI overlays (HUD, menus, score)
  renderUi() {
    drawUI(this.ctx);
  },

  // Master render call — orchestrates everything in order
  renderFrame() {
    this.clear();
    this.renderEnvironment();
    this.renderEntities();
    this.renderUi();
  },
};
