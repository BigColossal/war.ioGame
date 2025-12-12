"use strict";

export const FPSHandler = {
  fpsHistory: [],
  lastFrameTime: performance.now(),
  fps: 0,
  fpsSampleTime: 1 * 1000, // averaging window in ms

  update() {
    const now = performance.now();
    const delta = now - this.lastFrameTime;
    this.lastFrameTime = now;

    // Instant FPS
    const instantFPS = 1000 / delta;

    // Maintain history
    this.fpsHistory.push({ fps: instantFPS, time: now });
    while (
      this.fpsHistory.length &&
      now - this.fpsHistory[0].time > this.fpsSampleTime
    ) {
      this.fpsHistory.shift();
    }

    // Average FPS
    const sum = this.fpsHistory.reduce((acc, v) => acc + v.fps, 0);
    this.fps = Math.round(sum / this.fpsHistory.length);
  },
};
