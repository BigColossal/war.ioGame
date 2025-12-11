"use strict";

export const MapSchema = {
  Dimensions: {
    BaseWidthInTiles: 60,
    BaseHeightInTiles: 60,
    BorderPaddingInTiles: 8,
    FogPaddingInTiles: 12,
    TileSizePx: 50,

    get BaseWidthPx() {
      return this.BaseWidthInTiles * this.TileSizePx;
    },

    get BaseHeightPx() {
      return this.BaseHeightInTiles * this.TileSizePx;
    },

    get MapWidthPx() {
      return (
        (this.BaseWidthInTiles +
          this.BorderPaddingInTiles * 2 +
          this.FogPaddingInTiles * 2) *
        this.TileSizePx
      );
    },
    get MapHeightPx() {
      return (
        (this.BaseHeightInTiles +
          this.BorderPaddingInTiles * 2 +
          this.FogPaddingInTiles * 2) *
        this.TileSizePx
      );
    },
    get FogPx() {
      return this.FogPaddingInTiles * this.TileSizePx;
    },
    get BorderPaddingPx() {
      return this.BorderPaddingInTiles * this.TileSizePx;
    },
  },
};

export const MovementKeys = {
  upKeys: ["w", "ArrowUp"],
  downKeys: ["s", "ArrowDown"],
  leftKeys: ["a", "ArrowLeft"],
  rightKeys: ["d", "ArrowRight"],
};
