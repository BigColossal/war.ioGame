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

export function setupInputListeners() {
  // Keyboard
  setupKeyboardListeners();

  // Mouse
  setupMouseListeners();
}
