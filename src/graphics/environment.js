"use strict";
import { BaseLayer } from "./baseLayer.js";
import { MapSchema } from "../gameConfig.js";
import { Camera } from "../camera.js";
import { GameRenderer } from "./renderer.js";

export class EnvironmentLayer extends BaseLayer {
  constructor(parentCtx) {
    super(parentCtx, false);

    this.fogPx = MapSchema.Dimensions.FogPx;
    this.borderPaddingPx = MapSchema.Dimensions.BorderPaddingPx;
    this.tileSize = MapSchema.Dimensions.TileSizePx;
    this.mapWidthPx = MapSchema.Dimensions.MapWidthPx - this.fogPx * 2;
    this.mapHeightPx = MapSchema.Dimensions.MapHeightPx - this.fogPx * 2;
    this.baseWidthPx = this.mapWidthPx - this.borderPaddingPx * 2;
    this.baseHeightPx = this.mapHeightPx - this.borderPaddingPx * 2;

    this._gridPath = null;

    this.rendered = false;
  }

  buildGridPath() {
    const p = new Path2D();

    // translate origin to fogPx to reduce repeated additions
    // we will not actually translate the context here; instead we build the path using offsets
    const xStart = 0;
    const xEnd = this.mapWidthPx;
    const yStart = 0;
    const yEnd = this.mapHeightPx;

    for (let x = xStart; x <= xEnd; x += this.tileSize) {
      p.moveTo(this.fogPx + x, this.fogPx + yStart);
      p.lineTo(this.fogPx + x, this.fogPx + yEnd);
    }
    for (let y = yStart; y <= yEnd; y += this.tileSize) {
      p.moveTo(this.fogPx + xStart, this.fogPx + y);
      p.lineTo(this.fogPx + xEnd, this.fogPx + y);
    }

    return p;
  }

  update() {
    // only draw once unless something tells us to redraw
    if (this.rendered && !this.dirty) return false;

    const ctx = this.ctx;

    // Clear the whole canvas backing (logical coords due to transform)
    ctx.clearRect(
      0,
      0,
      MapSchema.Dimensions.MapWidthPx,
      MapSchema.Dimensions.MapHeightPx
    );

    // Outer area
    ctx.fillStyle = "#3b7b3fff";
    ctx.fillRect(this.fogPx, this.fogPx, this.mapWidthPx, this.mapHeightPx);

    // Inner area
    ctx.fillStyle = "#448347ff";
    ctx.fillRect(
      this.fogPx + this.borderPaddingPx,
      this.fogPx + this.borderPaddingPx,
      this.baseWidthPx,
      this.baseHeightPx
    );

    // Grid: use Path2D cached
    if (!this._gridPath) {
      this._gridPath = this.buildGridPath();
    }

    // Visual tweaks: align strokes to half pixels so 1px lines render crisply
    // Because we draw in logical pixels and DPR scaling has been applied via setTransform,
    // shifting by 0.5 gives crisp 1px lines on many devices.
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(0,0,0,0.125)";
    // don't call save/restore in a tight loop; just set properties directly
    ctx.beginPath();
    ctx.stroke(this._gridPath);

    this.bitmap = this.canvas.transferToImageBitmap();

    this.rendered = true;
    this.dirty = false;
    return true;
  }

  render() {
    const zoom = Camera.currentZoom;

    const srcWidth = GameRenderer.canvas.width / zoom;
    const srcHeight = GameRenderer.canvas.height / zoom;

    this.parentCtx.drawImage(
      this.bitmap,
      Camera.x,
      Camera.y,
      srcWidth,
      srcHeight,
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );
  }
}
