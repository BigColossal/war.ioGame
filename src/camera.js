"use strict";
import { MapSchema, MovementKeys } from "./gameConfig.js";
import { keys } from "./input/input.js";

export const Camera = {
  // top left corner coords of camera
  x: 0,
  y: 0,

  speed: 20,
  cameraBoundariesX: { left: 0, right: 0 },
  cameraBoundariesY: { top: 0, bottom: 0 },

  zoom: 1,
  mobileMinZoom: 0.25,
  PCMinZoom: 0.5,
  mobileMaxZoom: 1.1,
  PCMaxZoom: 1.1,

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
    const w = window.innerWidth / this.zoom;
    const h = window.innerHeight / this.zoom;

    const mapW = MapSchema.Dimensions.MapWidthPx;
    const mapH = MapSchema.Dimensions.MapHeightPx;

    this.cameraBoundariesX = {
      left: 0,
      right: Math.max(0, mapW - w),
    };

    this.cameraBoundariesY = {
      top: 0,
      bottom: Math.max(0, mapH - h),
    };
  },

  moveCamera(x, y, mobile = false) {
    // x camera movement
    if (!mobile) {
      const length = Math.hypot(x, y);
      if (length > 0) {
        x = (x / length) * this.speed;
        y = (y / length) * this.speed;
      }
    }

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
  zoomFunctionality(factor, mouseX, mouseY, mobile = false) {
    // Convert mouse from screen coords → world coords
    const worldBeforeX = this.x + mouseX / this.zoom;
    const worldBeforeY = this.y + mouseY / this.zoom;

    // Apply zoom
    const newZoom = this.zoom * factor;
    const maxZoom = mobile ? this.mobileMaxZoom : this.PCMaxZoom;
    const minZoom = mobile ? this.mobileMinZoom : this.PCMinZoom;
    this.zoom = Math.min(maxZoom, Math.max(minZoom, newZoom));

    // Convert back and adjust camera so world point stays the same
    const worldAfterX = this.x + mouseX / this.zoom;
    const worldAfterY = this.y + mouseY / this.zoom;
    console.log("deltaX:", worldBeforeX - worldAfterX);

    this.moveCamera(
      worldBeforeX - worldAfterX,
      worldBeforeY - worldAfterY,
      true
    );
    this.updateBoundaries();

    this.moved = true;
  },
};
