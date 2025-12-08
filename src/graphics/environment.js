"use strict";
import { BaseLayer } from "./baseLayer";

export class EnvironmentLayer extends BaseLayer {
  constructor(parentCtx) {
    super(parentCtx);
    this.resize();
  }
}
