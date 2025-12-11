"use strict";
import { BaseLayer } from "./baseLayer.js";
import { resizeCanvasToWindow } from "../utils/canvasUtils.js";

export class UILayer extends BaseLayer {
  constructor(parentCtx) {
    super(parentCtx);
    this.fpsHistory = [];
    this.lastFrameTime = performance.now();
    this.fps = 0;
    this.fpsSampleTime = 0.75 * 1000; // averaging window in ms

    // ---- FPS counter config ----
    this.fpsHistory = [];
    this.lastFrameTime = performance.now();
    this.fps = 0;
    this.fpsSampleTime = 0.75 * 1000; // averaging window in ms
    this.fpsCounter = {
      x: 10,
      y: 10,
      font: "18px Cause",
      color: "white",
    };

    // ---- Fullscreen button config ----
    this.fullscreenBtn = {
      x: window.innerWidth - 100,
      y: 0,
      width: 80,
      height: 30,
      text: "Fullscreen",
      bgColor: "#222",
      textColor: "#fff",
      font: "12px Arial",
    };
  }

  resizeScreen() {
    this.fullscreenBtn.x = window.innerWidth - 100;
    resizeCanvasToWindow(this.canvas);
  }

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
    this.fps = sum / this.fpsHistory.length;

    return true; // always redraw UI
  }

  render() {
    const ctx = this.parentCtx;

    ctx.save();

    // --- Render FPS counter ---
    ctx.font = this.fpsCounter.font;
    ctx.fillStyle = this.fpsCounter.color;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(
      `FPS: ${this.fps.toFixed(0)}`,
      this.fpsCounter.x,
      this.fpsCounter.y
    );

    // --- Render Fullscreen button ---
    const btn = this.fullscreenBtn;
    ctx.fillStyle = btn.bgColor;
    ctx.fillRect(btn.x, btn.y, btn.width, btn.height);

    ctx.fillStyle = btn.textColor;
    ctx.font = btn.font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(btn.text, btn.x + btn.width / 2, btn.y + btn.height / 2);

    ctx.restore();
  }
}
