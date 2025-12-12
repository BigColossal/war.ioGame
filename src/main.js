"use strict";
import { setupGame } from "./setup.js";
import { GameRenderer } from "./graphics/renderer.js";
import { Camera } from "./camera.js";
import { FPSHandler } from "./fps.js";

setupGame();

function update() {
  Camera.checkForUpdates();
  FPSHandler.update();
}

function gameLoop() {
  update();
  GameRenderer.renderFrame();
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
