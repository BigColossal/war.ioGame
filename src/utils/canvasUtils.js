"use strict";

export function resizeCanvasToWindow(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Helper to attach resize listener
export function setupCanvasResizing(layersList) {
  // initial resizing
  layersList.forEach((layer) => layer.resize());

  // If screen size changes, layers will adapt
  window.addEventListener("resize", () => {
    layersList.forEach((layer) => layer.resize());
  });
}

// grab canvas element and context
export function getCanvasContext(id = "gameCanvas") {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext("2d");
  return { canvas, ctx };
}
