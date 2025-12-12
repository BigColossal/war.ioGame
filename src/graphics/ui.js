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

    this.currentButtons = null;
    this.currentElements = null;
    this.allCurrentObjects = null;

    this.loadUI();

    this.dirty = false;
  }

  updateText() {
    // Merge both arrays into one flat list
    for (const obj of this.allCurrentObjects) {
      if (obj.updateText) obj.updateText();
    }
  }

  loadUI() {
    if (!this.UILoadouts[this.currentUILoadout]) {
      console.error("[UI LOAD ERROR]:", {
        missingKey: this.currentUILoadout,
        available: Object.keys(this.UILoadouts),
      });
      return;
    }
    const currentUIData = this.UILoadouts[this.currentUILoadout];
    this.currentButtons = Object.values(currentUIData.btns);
    this.currentElements = Object.values(currentUIData.elements);

    // sorts all objects by zIndex
    this.allCurrentObjects = this.sortAllCurrentObjects();
  }

  clearArea(x, y, w, h) {
    const ctx = this.ctx;
    ctx.clearRect(x, y, w, h);
  }

  resizeScreen() {
    resizeCanvasToWindow(this.canvas);

    for (const obj of this.allCurrentObjects) {
      obj.dirty = true;
      if (obj.dynamicPosition) {
        obj.reposition();
      }
    }
  }

  sortAllCurrentObjects() {
    const buttons = this.currentButtons;
    const elements = this.currentElements;

    // sorts all objects by z.index
    return [...buttons, ...elements].sort(
      (a, b) => (a.zIndex || 0) - (b.zIndex || 0)
    );
  }

  update() {
    // Step 1: update text and mark dirty if needed
    for (const obj of this.allCurrentObjects) {
      if (obj.updateText) obj.updateText();
    }

    // Step 3: track dirty regions
    const dirtyObjects = this.allCurrentObjects.filter((obj) => obj.dirty);

    if (dirtyObjects.length === 0) return false;

    for (const dirty of dirtyObjects) {
      const dirtyBox = {
        x: dirty.x,
        y: dirty.y,
        w: dirty.width || 0,
        h: dirty.height || 0,
      };

      // Step 4: propagate dirtiness to overlapping higher-zIndex objects
      for (const obj of this.allCurrentObjects) {
        if (obj.zIndex > dirty.zIndex && intersects(dirtyBox, obj)) {
          obj.dirty = true;
        }
      }
    }

    // Step 5: redraw all objects in zIndex order
    for (const obj of this.allCurrentObjects) {
      if (obj.dirty) {
        if (obj.text || obj.bg || obj.sprite) {
          if (obj.width && obj.height) {
            if (obj.isButton) {
            }
            this.clearArea(obj.x, obj.y, obj.width, obj.height);
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
    const x = button.x;
    const y = button.y;
    const w = button.width;
    const h = button.height;

    // Optional: clear entire canvas or button area

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
    const x = element.x;
    const y = element.y;
    const w = element.width;
    const h = element.height;

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
