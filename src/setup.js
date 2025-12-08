"use strict";
import { setupInputListeners } from "./input.js";
import { GameRenderer } from "./graphics/renderer.js";

export function setupGame() {
  GameRenderer.init();
  setupInputListeners();

  return GameRenderer;
}
