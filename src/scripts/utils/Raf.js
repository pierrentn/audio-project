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
    this.rafId = window.requestAnimationFrame(() => this.tick());
  }

  pause() {
    window.cancelAnimationFrame(this.rafId);
  }
}

export default new Raf();
