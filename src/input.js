"use strict";
export const keys = {};
export const mouse = { x: 0, y: 0, pressed: false };

function setupKeyboardListeners() {
  // Keyboard
  window.addEventListener("keydown", (e) => (keys[e.key] = true));
  window.addEventListener("keyup", (e) => (keys[e.key] = false));
}

function setupMouseListeners() {
  // Mouse
  window.addEventListener("mousedown", () => (mouse.pressed = true));
  window.addEventListener("mouseup", () => (mouse.pressed = false));
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
}

function setupTouchListeners() {
  const edgeThreshold = 200; // px from edges to count as "touching" that direction

  function touchHandler(e, isDown) {
    if (!e.touches) return;

    // Reset all simulated keys on each touch event
    keys["w"] = false;
    keys["a"] = false;
    keys["s"] = false;
    keys["d"] = false;

    for (let touch of e.touches) {
      const { clientX: x, clientY: y } = touch;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Top edge → W
      if (y < edgeThreshold) keys["w"] = true;
      // Bottom edge → S
      if (y > height - edgeThreshold) keys["s"] = true;
      // Left edge → A
      if (x < edgeThreshold) keys["a"] = true;
      // Right edge → D
      if (x > width - edgeThreshold) keys["d"] = true;
    }
  }

  window.addEventListener("touchstart", (e) => touchHandler(e, true));
  window.addEventListener("touchmove", (e) => touchHandler(e, true));
  window.addEventListener("touchend", (e) => {
    // Reset keys when touch ends
    keys["w"] = false;
    keys["a"] = false;
    keys["s"] = false;
    keys["d"] = false;
  });
}

export function setupInputListeners() {
  // Keyboard
  setupKeyboardListeners();

  // Mouse
  setupMouseListeners();

  // Touch
  setupTouchListeners();
}
