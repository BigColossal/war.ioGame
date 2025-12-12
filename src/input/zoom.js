"use strict";
import { Camera } from "../camera.js";

function handleScrollWheel() {
  window.addEventListener(
    "wheel",
    (e) => {
      if (e.ctrlKey) e.preventDefault();

      if (Math.abs(e.deltaY) > 0.05) {
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        Camera.updateTargetZoom(factor);
        Camera.lastMouseX = e.clientX;
        Camera.lastMouseY = e.clientY;

        Camera.lastWheelTime = performance.now();
      }
    },
    { passive: false }
  );
}

function handleMobileZoom() {
  let lastDistance = null;
  let lastTap = 0;

  function pinchZoom(midX, midY, scaleChange) {
    Camera.updateTargetZoom(scaleChange);
    Camera.lastMouseX = midX;
    Camera.lastMouseY = midY;
  }

  window.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        Camera.isPinching = true;

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
          if (scaleChange > 1.025 || scaleChange < 0.975) {
            pinchZoom(midX, midY, scaleChange);
          }
        }

        lastDistance = distance;
      }
    },
    { passive: false }
  );

  window.addEventListener(
    "touchend",
    (e) => {
      // --- Pinch handling ---
      if (e.touches.length < 2) {
        Camera.isPinching = false;
        const hardMin = Camera.MinZoom;
        const hardMax = Camera.MaxZoom;

        if (Camera.targetZoom < hardMin) {
          Camera.targetZoom = hardMin;
          Camera.zoomSpringActive = true;
        } else if (Camera.targetZoom > hardMax) {
          Camera.targetZoom = hardMax;
          Camera.zoomSpringActive = true;
        }

        // Reset pinch distance
        lastDistance = null;
      }

      // --- Block mobile double-tap zoom ---
      const now = Date.now();
      if (now - lastTap < 300) {
        e.preventDefault(); // only prevent if really a double-tap
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
