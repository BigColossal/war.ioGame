"use strict";
import { MapSchema } from "./gameConfig.js";

export const Camera = {
  x: 0,
  y: 0,
  speed: 5,

  init() {
    const mapWidth = MapSchema.Dimensions.BaseWidthInTiles;
    const mapHeight = MapSchema.Dimensions.BaseHeightInTiles;
    const tileSizePx = MapSchema.Dimensions.TileSizePx;

    const mapWidthPx = mapWidth * tileSizePx;
    const mapHeightPx = mapHeight * tileSizePx;

    this.cameraBoundariesY = {
      top: mapHeightPx / 2,
      bottom: -(mapHeightPx / 2),
    };
    this.cameraBoundariesX = {
      right: mapWidthPx / 2,
      left: -(mapWidthPx / 2),
    };
  },

  moveCamera(x, y) {
    // x camera movement
    this.x = Math.max(
      this.cameraBoundariesX.left,
      Math.min(this.cameraBoundariesX.right, this.x + x)
    );

    this.y = Math.min(
      this.cameraBoundariesY.top,
      Math.max(this.cameraBoundariesY.bottom, this.y + y)
    );
  },
};
