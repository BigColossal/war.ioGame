"use strict";

import { BaseLayer } from "./baseLayer";

export class EntitiesLayer extends BaseLayer {
  constructor(parentCtx) {
    super(parentCtx);
    this.resize();
  }
}
