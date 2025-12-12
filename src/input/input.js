"use strict";
import { setupZoomListener } from "./zoom.js";
import { Camera } from "../camera.js";
import { GameRenderer } from "../graphics/renderer.js";
import { FPSHandler } from "../fps.js";

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

  window.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];

      lastX = t.clientX;
      lastY = t.clientY;
      isDragging = true;

      Camera.velX = 0;
      Camera.velY = 0;
      Camera.lastDragTime = performance.now();
    } else {
      isDragging = false;
    }
  });

  window.addEventListener("touchmove", (e) => {
    if (e.touches.length === 1 && isDragging) {
      e.preventDefault();

      const t = e.touches[0];

      const now = performance.now();
      Camera.lastDragTime = now;

      const dx_screen = t.clientX - lastX;
      const dy_screen = t.clientY - lastY;

      lastX = t.clientX;
      lastY = t.clientY;

      const dragFactor = 0.5; // 0.5 = half speed, adjust to taste
      const dx = (dx_screen / Camera.currentZoom) * dragFactor;
      const dy = (dy_screen / Camera.currentZoom) * dragFactor;

      // Move camera
      Camera.moveCamera(-dx, -dy);

      // store velocity for inertia
      Camera.velX = -dx / 16;
      Camera.velY = -dy / 16;
    }
  });

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

function setupMouseDrag() {
  window.addEventListener("mousedown", (e) => {
    if (e.button === 0 || e.button === 1) {
      Camera.isDragging = true;

      Camera.lastDragX = e.clientX;
      Camera.lastDragY = e.clientY;
      Camera.lastDragTime = performance.now();

      Camera.velX = 0;
      Camera.velY = 0;

      e.preventDefault();
    }
  });

  window.addEventListener("mousemove", (e) => {
    if (!Camera.isDragging) return;

    const now = performance.now();
    Camera.lastDragTime = now;

    const dx_screen = e.clientX - Camera.lastDragX;
    const dy_screen = e.clientY - Camera.lastDragY;

    Camera.lastDragX = e.clientX;
    Camera.lastDragY = e.clientY;

    const dragFactor = 0.75; // 0.5 = half speed, adjust to taste
    const dx = (dx_screen / Camera.currentZoom) * dragFactor;
    const dy = (dy_screen / Camera.currentZoom) * dragFactor;

    // Move camera exactly like touch
    Camera.moveCamera(-dx, -dy);

    // Track velocity (same units as inertia)
    Camera.velX = -dx / 16;
    Camera.velY = -dy / 16;
  });

  window.addEventListener("mouseup", () => {
    Camera.isDragging = false;
  });

  window.addEventListener("mouseleave", () => {
    Camera.isDragging = false;
  });
}

function setupFullscreenListener() {
  const canvas = GameRenderer.canvas;
  const UILayer = GameRenderer.UILayer;
  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const btn = UILayer.UILoadouts.homeBase.btns.fullscreenBtn;
    if (
      mouseX >= btn.x &&
      mouseX <= btn.x + btn.width &&
      mouseY >= btn.y &&
      mouseY <= btn.y + btn.height
    ) {
      toggleFullscreen();
    }
  });
}

function toggleFullscreen() {
  const docEl = document.documentElement;

  if (!document.fullscreenElement) {
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen();
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen();
    } else if (docEl.msRequestFullscreen) {
      docEl.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
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

  // Mouse Drag
  setupMouseDrag();

  // Full screen
  setupFullscreenListener();
}
