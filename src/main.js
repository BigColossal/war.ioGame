"use strict";
import { setupGame } from "./setup.js";
import { GameRenderer } from "./graphics/renderer.js";
import { Camera } from "./camera.js";

setupGame();

function update() {
  Camera.checkForUpdates();
}

function gameLoop() {
  update();
  GameRenderer.renderFrame();
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
