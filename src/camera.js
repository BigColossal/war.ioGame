"use strict";
import { MapSchema, MovementKeys } from "./gameConfig.js";
import { keys } from "./input.js";

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

    this.moved = true;
  },

  moveCamera(x, y) {
    // x camera movement
    this.x = Math.max(
      this.cameraBoundariesX.left,
      Math.min(this.cameraBoundariesX.right, this.x + x)
    );

    this.y = Math.max(
      this.cameraBoundariesY.bottom,
      Math.min(this.cameraBoundariesY.top, this.y + y)
    );

    this.moved = true;
  },
  checkForMovement() {
    const MovingUp = MovementKeys.upKeys.some((k) => keys[k]);
    const MovingDown = MovementKeys.downKeys.some((k) => keys[k]);
    const MovingLeft = MovementKeys.leftKeys.some((k) => keys[k]);
    const MovingRight = MovementKeys.rightKeys.some((k) => keys[k]);

    let xMovement = 0;
    let yMovement = 0;
    let keyPressed = false;

    if (MovingUp) {
      yMovement += this.speed;
      keyPressed = true;
    }
    if (MovingDown) {
      yMovement -= this.speed;
      keyPressed = true;
    }

    if (MovingLeft) {
      xMovement -= this.speed;
      keyPressed = true;
    }

    if (MovingRight) {
      xMovement += this.speed;
      keyPressed = true;
    }
    if (keyPressed) {
      this.moveCamera(xMovement, yMovement);
    }
  },
};
