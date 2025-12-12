/*
UI Element Property Reference

Position & Size:
  x, y           → Top-left coordinates.
  width, height  → Dimensions, if applicable.
  anchor         → "top-left" | "center" | "bottom-right"; useful for scaling/resizing.
  padding        → Optional padding inside element (for text boxes, bars, etc.).
  zIndex         → Draw order relative to other elements.

Appearance:
  bg             → Boolean, whether it has a background.
  bgColor        → Color for background.
  border         → Boolean or border style.
  borderColor    → Color of the border.
  opacity        → 0–1, for fading effects.
  font           → Font for text elements.
  color          → Text or main element color.
  sprite         → Optional image or sprite to render.
  animated       → Boolean, true if using spritesheet animation.
  frameIndex     → Current animation frame.
  frameCount     → Total frames in animation.
  frameRate      → FPS for the animation.

Text / Dynamic Content:
  text           → Static or computed string.
  dynamicText    → Boolean, if the text changes (like FPS, resources, timers).
  updateText()   → Function to update dynamic content.

Bars / Progress Indicators:
  type           → "bar" | "meter" | "circle" | "icon"
  value          → Current value (0–1 for percent, or absolute number).
  maxValue       → Max value for scaling.
  fillColor      → Bar color.
  bgFillColor    → Background bar color.
  animatedFill   → Boolean, for smooth fill animation.

Interaction / Events:
  clickable      → Boolean, is interactive?
  hoverable      → Boolean, for hover effects.
  onClick()      → Function when clicked.
  onHover()      → Function when hovered.
  draggable      → Boolean, if it can be dragged.
  dragConstraints→ Optional { minX, maxX, minY, maxY }

Scaling / Responsiveness:
  dynamicScaling → Boolean, scales with screen/window size.
  scaleFactor    → Optional multiplier for scaling.
  responsiveAnchor → Anchor point for dynamic scaling.

Internal / Rendering:
  dirty          → Boolean, whether it needs to be re-rendered.
  lastRenderedValue → Store last value for optimization.
*/

export const DefaultUIElement = {
  // Position & Size
  x: 0,
  y: 0,
  width: 100,
  height: 30,
  anchor: "top-left", // "top-left" | "center" | "bottom-right"
  zIndex: 0,

  // Appearance
  bg: false,
  bgColor: "rgba(0,0,0,0.5)",
  border: false,
  borderColor: "white",
  borderWidth: 0,
  borderRound: false,
  borderRadius: null,
  opacity: 1,

  font: "16px Arial",
  textAlign: "center",
  textColor: "white",
  textBaseline: "top",

  sprite: null, // Image object or path
  spriteSize: 16,
  animated: false,
  frameIndex: 0,
  frameCount: 1,
  frameRate: 0, // frames per second if animated

  // Text / Dynamic Content
  text: "",
  dynamicText: false,
  lastRenderedValue: null,
  updateText: null, // Function to update dynamic text

  // Bars / Progress Indicators
  type: "bar", // "bar" | "meter" | "circle" | "icon"
  value: 0, // 0-1 percentage or absolute
  maxValue: 1,
  fillColor: "green",
  bgFillColor: "gray",
  animatedFill: false,

  // Interaction / Events
  clickable: false,
  hoverable: false,
  onClick: null,
  onHover: null,
  onUpdate: null,
  draggable: false,
  dragConstraints: { minX: 0, maxX: Infinity, minY: 0, maxY: Infinity },

  // Scaling / Responsiveness
  dynamicScaling: false,
  scaleFactor: 1,
  responsiveAnchor: "top-left",

  // Internal / Rendering
  dirty: true,
};
