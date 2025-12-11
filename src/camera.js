"use strict";
import { MapSchema, MovementKeys } from "./gameConfig.js";

export const Camera = {
  // top left corner coords of camera
  x: 0,
  y: 0,

  speed: 5,
  cameraBoundariesX: { left: 0, right: 0 },
  cameraBoundariesY: { top: 0, bottom: 0 },

  currentZoom: 1,
  targetZoom: 1,
  zoomLerpSpeed: 0.1,

  zoomSpringActive: false,
  zoomSpringSpeed: 8,
  lastWheelTime: 0,
  wheelSpringDelay: 120, // ms
  isPinching: false,

  mobileMinZoom: 0.25,
  PCMinZoom: 0.5,
  mobileMaxZoom: 1.1,
  PCMaxZoom: 1.1,
  get elasticPcMinZoom() {
    return this.PCMinZoom * 0.8;
  },

  get elasticPCMaxZoom() {
    return this.PCMaxZoom * 1.5;
  },

  get elasticMobileMinZoom() {
    return this.mobileMinZoom * 0.8;
  },

  get elasticMobileMaxZoom() {
    return this.mobileMaxZoom * 1.5;
  },

  isDragging: false,
  dragStartX: 0,
  dragStartY: 0,
  cameraStartX: 0,
  cameraStartY: 0,

  velX: 0,
  velY: 0,
  friction: 0.9,
  minVelocity: 0.05,
  lastDragTime: 0,
  lastDragX: 0,
  lastDragY: 0,

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
    const w = window.innerWidth / this.currentZoom;
    const h = window.innerHeight / this.currentZoom;

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

  checkForUpdates() {
    // const MovingUp = MovementKeys.upKeys.some((k) => keys[k]);
    // const MovingDown = MovementKeys.downKeys.some((k) => keys[k]);
    // const MovingLeft = MovementKeys.leftKeys.some((k) => keys[k]);
    // const MovingRight = MovementKeys.rightKeys.some((k) => keys[k]);

    // let xMovement = 0;
    // let yMovement = 0;
    // let keyPressed = false;

    // if (MovingUp) {
    //   yMovement -= this.speed;
    //   keyPressed = true;
    // }
    // if (MovingDown) {
    //   yMovement += this.speed;
    //   keyPressed = true;
    // }

    // if (MovingLeft) {
    //   xMovement -= this.speed;
    //   keyPressed = true;
    // }

    // if (MovingRight) {
    //   xMovement += this.speed;
    //   keyPressed = true;
    // }
    // if (keyPressed) {
    //   this.moveCamera(xMovement, yMovement);
    // }

    this.updateZoom();
    this.handleSpring();
    this.updateZoomSpring(0.016);
    this.updateInertia();
  },

  resetMovedState() {
    this.moved = false;
  },

  applySmoothZoom(oldZoom) {
    const mouseX = this.lastMouseX ?? window.innerWidth / 2;
    const mouseY = this.lastMouseY ?? window.innerHeight / 2;

    // world coords before zoom
    const worldBeforeX = this.x + mouseX / oldZoom;
    const worldBeforeY = this.y + mouseY / oldZoom;

    // world coords after zoom
    const worldAfterX = this.x + mouseX / this.currentZoom;
    const worldAfterY = this.y + mouseY / this.currentZoom;

    // adjust so mouse stays over same world point
    this.moveCamera(
      worldBeforeX - worldAfterX,
      worldBeforeY - worldAfterY,
      true
    );

    this.updateBoundaries();
    this.moved = true;
  },

  updateTargetZoom(factor, mobile) {
    this.targetZoom *= factor;

    const hardMin = mobile ? this.mobileMinZoom : this.PCMinZoom;
    const hardMax = mobile ? this.mobileMaxZoom : this.PCMaxZoom;

    // elastic range
    const elasticMin = hardMin * 0.8;
    const elasticMax = hardMax * 1.2;

    // allow temporarily stretching past real limits
    this.targetZoom = Math.min(
      elasticMax,
      Math.max(elasticMin, this.targetZoom)
    );

    // while user is actively zooming, we stop any springing
    this.zoomSpringActive = false;
  },

  updateZoom() {
    const oldZoom = this.currentZoom;

    // Lerp toward target
    this.currentZoom +=
      (this.targetZoom - this.currentZoom) * this.zoomLerpSpeed;

    // If zoom changed, adjust camera so mouse stays centered
    if (Math.abs(this.currentZoom - oldZoom) > 0.0001) {
      this.applySmoothZoom(oldZoom);
    }
  },

  updateInertia() {
    if (this.isDragging) return; // don't apply inertia while dragging

    // If velocity is tiny → stop
    if (
      Math.abs(this.velX) < this.minVelocity &&
      Math.abs(this.velY) < this.minVelocity
    ) {
      this.velX = 0;
      this.velY = 0;
      return;
    }

    // Apply movement
    this.moveCamera(
      this.velX * 16, // scale since vel is per ms and ~16ms per frame
      this.velY * 16,
      true
    );

    this.updateBoundaries();
    this.moved = true;

    // Apply friction
    this.velX *= this.friction;
    this.velY *= this.friction;
  },

  handleSpring() {
    if (!this.isDragging && !this.isPinching) {
      const hardMin = this.PCMinZoom;
      const hardMax = this.PCMaxZoom;

      if (performance.now() - this.lastWheelTime > this.wheelSpringDelay) {
        if (this.targetZoom < hardMin) {
          this.targetZoom = hardMin;
          this.zoomSpringActive = true;
        } else if (this.targetZoom > hardMax) {
          this.targetZoom = hardMax;
          this.zoomSpringActive = true;
        }
      }
    }
  },

  updateZoomSpring(dt) {
    if (!this.zoomSpringActive) return;

    const oldZoom = this.currentZoom;

    this.currentZoom +=
      (this.targetZoom - this.currentZoom) * this.zoomSpringSpeed * dt;

    if (Math.abs(this.currentZoom - this.targetZoom) < 0.001) {
      this.currentZoom = this.targetZoom;
      this.zoomSpringActive = false;
    }

    // maintain center-of-zoom properly
    this.applySmoothZoom(oldZoom);
  },
};
