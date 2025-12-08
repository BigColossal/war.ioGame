"use strict";
import { setupInputListeners } from "./input.js";
import { GameRenderer } from "./graphics/renderer.js";
import { Camera } from "./camera.js";

export function setupGame() {
  GameRenderer.init();
  Camera.init();
  setupInputListeners();

  return GameRenderer;
}
