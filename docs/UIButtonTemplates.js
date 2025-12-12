/**
 * BUTTON TEMPLATE PROPERTIES
 *
 * Position & Size
 * x, y           → Top-left coordinates.
 * width, height  → Dimensions of the button.
 * anchor         → "top-left" | "center" | "bottom-right"; useful for scaling/resizing.
 * padding        → Optional padding inside button content.
 * zIndex         → Draw order relative to other elements.
 *
 * Appearance
 * bg             → Boolean, does the button have a background?
 * bgColor        → Background color.
 * border         → Boolean or border style.
 * borderColor    → Border color.
 * hoverColor     → Background color when hovered.
 * pressedColor   → Background color when pressed/clicked.
 * font           → Font for button text.
 * color          → Text color.
 * opacity        → 0–1, for fade in/out effects.
 * sprite         → Optional image or sprite to render.
 * animated       → Boolean, true if using spritesheet animation.
 * frameIndex     → Current animation frame.
 * frameCount     → Total frames in animation.
 * frameRate      → FPS for the animation.
 *
 * Text / Content
 * text           → Static or computed string displayed on the button.
 * dynamicText    → Boolean, if text changes dynamically.
 * updateText()   → Function to update dynamic content.
 *
 * Interaction / Events
 * clickable      → Boolean, is the button interactive?
 * hoverable      → Boolean, for hover effects.
 * onClick()      → Function to call when button clicked.
 * onHover()      → Function to call when hovered.
 * draggable      → Boolean, if button can be dragged.
 * dragConstraints → Optional { minX, maxX, minY, maxY }.
 *
 * Scaling / Responsiveness
 * dynamicScaling → Boolean, scales with screen/window size.
 * scaleFactor    → Optional multiplier for scaling.
 * responsiveAnchor → Anchor point for dynamic scaling.
 *
 * Internal / Rendering
 * dirty          → Boolean, whether it needs to be re-rendered.
 * lastRenderedValue → Store last value for optimization.
 * hovered        → Boolean, is the mouse currently over this button?
 * pressed        → Boolean, is the button currently pressed?
 */

export const DefaultUIButton = {
  // Position & Size
  x: 0,
  y: 0,
  width: 120,
  height: 40,
  anchor: "top-left",
  padding: 5,
  zIndex: 1,

  // Appearance
  bg: true,
  bgColor: "rgba(0, 0, 0, 0.5)",
  border: true,
  borderColor: "white",
  hoverColor: "rgba(255, 255, 255, 0.2)",
  pressedColor: "rgba(255, 255, 255, 0.4)",
  font: "16px Arial",
  color: "white",
  opacity: 1,
  sprite: null,
  animated: false,
  frameIndex: 0,
  frameCount: 1,
  frameRate: 0,

  // Text / Content
  text: "Button",
  dynamicText: false,
  updateText: null,

  // Interaction / Events
  clickable: true,
  hoverable: true,
  onClick: null,
  onHover: null,
  draggable: false,
  dragConstraints: { minX: 0, maxX: Infinity, minY: 0, maxY: Infinity },

  // Scaling / Responsiveness
  dynamicPosition: false,
  dynamicScaling: false,
  scaleFactor: 1,
  responsiveAnchor: "top-left",

  // Internal / Rendering
  dirty: true,
  lastRenderedValue: null,
  hovered: false,
  pressed: false,
};
