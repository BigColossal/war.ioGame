"use strict";

export const MapSchema = {
  Dimensions: {
    BaseWidthInTiles: 60,
    BaseHeightInTiles: 60,
    TileSizePx: 30,
  },

  BorderPadding: 5,
};

export const MovementKeys = {
  upKeys: ["w", "ArrowUp"],
  downKeys: ["s", "ArrowDown"],
  leftKeys: ["a", "ArrowLeft"],
  rightKeys: ["d", "ArrowRight"],
};
