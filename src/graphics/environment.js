"use strict";
import { BaseLayer } from "./baseLayer.js";
import { MapSchema } from "../gameConfig.js";
import { Camera } from "../camera.js";

export class EnvironmentLayer extends BaseLayer {
  constructor(parentCtx) {
    super(parentCtx);
    this.fogPx = MapSchema.Dimensions.FogPx;
    this.borderPaddingPx = MapSchema.Dimensions.BorderPaddingPx;
    this.tileSize = MapSchema.Dimensions.TileSizePx;
    this.mapWidthPx = MapSchema.Dimensions.MapWidthPx - this.fogPx * 2;
    this.mapHeightPx = MapSchema.Dimensions.MapHeightPx - this.fogPx * 2;
    this.baseWidthPx = this.mapWidthPx - this.borderPaddingPx * 2;
    this.baseHeightPx = this.mapHeightPx - this.borderPaddingPx * 2;

    this.rendered = false;
  }

  update() {
    // Outer Map
    if (!this.rendered) {
      this.ctx.fillStyle = "#3b7b3fff";
      this.ctx.fillRect(
        this.fogPx,
        this.fogPx,
        this.mapWidthPx,
        this.mapHeightPx
      );

      // Inner Map
      this.ctx.fillStyle = "#448347ff";
      this.ctx.fillRect(
        this.borderPaddingPx + this.fogPx,
        this.borderPaddingPx + this.fogPx,
        this.baseWidthPx,
        this.baseHeightPx
      );

      // ----- GRID LINES -----
      this.ctx.strokeStyle = "rgba(0,0,0,0.125)"; // faint lines
      this.ctx.lineWidth = 1;

      this.ctx.beginPath();

      // Vertical lines
      for (
        let x = this.fogPx;
        x <= this.fogPx + this.mapWidthPx;
        x += this.tileSize
      ) {
        this.ctx.moveTo(x, this.fogPx);
        this.ctx.lineTo(x, this.fogPx + this.mapHeightPx);
      }

      // Horizontal lines
      for (
        let y = this.fogPx;
        y <= this.fogPx + this.mapHeightPx;
        y += this.tileSize
      ) {
        this.ctx.moveTo(this.fogPx, y);
        this.ctx.lineTo(this.fogPx + this.mapWidthPx, y);
      }

      this.ctx.stroke();

      this.rendered = true;
      return true;
    }
    return false;
  }
}
