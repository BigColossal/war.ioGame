"use strict";

export function resizeCanvasToWindow(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Helper to attach resize listener
export function setupCanvasResize(canvas) {
  resizeCanvasToWindow(canvas);
  window.addEventListener("resize", () => resizeCanvasToWindow(canvas));
}

// grab canvas element and context
export function getCanvasContext(id = "gameCanvas") {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext("2d");
  return { canvas, ctx };
}
