"use strict";
import { BaseLayer } from "./baseLayer.js";
import { resizeCanvasToWindow } from "../utils/canvasUtils.js";
import { FPSHandler } from "../fps.js";
import { intersects } from "../utils/math.js";

import {
  UIElements as homeBaseElements,
  buttons as homeBaseButtons,
} from "./uiData/homeBaseUI.js";

export class UILayer extends BaseLayer {
  constructor(parentCtx) {
    super(parentCtx, true);
    this.renderedFPS = FPSHandler.fps;

    this.UILoadouts = {
      homeBase: { btns: homeBaseButtons, elements: homeBaseElements },
    };
    this.currentUILoadout = "homeBase";
    this.currentUIData = this.loadUI(this.currentUILoadout);

    this.dirty = false;
  }
  updateText(buttons, elements) {
    // Merge both arrays into one flat list
    const allUIObjects = [
      ...Object.values(buttons),
      ...Object.values(elements),
    ];
    for (const obj of allUIObjects) {
      if (obj.updateText) obj.updateText();
    }
  }

  loadUI(key) {
    if (!this.UILoadouts[key]) {
      console.error("[UI LOAD ERROR]:", {
        missingKey: key,
        available: Object.keys(this.UILoadouts),
      });
      return null;
    }

    return this.UILoadouts[key];
  }

  resizeScreen() {
    resizeCanvasToWindow(this.canvas);
    const allUIObjects = [
      ...Object.values(this.currentUIData.btns),
      ...Object.values(this.currentUIData.elements),
    ];

    for (const obj of allUIObjects) {
      obj.dirty = true;
      if (obj.dynamicPosition) {
        obj.reposition();
      }
    }
  }

  update() {
    const buttons = Object.values(this.currentUIData.btns);
    const elements = Object.values(this.currentUIData.elements);

    const allObjects = [...buttons, ...elements];

    // Step 1: update text and mark dirty if needed
    for (const obj of allObjects) {
      if (obj.updateText) obj.updateText();
    }

    // Step 2: sort by zIndex
    allObjects.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    // Step 3: track dirty regions
    const dirtyObjects = allObjects.filter((obj) => obj.dirty);

    if (dirtyObjects.length === 0) return false;

    for (const dirty of dirtyObjects) {
      const dirtyBox = {
        x: dirty.x,
        y: dirty.y,
        w: dirty.width || 0,
        h: dirty.height || 0,
      };

      // Step 4: propagate dirtiness to overlapping higher-zIndex objects
      for (const obj of allObjects) {
        if (obj.zIndex > dirty.zIndex && intersects(dirtyBox, obj)) {
          obj.dirty = true;
        }
      }
    }

    // Step 5: redraw all objects in zIndex order
    for (const obj of allObjects) {
      if (obj.dirty) {
        if (obj.text || obj.bg || obj.sprite) {
          if (obj.width && obj.height) {
            this.ctx.clearRect(obj.x, obj.y, obj.width, obj.height);
          }
        }

        if (obj.isButton) {
          this.updateButton(obj);
        } else {
          this.updateElement(obj);
        }

        obj.dirty = false;
      }
    }

    this.dirty = true;
    return true;
  }

  updateButton(button) {
    if (!button.dirty) return false;

    const ctx = this.ctx;
    const x = Math.round(button.x);
    const y = Math.round(button.y);
    const w = Math.round(button.width);
    const h = Math.round(button.height);

    // Optional: clear entire canvas or button area
    ctx.clearRect(x, y, w, h);

    if (button.bg) {
      ctx.fillStyle = button.bgColor || "rgba(0,0,0,0.5)";
      ctx.fillRect(x, y, w, h);
    }

    if (button.border) {
      ctx.lineWidth = button.borderWidth || 1;
      ctx.strokeStyle = button.borderColor || "white";
      if (button.borderRound) {
        const radius = button.borderRadius || 0;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, radius);
        ctx.stroke();
      } else {
        ctx.strokeRect(x, y, w, h);
      }
    }

    if (button.text) {
      ctx.font = button.font || "16px Arial";
      ctx.textAlign = button.textAlign || "center";
      ctx.textBaseline = button.textBaseline || "middle";
      ctx.fillStyle = button.color || "white";
      ctx.fillText(button.text, x + w / 2, y + h / 2);
    }

    button.dirty = false;
    return true;
  }

  updateElement(element) {
    // if element needs to be updated
    if (!element.dirty) return false;

    const ctx = this.ctx;
    const x = Math.round(element.x);
    const y = Math.round(element.y);
    const w = Math.round(element.width);
    const h = Math.round(element.height);

    ctx.clearRect(x, y, w, h);

    // if element has a background
    if (element.bg) {
      // if element has a background color
      ctx.fillStyle = element.bgColor || "rgba(0,0,0,0.5)";
      ctx.fillRect(x, y, w, h);
    }

    // if element has a border
    if (element.border) {
      ctx.lineWidth = element.borderWidth || 1;
      ctx.strokeStyle = element.borderColor || "white";

      if (element.borderRound) {
        const radius = element.borderRadius || 0;

        ctx.beginPath();
        ctx.roundRect(x, y, w, h, radius);
        ctx.stroke();
      } else {
        ctx.strokeRect(x, y, w, h);
      }
    }

    if (element.text) {
      ctx.font = element.font || "16px Arial";
      ctx.textAlign = element.textAlign || "center";
      ctx.textBaseline = element.textBaseline || "top";
      ctx.fillStyle = element.textColor || "black";

      ctx.fillText(element.text, x, y);
    }
    element.dirty = false;
    return true;
  }

  render() {
    const ctx = this.parentCtx;
    ctx.drawImage(this.canvas, 0, 0);
  }
}
