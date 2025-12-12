"use strict";

export function intersects(a, b) {
  return (
    a.x < b.x + (b.width || 0) &&
    a.x + a.w > b.x &&
    a.y < b.y + (b.height || 0) &&
    a.y + a.h > b.y
  );
}
