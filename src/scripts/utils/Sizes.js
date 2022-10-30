import Emitter from "@js/utils/Emitter";

class Sizes {
  constructor() {
    this.width = window.innerWidth + 1;
    this.height = window.innerHeight + 1;
    this.dpr = Math.min(window.devicePixelRatio, 2);

    window.addEventListener("resize", () => this.onResize());
  }

  onResize() {
    this.width = window.innerWidth + 1;
    this.height = window.innerHeight + 1;
    this.dpr = Math.min(window.devicePixelRatio, 2);
    Emitter.emit("resize");
  }
}

export default new Sizes();
