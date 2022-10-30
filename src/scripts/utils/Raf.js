import { Clock } from "three";
import Emitter from "@js/utils/Emitter";

class Raf {
  constructor() {
    this.clock = new Clock();
    this.elapsed = 0;

    this.tick();
  }

  tick() {
    this.elapsed = this.clock.getElapsedTime();
    Emitter.emit("tick", this.elapsed);
    window.requestAnimationFrame(() => this.tick());
  }
}

export default new Raf();
