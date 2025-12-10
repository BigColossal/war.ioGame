"use strict";

export function resizeCanvasToWindow(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Helper to attach resize listener
export function setupCanvasResizing(layer) {
  resizeCanvasToWindow(layer.canvas);

  window.addEventListener("resize", () => {
    resizeCanvasToWindow(layer.canvas);
  });
}

// grab canvas element and context
export function getCanvasContext(id = "gameCanvas") {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext("2d");
  return { canvas, ctx };
}
