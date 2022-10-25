import Emitter from "./utils/Emitter";
import Raf from "./utils/Raf";
import Engine from "./Engine";
import { Fog, Scene } from "three";
import Ressources from "./utils/Ressources";

class Experience {
  constructor() {
    this.raf = new Raf();

    this.ressources = Ressources;
    this.canvas = document.querySelector("#webgl-canvas");

    Emitter.on("tick", (e) => this.update(e));
    Emitter.on("loadingReady", (e) => this.init());
  }

  init() {
    this.scene = new Scene();
    // this.scene.fog = new Fog(0x000000, 1, 70);
    this.engine = new Engine(this.canvas, this.scene);
  }

  update(e) {
    const elapsed = e;
  }
}

export default Experience;
