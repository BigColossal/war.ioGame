"use strict";
import { setupGame } from "./setup.js";
import { Camera } from "./camera.js";

// Get canvas and context
const GameScreen = setupGame();

function update() {
  Camera.checkForMovement();
}

function gameLoop() {
  update();
  GameScreen.renderFrame();
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
