"use strict";
import { Camera } from "../camera.js";

function handleScrollWheel() {
  window.addEventListener(
    "wheel",
    (e) => {
      // block browser zoom gesture
      if (e.ctrlKey) e.preventDefault();

      // your zoom control
      const factor = e.deltaY < 0 ? 1.1 : 0.9; // zoom in or out

      Camera.zoomFunctionality(factor, e.clientX, e.clientY);
    },
    { passive: false }
  );
}

function handleMobileZoom() {
  let lastDistance = null;

  function pinchZoom(midX, midY, scaleChange) {
    Camera.zoomFunctionality(scaleChange, midX, midY, true);
    Camera.updateBoundaries();
  }

  window.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();

        const t1 = e.touches[0];
        const t2 = e.touches[1];

        // Midpoint (center between two fingers)
        const midX = (t1.clientX + t2.clientX) / 2;
        const midY = (t1.clientY + t2.clientY) / 2;

        // Distance between fingers
        const dx = t2.clientX - t1.clientX;
        const dy = t2.clientY - t1.clientY;
        const distance = Math.hypot(dx, dy);

        if (lastDistance !== null) {
          // Ratio change instead of absolute delta
          const scaleChange = distance / lastDistance;

          // Only zoom if scale changed enough (to avoid jitter)
          if (scaleChange > 1.02 || scaleChange < 0.98) {
            pinchZoom(midX, midY, scaleChange);
          }
        }

        lastDistance = distance;
      }
    },
    { passive: false }
  );

  window.addEventListener("touchend", () => {
    lastDistance = null;
  });

  // Reset when pinch ends
  window.addEventListener("touchend", () => {
    if (event.touches.length < 2) lastDistance = null;
  });

  // ---- Block mobile double-tap zoom ----
  let lastTap = 0;
  window.addEventListener(
    "touchend",
    (e) => {
      const now = Date.now();
      if (now - lastTap < 300) {
        e.preventDefault();
      }
      lastTap = now;
    },
    { passive: false }
  );
}

function handleZoomCmds() {
  window.addEventListener("keydown", (e) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === "+" || e.key === "-" || e.key === "=" || e.key === "0")
    ) {
      e.preventDefault();
    }
  });
}

export function setupZoomListener() {
  // ---- Block browser zoom + trigger your zoom ----
  handleScrollWheel();

  // ---- Triggers my mobile zooming + blocks mobile zoom ----
  handleMobileZoom();

  // ---- Block CTRL+/-, CTRL+=, CTRL+0 ----
  handleZoomCmds();
}
