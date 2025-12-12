"use strict";

export function resizeCanvasToWindow(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Helper to attach resize listener
export function setupCanvasResizing(layer) {
  layer.resizeScreen();

  window.addEventListener("resize", () => {
    layer.resizeScreen();
  });
}

// grab canvas element and context
export function getCanvasContext(id = "gameCanvas") {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext("2d");
  return { canvas, ctx };
}

export function createBlankCanvas(canvas) {
  const blankCanvas = new OffscreenCanvas(canvas.width, canvas.height);
  const blankCtx = blankCanvas.getContext("2d");

  window.addEventListener("resize", () => {
    blankCanvas.width = window.innerWidth;
    blankCanvas.height = window.innerHeight;
  });

  return blankCanvas;
}
