"use strict";
import { setupGame } from "./setup.js";

// Get canvas and context
const GameScreen = setupGame();

function update() {
  // game logic
}

function gameLoop() {
  update();
  GameScreen.renderFrame();
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
