"use strict";
import { setupZoomListener } from "./zoom.js";
import { Camera } from "../camera.js";

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
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;

  window.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length === 1) {
        // Start drag
        const t = e.touches[0];
        lastX = t.clientX;
        lastY = t.clientY;
        isDragging = true;
      } else {
        // multiple touches → maybe pinch zoom, stop dragging
        isDragging = false;
      }
    },
    { passive: false }
  );

  window.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length === 1 && isDragging) {
        e.preventDefault();

        const t = e.touches[0];
        const dx = t.clientX - lastX;
        const dy = t.clientY - lastY;
        // Move camera *opposite* of drag direction (drag = pull map)
        Camera.moveCamera(-(dx / Camera.zoom), -(dy / Camera.zoom), true);

        Camera.updateBoundaries();

        lastX = t.clientX;
        lastY = t.clientY;
      }
    },
    { passive: false }
  );

  window.addEventListener(
    "touchend",
    (e) => {
      if (e.touches.length === 0) {
        isDragging = false;
      }
    },
    { passive: false }
  );
}

export function setupInputListeners() {
  // Keyboard
  setupKeyboardListeners();

  // Mouse
  setupMouseListeners();

  // Touch
  setupTouchListeners();

  // Zoom
  setupZoomListener();
}
