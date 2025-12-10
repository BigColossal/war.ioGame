"use strict";
import { MapSchema, MovementKeys } from "./gameConfig.js";
import { keys } from "./input.js";

export const Camera = {
  // top left corner coords of camera
  x: 0,
  y: 0,

  speed: 10,
  cameraBoundariesX: { left: 0, right: 0 },
  cameraBoundariesY: { top: 0, bottom: 0 },

  init() {
    this.updateBoundaries();

    const mapWidthPx = MapSchema.Dimensions.MapWidthPx;
    const mapHeightPx = MapSchema.Dimensions.MapHeightPx;

    this.x = mapWidthPx / 2 - window.innerWidth / 2;
    this.y = mapHeightPx / 2 - window.innerHeight / 2;
    this.moved = true;
    this.setupCameraResize();
  },

  setupCameraResize() {
    window.addEventListener("resize", () => {
      this.updateBoundaries();

      this.x = Math.max(
        this.cameraBoundariesX.left,
        Math.min(this.cameraBoundariesX.right, this.x)
      );
      this.y = Math.max(
        this.cameraBoundariesY.top,
        Math.min(this.cameraBoundariesY.bottom, this.y)
      );

      this.moved = true;
    });
  },

  updateBoundaries() {
    const mapWidthPx = MapSchema.Dimensions.MapWidthPx;
    const mapHeightPx = MapSchema.Dimensions.MapHeightPx;

    this.cameraBoundariesX = {
      left: 0,
      right: Math.max(0, mapWidthPx - window.innerWidth),
    };

    this.cameraBoundariesY = {
      top: 0,
      bottom: Math.max(0, mapHeightPx - window.innerHeight),
    };
  },

  moveCamera(x, y) {
    // x camera movement
    this.x = Math.max(
      this.cameraBoundariesX.left,
      Math.min(this.cameraBoundariesX.right, this.x + x)
    );

    this.y = Math.max(
      this.cameraBoundariesY.top,
      Math.min(this.cameraBoundariesY.bottom, this.y + y)
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
      yMovement -= this.speed;
      keyPressed = true;
    }
    if (MovingDown) {
      yMovement += this.speed;
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

  resetMovedState() {
    this.moved = false;
  },
};
