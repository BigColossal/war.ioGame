"use strict";
import { BaseLayer } from "./baseLayer";

export class UILayer extends BaseLayer {
  constructor(parentCtx) {
    super(parentCtx);
    this.resize();
  }
}
