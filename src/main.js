"use strict";
import { setupGame } from "./setup.js";

// Get canvas and context
GameScreen = setupGame();

function update() {
  // game logic
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
