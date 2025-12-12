"use strict";
import { FPSHandler } from "../../fps.js";

export const buttons = {
  fullscreenBtn: {
    // Position & Size
    x: window.innerWidth - 100,
    y: 0,
    width: 80,
    height: 30,
    anchor: "top-left",
    zIndex: 0,

    // Appearance
    bg: true,
    bgColor: "#222",
    hoverColor: "#333",
    pressedColor: "#777",
    font: "12px Cause",
    textColor: "#fff",
    opacity: 1,
    dynamicPosition: true,
    reposition() {
      this.x = window.innerWidth - 100;
    },

    // Text / Content
    text: "Fullscreen",

    // Interaction / Events
    clickable: true,
    hoverable: true,
    onClick() {
      const docEl = document.documentElement;

      if (!document.fullscreenElement) {
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen();
        } else if (docEl.msRequestFullscreen) {
          docEl.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    },

    // Internal / Rendering
    dirty: true,
    hovered: false,
    pressed: false,
    isButton: true,
  },
};

export const UIElements = {
  FPSCounter: {
    // Position & Size
    x: 10,
    y: 10,
    width: 80,
    height: 30,
    zIndex: 0,

    // Appearance
    font: "18px Cause",
    textColor: "white",
    textAlign: "left",

    // Text / Dynamic Content
    text: "FPS: 60",
    dynamicText: true,
    ValueType: "FPS",
    lastRenderedValue: 60,
    updateText() {
      if (this.lastRenderedValue !== FPSHandler.fps) {
        this.lastRenderedValue = FPSHandler.fps;
        this.text = `FPS: ${Math.round(this.lastRenderedValue)}`;
        this.dirty = true;
      }
    },

    // Internal / Rendering
    dirty: true,
  },
};
