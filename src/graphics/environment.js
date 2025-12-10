"use strict";
import { BaseLayer } from "./baseLayer.js";
import { MapSchema } from "../gameConfig.js";

export class EnvironmentLayer extends BaseLayer {
  constructor(parentCtx) {
    super(parentCtx);
  }

  update() {
    let changed = true;
    const fogPx = MapSchema.Dimensions.FogPx;
    const borderPaddingPx = MapSchema.Dimensions.BorderPaddingPx;
    const tileSize = MapSchema.Dimensions.TileSizePx;
    const widthPx = MapSchema.Dimensions.MapWidthPx - fogPx * 2;
    const heightPx = MapSchema.Dimensions.MapHeightPx - fogPx * 2;

    const ctx = this.ctx;

    // Outer Map
    ctx.fillStyle = "#3b7b3fff";
    ctx.fillRect(fogPx, fogPx, widthPx, heightPx);

    // Inner Map
    const baseWidthPx = widthPx - borderPaddingPx * 2;
    const baseHeightPx = heightPx - borderPaddingPx * 2;
    ctx.fillStyle = "#448347ff";
    ctx.fillRect(
      borderPaddingPx + fogPx,
      borderPaddingPx + fogPx,
      baseWidthPx,
      baseHeightPx
    );

    // ----- GRID LINES -----
    ctx.strokeStyle = "rgba(0,0,0,0.075)"; // faint lines
    ctx.lineWidth = 1;

    ctx.beginPath();

    // Vertical lines
    for (let x = fogPx; x <= fogPx + widthPx; x += tileSize) {
      ctx.moveTo(x, fogPx);
      ctx.lineTo(x, fogPx + heightPx);
    }

    // Horizontal lines
    for (let y = fogPx; y <= fogPx + heightPx; y += tileSize) {
      ctx.moveTo(fogPx, y);
      ctx.lineTo(fogPx + widthPx, y);
    }

    ctx.stroke();
    return changed;
  }
}
